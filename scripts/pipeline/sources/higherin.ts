import type { Page } from 'playwright'
import type { RawListing } from '../types'
import { paginate } from './util'

export const DOMAIN = 'higherin.com'

const SEARCH_URLS = [
  'https://higherin.com/search-jobs/internships',
  'https://higherin.com/search-jobs/graduates',
  'https://higherin.com/search-jobs/placements',
]

/* HigherIn (formerly RateMyPlacement/RateMyApprenticeship) renders results
 * client-side. Job title links are the only reliable anchor — they match
 * /jobs/{numericId}/{company-slug}/{title-slug}. Everything else (company,
 * deadline, salary, location) is read from the surrounding card's text.
 *
 * Results are paginated at ?page=N with only 20 per page — graduates alone
 * reports 152 results across 8 pages. Reading page 1 only, as this did
 * previously, surfaced barely an eighth of the source. */
export async function scrapeHigherIn(page: Page, warnings: string[] = []): Promise<RawListing[]> {
  const listings: RawListing[] = []

  for (const url of SEARCH_URLS) {
    const cards = await paginate(
      page,
      url,
      () =>
        page.evaluate(() => {
          const out: { href: string; text: string }[] = []
          const links = Array.from(document.querySelectorAll('a')).filter(a =>
            /higherin\.com\/jobs\/\d+\//.test(a.href) && a.innerText.trim().length > 20
          )
          const seen = new Set<string>()
          for (const link of links) {
            if (seen.has(link.href)) continue
            seen.add(link.href)
            // The title link's own innerText already contains the whole card:
            // title / company / "Deadline: ..." / type / salary? / location
            out.push({ href: link.href, text: (link as HTMLElement).innerText })
          }
          return out
        }),
      { label: `HigherIn ${url.split('/').pop()}`, warnings, readySelector: 'a[href*="/jobs/"]', settleMs: 3000 },
    )

    for (const c of cards) {
      const lines = c.text.split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length < 2) continue
      const [title, company, ...rest] = lines
      const grab = (label: string) => {
        const line = rest.find(l => l.toLowerCase().startsWith(label.toLowerCase()))
        return line?.split(':')[1]?.trim()
      }
      const salaryText = rest.find(l => /£/.test(l))
      // Location is the trailing line that isn't a deadline/type/salary label
      const location = [...rest].reverse().find(
        l => !/^deadline/i.test(l) && !/£/.test(l) && l !== salaryText && l.length < 100
      )

      listings.push({
        sourceDomain: DOMAIN,
        sourceUrl: c.href,
        title,
        company: company || 'Unknown',
        location,
        deadlineText: grab('Deadline'),
        salaryText,
        typeHint: rest.find(l => /internship|graduate|placement|apprentice|insight/i.test(l)) || url.split('/').pop(),
        descriptionRaw: lines.join(' '),
      })
    }
  }

  const seen = new Set<string>()
  return listings.filter(l => (seen.has(l.sourceUrl) ? false : (seen.add(l.sourceUrl), true)))
}
