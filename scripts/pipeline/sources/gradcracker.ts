import type { Page } from 'playwright'
import type { RawListing } from '../types'

export const DOMAIN = 'gradcracker.com'

const SEARCH_URLS = [
  'https://www.gradcracker.com/search/computing-technology/graduate-jobs',
  'https://www.gradcracker.com/search/computing-technology/placements-internships',
]

/* Gradcracker renders real listing cards as <article> elements, but also
 * ships a hidden aria-hidden="true" honeypot <article> per page — a common
 * anti-bot trap for scrapers that blindly follow every link. We explicitly
 * skip anything aria-hidden. */
export async function scrapeGradcracker(page: Page): Promise<RawListing[]> {
  const listings: RawListing[] = []

  for (const url of SEARCH_URLS) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    } catch {
      continue // one category failing shouldn't sink the whole source
    }

    const cards = await page.evaluate(() => {
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
    })

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
        typeHint: url.includes('graduate-jobs') ? 'Graduate Job' : 'Placement/Internship',
        descriptionRaw: lines.slice(1, 4).join(' '),
      })
    }
  }

  // De-dupe (multiple category pages can surface the same listing)
  const seen = new Set<string>()
  return listings.filter(l => (seen.has(l.sourceUrl) ? false : (seen.add(l.sourceUrl), true)))
}
