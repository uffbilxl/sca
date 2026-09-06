import { prisma } from '../../src/lib/prisma'

/* Retires listings whose application link is definitively gone.
 *
 * The existing sweeps miss these entirely. Source-scoped closing only touches
 * domains covered by the current run, and deadline closing needs a deadline —
 * a large share of rows have none. So a job pulled from an employer's careers
 * site stays OPEN forever, and students click through to "Job no longer
 * found", which is exactly what was reported.
 *
 * The whole risk here is closing something that is actually live, so the
 * classifier is deliberately asymmetric: only unambiguous evidence of removal
 * counts as dead. Anything that merely looks wrong — a bot block, a timeout,
 * a server error, a login wall — is inconclusive and left alone. */

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
const CONCURRENCY = 8
const TIMEOUT_MS = 15000

/* Phrases ATS platforms show on a removed posting. Matched only against a
 * successful response body, and kept narrow: "closed" or "expired" alone are
 * far too common on a live page (application deadlines, cookie banners,
 * "closed captions") to be safe. */
const GONE_PHRASES = [
  'job no longer',
  'no longer available',
  'no longer accepting applications',
  'no longer being accepted',
  'this job is closed',
  'this vacancy is closed',
  'vacancy has expired',
  'this position has been filled',
  'position is no longer',
  'posting has expired',
  'job posting has been removed',
  'job not found',
  'requisition is closed',
  'we are no longer accepting',
  'sorry, this job is no longer',
]

export type LinkVerdict = 'dead' | 'alive' | 'inconclusive'

/* Applicant tracking systems that serve an empty JavaScript shell to every
 * URL, valid or not, and block automated clients outright. A 200 from these
 * means only that their front door answered — Workday returned a healthy 200
 * for an HP placement that had been gone for months, and blocks headless
 * browsers too, so there is no way to tell from here. Reporting them as alive
 * was false confidence; they are inconclusive by construction. */
const UNVERIFIABLE_ATS = [
  'myworkdayjobs.com',
  'icims.com',
  'taleo.net',
  'successfactors.com',
  'brassring.com',
]

export function isUnverifiableAts(url: string): boolean {
  try {
    const host = new URL(url).hostname.toLowerCase()
    return UNVERIFIABLE_ATS.some(d => host === d || host.endsWith('.' + d))
  } catch {
    return false
  }
}

/* Applicant tracking systems rarely 404 a removed posting. Greenhouse
 * redirects to the company's board root with ?error=true and returns 200,
 * which reads as a perfectly healthy page — six Graphcore roles and one
 * Marshall Wace role were live on the homepage this way.
 *
 * The reliable signal is that the job's own identifier disappears from the
 * final URL: a real redirect (canonicalisation, locale, tracking) keeps it,
 * whereas being bounced to a board index cannot. Requiring the identifier to
 * vanish is what keeps this from firing on ordinary redirects. */
export function redirectedAwayFromJob(requested: string, final: string): boolean {
  if (!final || final === requested) return false

  let requestedPath: string
  try {
    requestedPath = new URL(requested).pathname
  } catch {
    return false
  }

  // A long digit run or a uuid-ish segment is the job id on every ATS we use.
  const segments = requestedPath.split('/').filter(Boolean).reverse()
  const jobId = segments.find(seg => /^\d{5,}$/.test(seg) || /^[0-9a-f]{8}-[0-9a-f-]{8,}$/i.test(seg))
  if (!jobId) return false

  return !final.includes(jobId)
}

export function classifyBody(status: number, body: string): LinkVerdict {
  // 404/410 are the unambiguous ones: the resource is gone.
  if (status === 404 || status === 410) return 'dead'

  // Bot mitigation, auth walls, rate limits and outages say nothing about
  // whether the job exists. Never close on these.
  if (status === 401 || status === 403 || status === 429 || status >= 500) return 'inconclusive'

  if (status >= 200 && status < 300) {
    const haystack = body.toLowerCase().replace(/\s+/g, ' ')
    if (GONE_PHRASES.some(p => haystack.includes(p))) return 'dead'
    return 'alive'
  }

  return 'inconclusive'
}

async function checkUrl(url: string): Promise<LinkVerdict> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
    })
    // Only read the body when the status alone is not decisive.
    // Bounced to a board index or an explicit error page: the posting is gone
    // even though the response is a healthy 200.
    if (res.status >= 200 && res.status < 300) {
      if (/[?&]error=true\b/.test(res.url)) return 'dead'
      if (redirectedAwayFromJob(url, res.url)) return 'dead'
    }

    const body = res.status >= 200 && res.status < 300 ? (await res.text()).slice(0, 200_000) : ''
    const verdict = classifyBody(res.status, body)

    // An explicit removal signal still counts; a bare 200 does not.
    if (verdict === 'alive' && isUnverifiableAts(url)) return 'inconclusive'
    return verdict
  } catch {
    return 'inconclusive' // DNS failure, TLS error, timeout — all unprovable
  } finally {
    clearTimeout(timer)
  }
}

export interface LinkCheckResult {
  checked: number
  dead: number
  alive: number
  inconclusive: number
  closedTitles: string[]
  /* Listings on ATS platforms we cannot check, named so a committee member can
   * spot-check them. They stay listed; we just stop pretending we verified. */
  unverifiable: string[]
}

export async function sweepDeadLinks(opts: { dryRun?: boolean } = {}): Promise<LinkCheckResult> {
  const live = await prisma.opportunity.findMany({
    where: { status: { not: 'CLOSED' } },
    select: { id: true, title: true, applyUrl: true, company: { select: { name: true } } },
  })

  const targets = live.filter(o => o.applyUrl && /^https?:\/\//i.test(o.applyUrl))
  const result: LinkCheckResult = { checked: targets.length, dead: 0, alive: 0, inconclusive: 0, closedTitles: [], unverifiable: [] }
  const deadIds: string[] = []

  let cursor = 0
  async function worker() {
    while (cursor < targets.length) {
      const item = targets[cursor++]
      const verdict = await checkUrl(item.applyUrl!)
      if (verdict === 'dead') {
        result.dead++
        deadIds.push(item.id)
        result.closedTitles.push(`${item.title} (${item.company?.name ?? 'unknown'})`)
      } else if (verdict === 'alive') result.alive++
      else {
        result.inconclusive++
        if (isUnverifiableAts(item.applyUrl!)) {
          result.unverifiable.push(`${item.title} (${item.company?.name ?? 'unknown'})`)
        }
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  if (deadIds.length > 0 && !opts.dryRun) {
    await prisma.opportunity.updateMany({ where: { id: { in: deadIds } }, data: { status: 'CLOSED' } })
  }

  return result
}
