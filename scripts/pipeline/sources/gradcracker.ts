import type { Page } from 'playwright'
import type { RawListing } from '../types'
import { paginate } from './util'

export const DOMAIN = 'gradcracker.com'

const SEARCH_URLS = [
  'https://www.gradcracker.com/search/computing-technology/graduate-jobs',
  'https://www.gradcracker.com/search/computing-technology/placements-internships',
]

/* Gradcracker's own "Apply online now" button is a tracked outbound
 * redirect containing the real destination — decodable without following
 * it. We deliberately don't chase it: doing so means visiting every
 * listing's own detail page (~80/page), and testing that at realistic
 * volume tripped Cloudflare's rate limiting hard enough to briefly block
 * even the listing page itself. Not worth the risk to the source that
 * already works reliably — applyUrl stays the Gradcracker listing page. */

/* Gradcracker renders real listing cards as <article> elements, but also
 * ships a hidden aria-hidden="true" honeypot <article> per page — a common
 * anti-bot trap for scrapers that blindly follow every link. We explicitly
 * skip anything aria-hidden.
 *
 * Results are paginated at ?page=N with ~80 per page. We previously read
 * only page 1, which capped this source at 80 listings when graduate-jobs
 * alone carries several pages. Paging is throttled and challenge-aware
 * (see util.ts): requesting pages back to back reliably trips Cloudflare. */
export async function scrapeGradcracker(page: Page, warnings: string[] = []): Promise<RawListing[]> {
  const listings: RawListing[] = []

  for (const url of SEARCH_URLS) {
    const typeHint = url.includes('graduate-jobs') ? 'Graduate Job' : 'Placement/Internship'

    const cards = await paginate(
      page,
      url,
      () =>
        page.evaluate(() => {
          const out: { title: string; href: string; company: string; text: string }[] = []
          for (const el of Array.from(document.querySelectorAll('article'))) {
            if (el.getAttribute('aria-hidden') === 'true') continue
            const titleLink = Array.from(el.querySelectorAll('a')).find(
              a => a.href.includes('/hub/') && a.innerText.trim().length > 3
            )
            if (!titleLink) continue
            const img = el.querySelector('img')
            out.push({
              title: titleLink.innerText.trim(),
              href: titleLink.href,
              company: img?.getAttribute('alt')?.trim() || '',
              text: (el as HTMLElement).innerText,
            })
          }
          return out
        }),
      { label: `Gradcracker ${typeHint}`, warnings, readySelector: 'article', settleMs: 2500 },
    )

    for (const c of cards) {
      if (!c.title || !c.href || !c.company) continue
      const lines = c.text.split('\n').map(l => l.trim()).filter(Boolean)
      const grab = (label: string) => {
        const i = lines.findIndex(l => l.toLowerCase().startsWith(label.toLowerCase()))
        if (i === -1) return undefined
        // value is either after a colon on the same line, or the next line
        const same = lines[i].split(':')[1]?.trim()
        return same || lines[i + 1]
      }
      listings.push({
        sourceDomain: DOMAIN,
        sourceUrl: c.href,
        title: c.title,
        company: c.company,
        location: grab('Location'),
        deadlineText: grab('Deadline'),
        salaryText: grab('Salary'),
        typeHint,
        descriptionRaw: lines.slice(1, 4).join(' '),
      })
    }
  }

  // De-dupe (multiple category pages can surface the same listing)
  const seen = new Set<string>()
  return listings.filter(l => (seen.has(l.sourceUrl) ? false : (seen.add(l.sourceUrl), true)))
}
