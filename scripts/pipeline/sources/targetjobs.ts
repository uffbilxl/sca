import type { Page } from 'playwright'
import type { RawListing } from '../types'
import { sleep } from './util'

export const DOMAIN = 'targetjobs.co.uk'

const SEARCH_URLS = [
  'https://targetjobs.co.uk/graduate-jobs/it',
  'https://targetjobs.co.uk/internships/it',
]

/* TargetJobs' own search page calls a JSON search API
 * (ext/svc/inferno-search-service-1-0/search) to render results. That API
 * silently returns zero results without the session state a real page load
 * establishes — rather than replicate that (which would cross into working
 * around bot mitigation), we just navigate normally with Playwright and
 * capture the same response the page's own JavaScript receives. */
/* The API returns 21 documents per call and the page exposes the rest behind
 * a "Load More" button, so a single page load captures well under a fifth of
 * a category (IT graduate jobs reports 114 results). We click that button
 * until the captured count reaches result_count, rather than replaying the
 * POST ourselves with our own offsets — same reasoning as above, we drive
 * the real page and read what its own JavaScript receives. */
const MAX_LOAD_MORE_CLICKS = 20

export async function scrapeTargetJobs(page: Page, warnings: string[] = []): Promise<RawListing[]> {
  const listings: RawListing[] = []

  for (const url of SEARCH_URLS) {
    const captured: any[] = []
    let resultCount: number | null = null
    const onResponse = async (resp: any) => {
      if (!resp.url().includes('inferno-search-service')) return
      try {
        const data = await resp.json()
        if (typeof data?.search?.result_count === 'number') resultCount = data.search.result_count
        const docs = data?.search?.documents
        if (Array.isArray(docs)) captured.push(...docs)
      } catch { /* non-JSON or unrelated response */ }
    }
    page.on('response', onResponse)

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
      await sleep(5000)

      for (let i = 0; i < MAX_LOAD_MORE_CLICKS; i++) {
        if (resultCount !== null && captured.length >= resultCount) break
        const before = captured.length

        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        const button = await page.$('button:has-text("Load More"), button:has-text("Load more"), a:has-text("Load More")')
        if (!button) break
        try {
          await button.click()
        } catch {
          break // button detached because the list finished loading
        }
        await sleep(2500)

        if (captured.length === before) break // clicked but nothing new arrived
      }

      if (resultCount !== null && captured.length < resultCount) {
        warnings.push(`TargetJobs ${url.split('/').slice(-2).join('/')}: captured ${captured.length} of ${resultCount} results`)
      }
    } catch (err) {
      warnings.push(`TargetJobs ${url.split('/').slice(-2).join('/')}: ${(err as Error).message.split('\n')[0]}`)
      /* continue with whatever was captured */
    } finally {
      page.off('response', onResponse)
    }

    for (const d of captured) {
      const path = d.path
      if (!path || !d.title) continue
      const tjUrl = path.startsWith('http') ? path : `https://targetjobs.co.uk${path}`
      const deadline = typeof d.applicationDeadline === 'number'
        ? new Date(d.applicationDeadline * 1000).toISOString().slice(0, 10)
        : undefined
      const salary = d.salary?.lower
        ? `£${d.salary.lower}${d.salary.upper && d.salary.upper !== d.salary.lower ? `-£${d.salary.upper}` : ''}`
        : undefined

      listings.push({
        sourceDomain: DOMAIN,
        // sourceUrl stays the TargetJobs listing page (stable identity, used
        // for dedup/closing); applyUrl is the real employer/ATS destination,
        // already present in the API response — no extra request needed.
        sourceUrl: tjUrl,
        applyUrl: d.applicationUrl || undefined,
        title: d.title,
        company: d.organisation?.title || 'Unknown',
        location: Array.isArray(d.location) ? d.location.join(', ') : d.location,
        deadlineText: deadline,
        salaryText: salary,
        typeHint: Array.isArray(d.opportunityType) ? d.opportunityType[0] : d.opportunityType,
        descriptionRaw: typeof d.body === 'string' ? d.body.replace(/<[^>]+>/g, ' ').slice(0, 1500) : undefined,
      })
    }
  }

  const seen = new Set<string>()
  return listings.filter(l => (seen.has(l.sourceUrl) ? false : (seen.add(l.sourceUrl), true)))
}
