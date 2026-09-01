import type { Page } from 'playwright'

/* Shared helpers for the paginating source scrapers.
 *
 * All three sources sit behind bot mitigation that reacts to request rate,
 * not to volume: page 1 always works, and hammering pages 2..n in quick
 * succession is what trips it. Gradcracker in particular starts serving
 * Cloudflare's "Just a moment..." interstitial after two fast requests,
 * which renders as a page with zero listings and would otherwise be
 * indistinguishable from "this category is empty". */

/** Delay between page requests within a single source. */
export const PAGE_DELAY_MS = Number(process.env.SCRAPE_PAGE_DELAY_MS ?? 4000)

/** Hard ceiling on pages per category, so a pagination bug can't loop forever. */
export const MAX_PAGES = 15

export function sleep(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

/* A bot-mitigation interstitial rather than a real results page. Detected by
 * title and body length: challenge pages are tiny and titled distinctively,
 * whereas a genuinely empty results page still carries the site's full
 * chrome. Never treat one as "no more results" — that silently truncates
 * the run and looks like success. */
export async function isChallengePage(page: Page): Promise<boolean> {
  try {
    return await page.evaluate(() => {
      const title = document.title.toLowerCase()
      if (/just a moment|attention required|checking your browser|access denied/.test(title)) return true
      return document.body.innerText.trim().length < 500 && /cloudflare|cf-browser|challenge/i.test(document.body.innerHTML)
    })
  } catch {
    return false
  }
}

export interface PageResult<T> {
  items: T[]
  challenged: boolean
}

/* Walks ?page=N until a page yields nothing, the cap is hit, or the site
 * challenges us. Returns whatever was collected plus any warnings, so a
 * partial scrape is still usable and the reason is visible in the run
 * summary instead of being swallowed. */
export async function paginate<T>(
  page: Page,
  baseUrl: string,
  extract: () => Promise<T[]>,
  opts: { label: string; warnings: string[]; readySelector?: string; settleMs?: number },
): Promise<T[]> {
  const collected: T[] = []

  for (let n = 1; n <= MAX_PAGES; n++) {
    const url = n === 1 ? baseUrl : `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}page=${n}`

    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
    } catch (err) {
      opts.warnings.push(`${opts.label} page ${n}: navigation failed (${(err as Error).message.split('\n')[0]})`)
      break
    }

    if (opts.readySelector) {
      // Absence is meaningful (empty page or a challenge), so don't treat the
      // timeout as fatal — fall through to the checks below.
      await page.waitForSelector(opts.readySelector, { timeout: 20000 }).catch(() => {})
    }
    await sleep(opts.settleMs ?? 2500)

    if (await isChallengePage(page)) {
      opts.warnings.push(`${opts.label}: bot challenge served at page ${n}; stopped with ${collected.length} listings`)
      break
    }

    let items: T[] = []
    try {
      items = await extract()
    } catch (err) {
      opts.warnings.push(`${opts.label} page ${n}: extraction failed (${(err as Error).message.split('\n')[0]})`)
      break
    }

    if (items.length === 0) break
    collected.push(...items)

    if (n < MAX_PAGES) await sleep(PAGE_DELAY_MS)
  }

  return collected
}
