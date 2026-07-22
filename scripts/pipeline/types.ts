/* Raw listing shape every source scraper normalises into, before the LLM
 * structuring step converts it to the exact import schema. */
export interface RawListing {
  sourceDomain: string   // e.g. 'gradcracker.com' — used for domain-scoped closing
  sourceUrl: string      // the aggregator's own listing page — stable identity, used for dedup/closing
  applyUrl?: string      // the real destination (employer/ATS) when discoverable; falls back to sourceUrl if absent
  title: string
  company: string
  location?: string
  deadlineText?: string  // raw text; the LLM normalises this to an ISO date or "Rolling"
  salaryText?: string
  typeHint?: string      // raw category/type text, if the source exposes one
  descriptionRaw?: string
}
