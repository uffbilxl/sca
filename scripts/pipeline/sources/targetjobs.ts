import type { Page } from 'playwright'
import type { RawListing } from '../types'

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
export async function scrapeTargetJobs(page: Page): Promise<RawListing[]> {
  const listings: RawListing[] = []

  for (const url of SEARCH_URLS) {
    const captured: any[] = []
    const onResponse = async (resp: any) => {
      if (!resp.url().includes('inferno-search-service')) return
      try {
        const data = await resp.json()
        const docs = data?.search?.documents
        if (Array.isArray(docs)) captured.push(...docs)
      } catch { /* non-JSON or unrelated response */ }
    }
    page.on('response', onResponse)

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
      await page.waitForTimeout(1500)
    } catch {
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
