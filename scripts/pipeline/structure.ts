import type { RawListing } from './types'

/* Converts raw scraped listings into rows matching the exact shape
 * importOpportunityRows() expects (src/lib/importOpportunities.ts) — the
 * same column names the manual CSV import already uses, via field(). Using
 * Gemini's structured JSON output mode so the model can't return anything
 * that doesn't match the schema. */

/* An alias Google keeps pointed at their current recommended lite/fast
 * model, rather than a pinned version — avoids silently breaking again
 * when a specific dated model gets deprecated for new API keys. The
 * "lite" tier specifically: the flagship "latest" model's free tier is
 * capped at just 20 requests/DAY (discovered the hard way), nowhere near
 * enough for a ~230-listing run; lite models are built for exactly this
 * kind of high-volume, low-complexity structured-extraction task and get
 * a much more generous free-tier daily allowance. */
const MODEL = 'gemini-flash-lite-latest'
const BATCH_SIZE = 12 // listings per LLM call — keeps prompts small and cheap
const VALID_TYPES = ['INTERNSHIP', 'PLACEMENT', 'GRADUATE', 'SPRING_WEEK', 'INSIGHT'] as const
const VALID_WORK_MODES = ['REMOTE', 'HYBRID', 'ONSITE'] as const

const RESPONSE_SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      index: { type: 'INTEGER', description: 'The input listing index this row corresponds to' },
      title: { type: 'STRING' },
      company: { type: 'STRING' },
      type: { type: 'STRING', enum: [...VALID_TYPES] },
      location: { type: 'STRING' },
      workMode: { type: 'STRING', enum: [...VALID_WORK_MODES] },
      description: { type: 'STRING', description: 'A concise 2-4 sentence plain-text summary, no HTML' },
      startDate: { type: 'STRING', description: 'e.g. "Summer 2026", or empty string if unknown' },
      deadline: { type: 'STRING', description: 'ISO date YYYY-MM-DD, or "Rolling" if ongoing/ASAP, or empty string if unknown' },
      sponsored: { type: 'BOOLEAN', description: 'true only if visa sponsorship is explicitly mentioned' },
      relevant: { type: 'BOOLEAN', description: 'true only if this role is realistically relevant to a computing/tech/software/data/cyber security student' },
    },
    required: ['index', 'title', 'company', 'type', 'location', 'workMode', 'description', 'relevant'],
  },
}

function buildPrompt(batch: RawListing[]): string {
  const items = batch.map((l, i) => ({
    index: i,
    title: l.title,
    company: l.company,
    location: l.location || '',
    deadlineText: l.deadlineText || '',
    salaryText: l.salaryText || '',
    typeHint: l.typeHint || '',
    description: (l.descriptionRaw || '').slice(0, 800),
  }))

  return `You are structuring raw scraped UK student job listings for a Birmingham City University computing society website. For each listing, produce one structured row.

Rules:
- type: SPRING_WEEK/INSIGHT for first/second-year taster programmes, PLACEMENT for year-long industrial placements, GRADUATE for graduate schemes/jobs, INTERNSHIP for everything else (summer internships, internships of any length).
- workMode: infer from the location/description text; default HYBRID if genuinely unclear.
- deadline: convert any human date into YYYY-MM-DD. If it says "Ongoing", "Rolling", or no real deadline is given, return "Rolling".
- relevant: set to false for roles clearly outside computing/tech (e.g. pure marketing, HR, law, retail, finance-only analyst roles with no technical component). Set true for software, data, AI, cyber security, IT, engineering-with-a-tech-component roles.
- Never invent facts not present in the input. If something is genuinely unknown, use an empty string (except deadline, which becomes "Rolling").

Input listings:
${JSON.stringify(items, null, 2)}

Return one row per input listing, in the same order, each tagged with its original "index".`
}

export interface StructuredRow {
  title: string
  company: string
  type: string
  location: string
  workMode: string
  description: string
  startDate?: string
  deadline?: string
  sponsored: boolean
  relevant: boolean
}

const MAX_RETRIES = 5
const MIN_DELAY_MS = 13_000 // free tier is 5 requests/minute — stay comfortably under that

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/* Pulls the server-suggested retry delay (e.g. "53s") out of a 429 body,
 * falling back to a conservative default if it's missing or unparsable. */
function parseRetryDelayMs(errorBody: string): number {
  const match = errorBody.match(/"retryDelay":\s*"(\d+)s"/)
  return match ? parseInt(match[1], 10) * 1000 + 1000 : MIN_DELAY_MS
}

async function structureBatch(batch: RawListing[], apiKey: string): Promise<Map<number, StructuredRow>> {
  let lastErr: Error = new Error('unknown error')

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(batch) }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
            temperature: 0.1,
          },
        }),
      }
    )

    if (res.ok) {
      const data = await res.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) throw new Error('Gemini returned no content')
      const rows: (StructuredRow & { index: number })[] = JSON.parse(text)
      const map = new Map<number, StructuredRow>()
      for (const r of rows) map.set(r.index, r)
      return map
    }

    const bodyText = await res.text()
    lastErr = new Error(`Gemini API error ${res.status}: ${bodyText}`)

    // 429 (rate limit) and 503 (temporarily overloaded) are worth retrying;
    // anything else (bad request, auth failure) won't fix itself.
    if (res.status !== 429 && res.status !== 503) throw lastErr

    const delay = res.status === 429 ? parseRetryDelayMs(bodyText) : MIN_DELAY_MS
    console.warn(`Batch got ${res.status}, retrying in ${Math.round(delay / 1000)}s (attempt ${attempt + 1}/${MAX_RETRIES})`)
    await sleep(delay)
  }

  throw lastErr
}

export async function structureListings(
  listings: RawListing[],
  apiKey: string
): Promise<{ row: Record<string, string>; source: RawListing }[]> {
  const out: { row: Record<string, string>; source: RawListing }[] = []

  for (let i = 0; i < listings.length; i += BATCH_SIZE) {
    const batchStart = Date.now()
    const batch = listings.slice(i, i + BATCH_SIZE)
    let structured: Map<number, StructuredRow>
    try {
      structured = await structureBatch(batch, apiKey)
    } catch (err) {
      console.error(`Structuring batch ${i}-${i + batch.length} failed after retries:`, err)
      continue // skip this batch, don't fail the whole run
    }

    batch.forEach((listing, localIdx) => {
      const s = structured.get(localIdx)
      if (!s || s.relevant === false) return

      out.push({
        source: listing,
        row: {
          title: s.title,
          company: s.company,
          type: VALID_TYPES.includes(s.type as any) ? s.type : 'INTERNSHIP',
          location: s.location || listing.location || 'United Kingdom',
          workmode: VALID_WORK_MODES.includes(s.workMode as any) ? s.workMode : 'HYBRID',
          applyurl: listing.sourceUrl,
          description: s.description,
          startdate: s.startDate || '',
          deadline: s.deadline && s.deadline !== 'Rolling' ? s.deadline : '',
          sponsored: s.sponsored ? 'true' : 'false',
        },
      })
    })

    // Pace calls to stay under the free tier's 5 requests/minute cap, even
    // when nothing failed — only sleep off whatever time the call itself
    // didn't already use.
    const elapsed = Date.now() - batchStart
    if (elapsed < MIN_DELAY_MS && i + BATCH_SIZE < listings.length) {
      await sleep(MIN_DELAY_MS - elapsed)
    }
  }

  return out
}
