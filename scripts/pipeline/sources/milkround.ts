import type { Page } from 'playwright'
import type { RawListing } from '../types'

/* Milkround listings link out to totaljobs.com for the actual posting/apply
 * page (Milkround is part of the StepStone/Totaljobs group) — that's what we
 * use as the Apply URL, not the milkround.com company-profile link. */
export const DOMAIN = 'totaljobs.com'

const SEARCH_URLS = [
  'https://www.milkround.com/jobs/it',
  'https://www.milkround.com/jobs/software-developer',
]

export async function scrapeMilkround(page: Page): Promise<RawListing[]> {
  const listings: RawListing[] = []

  for (const url of SEARCH_URLS) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
      await page.waitForTimeout(3000)
    } catch {
      continue
    }

    const cards = await page.evaluate(() => {
      const out: { text: string; jobHref?: string }[] = []
      for (const el of Array.from(document.querySelectorAll('[data-testid="job-item"]'))) {
        const links = Array.from(el.querySelectorAll('a')).map(a => (a as HTMLAnchorElement).href)
        const jobHref = links.find(h => h.includes('totaljobs.com/job/'))
        out.push({ text: (el as HTMLElement).innerText, jobHref })
      }
      return out
    })

    for (const c of cards) {
      if (!c.jobHref) continue
      const lines = c.text.split('\n').map(l => l.trim()).filter(Boolean)
      // Card shape: Title / Company / Location / Salary / description... / "X ago"
      const [title, company, location, salary, ...rest] = lines
      if (!title || !company) continue
      listings.push({
        sourceDomain: 'totaljobs.com',
        sourceUrl: c.jobHref,
        title,
        company,
        location,
        salaryText: salary,
        descriptionRaw: rest.filter(l => l !== 'more' && !/ago$/.test(l)).join(' '),
      })
    }
  }

  const seen = new Set<string>()
  return listings.filter(l => (seen.has(l.sourceUrl) ? false : (seen.add(l.sourceUrl), true)))
}
