import { chromium } from 'playwright'
import { importOpportunityRows } from '../../src/lib/importOpportunities'
import { scrapeGradcracker, DOMAIN as GRADCRACKER_DOMAIN } from './sources/gradcracker'
import { scrapeHigherIn, DOMAIN as HIGHERIN_DOMAIN } from './sources/higherin'
import { scrapeTargetJobs, DOMAIN as TARGETJOBS_DOMAIN } from './sources/targetjobs'
import { structureListings } from './structure'
import { sendRunSummaryEmail } from './notify'
import { sweepDeadLinks } from './linkcheck'
import type { RawListing } from './types'

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

/* A source only counts as "actually covered this run" (and therefore
 * eligible to have its stale listings auto-closed) if it returned at least
 * this many raw listings. Guards against a transient scrape failure (0 or
 * a handful of results due to a site error/redesign) wrongly closing every
 * previously-imported opportunity from that source. */
const MIN_LISTINGS_TO_TRUST_SOURCE = 5

async function main() {
  const startedAt = new Date()
  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey) {
    console.error('GEMINI_API_KEY is not set — cannot structure scraped listings. Aborting.')
    await sendRunSummaryEmail({
      results: { added: 0, updated: 0, closed: 0, skipped: 0, blocked: 0, errors: [] },
      perSource: [],
      startedAt,
      finishedAt: new Date(),
      fatalError: 'GEMINI_API_KEY is not set in the environment.',
    })
    process.exit(1)
  }

  const browser = await chromium.launch()
  // Collected by the scrapers: a partial scrape stays usable, but the reason
  // it was partial has to reach the run summary rather than vanish.
  const warnings: string[] = []
  const perSource: { name: string; scraped: number; structured: number; domain: string }[] = []
  const allRaw: RawListing[] = []

  const sources: { name: string; domain: string; run: () => Promise<RawListing[]> }[] = [
    {
      name: 'Gradcracker',
      domain: GRADCRACKER_DOMAIN,
      run: async () => {
        const page = await browser.newPage({ userAgent: UA })
        try { return await scrapeGradcracker(page, warnings) } finally { await page.close() }
      },
    },
    {
      name: 'HigherIn',
      domain: HIGHERIN_DOMAIN,
      run: async () => {
        const page = await browser.newPage({ userAgent: UA })
        try { return await scrapeHigherIn(page, warnings) } finally { await page.close() }
      },
    },
    {
      name: 'TargetJobs',
      domain: TARGETJOBS_DOMAIN,
      run: async () => {
        const page = await browser.newPage({ userAgent: UA })
        try { return await scrapeTargetJobs(page, warnings) } finally { await page.close() }
      },
    },
  ]

  for (const source of sources) {
    let listings: RawListing[] = []
    try {
      listings = await source.run()
    } catch (err) {
      console.error(`${source.name} scrape failed:`, err)
    }
    console.log(`${source.name}: scraped ${listings.length} raw listings`)
    perSource.push({ name: source.name, domain: source.domain, scraped: listings.length, structured: 0 })
    allRaw.push(...listings)
  }

  await browser.close()

  if (warnings.length > 0) {
    console.warn('\nScrape warnings:')
    warnings.forEach(w => console.warn(`  - ${w}`))
  }

  // Only trust domains that returned enough listings to look like a real,
  // successful scrape rather than a transient failure.
  const trustedDomains = perSource
    .filter(s => s.scraped >= MIN_LISTINGS_TO_TRUST_SOURCE)
    .map(s => s.domain)
  const untrustedSources = perSource.filter(s => s.scraped < MIN_LISTINGS_TO_TRUST_SOURCE)
  if (untrustedSources.length > 0) {
    console.warn(
      'Not trusting these sources for the close-sweep (too few results, likely a scrape issue):',
      untrustedSources.map(s => `${s.name} (${s.scraped})`).join(', ')
    )
  }

  console.log(`\nStructuring ${allRaw.length} listings via Gemini...`)
  const structured = await structureListings(allRaw, geminiKey)
  console.log(`Structured ${structured.length} relevant rows (of ${allRaw.length} scraped)`)

  for (const s of structured) {
    const entry = perSource.find(p => p.domain === s.source.sourceDomain)
    if (entry) entry.structured++
  }

  const results = await importOpportunityRows(
    structured.map(s => s.row),
    { sourceDomains: trustedDomains }
  )

  console.log('\nImport results:', results)

  /* Retire listings whose application link is definitively gone. Runs after
   * the import so today's new rows are covered too, and counts into closed
   * since that is what it does. */
  console.log('\nChecking application links...')
  const linkCheck = await sweepDeadLinks()
  console.log(
    `Link check: ${linkCheck.checked} checked, ${linkCheck.dead} dead (closed), ` +
    `${linkCheck.alive} alive, ${linkCheck.inconclusive} inconclusive`
  )
  results.closed += linkCheck.dead
  if (linkCheck.dead > 0) {
    warnings.push(`Closed ${linkCheck.dead} listing(s) with dead application links`)
  }

  await sendRunSummaryEmail({
    results,
    perSource: perSource.map(({ name, scraped, structured }) => ({ name, scraped, structured })),
    warnings,
    startedAt,
    finishedAt: new Date(),
  })
}

main().catch(async (err) => {
  console.error('Pipeline run failed:', err)
  await sendRunSummaryEmail({
    results: { added: 0, updated: 0, closed: 0, skipped: 0, blocked: 0, errors: [] },
    perSource: [],
    startedAt: new Date(),
    finishedAt: new Date(),
    fatalError: err instanceof Error ? err.stack || err.message : String(err),
  })
  process.exit(1)
})
