/* Biases default display order toward employers BCU computing students are
 * likely to recognise, and toward UK-based roles — purely a sort order,
 * never a filter. Nothing is hidden here; a company/location not listed
 * just sorts with everything else by recency. Deliberately hand-maintained
 * rather than derived from any signal we don't have (follower counts,
 * employee counts, etc. aren't available from any of the scraped sources). */

const KNOWN_COMPANIES = new Set([
  // Big tech
  'google', 'amazon', 'aws', 'microsoft', 'meta', 'apple', 'ibm', 'oracle',
  'salesforce', 'bloomberg', 'arm', 'nvidia', 'intel', 'samsung', 'sony',
  'spotify', 'netflix', 'adobe', 'sap', 'cisco', 'dell', 'hp', 'dyson',
  'deliveroo', 'revolut', 'monzo', 'starling bank', 'wise', 'deepmind',
  'graphcore', 'quantinuum', 'palantir', 'x (twitter)', 'twitter', 'linkedin',
  'uber', 'airbnb', 'booking.com', 'expedia', 'ebay', 'paypal', 'stripe',
  // Banks / finance
  'barclays', 'hsbc', 'jpmorgan', 'jp morgan', 'jpmorgan chase', 'goldman sachs',
  'morgan stanley', 'blackrock', 'lloyds', 'lloyds banking group', 'natwest',
  'deutsche bank', 'ubs', 'citi', 'citigroup', 'mastercard', 'visa',
  'american express', 'amex', 'marshall wace', 'man group', 'drw',
  'g-research', 'jane street', 'optiver', 'susquehanna', 'imc trading',
  'akuna capital', 'point72', 'two sigma', 'schroders', 'aviva',
  'legal & general', 'standard chartered', 'santander', 'nationwide', 'mufg',
  'nomura', 'credit suisse', 'rbc', 'bnp paribas', 'societe generale',
  // Big 4 / consulting
  'pwc', 'deloitte', 'ey', 'kpmg', 'mckinsey', 'bcg',
  'boston consulting group', 'bain', 'accenture', 'capgemini',
  // Other major UK/global employers
  'bt', 'sky', 'unilever', 'gsk', 'glaxosmithkline', 'astrazeneca',
  'jaguar land rover', 'rolls-royce', 'national grid', 'ocado', 'centrica',
  'bp', 'shell', 'vodafone', 'ee', 'o2', 'three', 'transport for london', 'tfl',
  'gov.uk', 'civil service', 'nhs', 'bbc', 'network rail',
])

export function isKnownCompany(name: string): boolean {
  return KNOWN_COMPANIES.has(name.trim().toLowerCase())
}

/* Errs toward "true" — most listings on this site are already UK-based —
 * and only flags a location as non-UK when it clearly names a specific
 * overseas place. */
const NON_UK_MARKERS = [
  'switzerland', 'geneva', 'zurich', 'ireland', 'dublin', 'germany', 'berlin',
  'munich', 'frankfurt', 'france', 'paris', 'netherlands', 'amsterdam',
  'spain', 'madrid', 'barcelona', 'italy', 'milan', 'rome', 'usa',
  'united states', 'new york', 'san francisco', 'california', 'texas',
  'canada', 'toronto', 'india', 'bangalore', 'mumbai', 'singapore',
  'hong kong', 'china', 'japan', 'tokyo', 'australia', 'sydney', 'dubai',
  'uae', 'poland', 'warsaw', 'hungary', 'budapest', 'denmark', 'aarhus',
  'copenhagen', 'sweden', 'stockholm', 'belgium', 'brussels', 'luxembourg',
  'portugal', 'lisbon',
]

export function isLikelyUK(location: string): boolean {
  const lower = location.toLowerCase()
  return !NON_UK_MARKERS.some(marker => lower.includes(marker))
}

/** Higher is more prominent: known UK company > known company > UK-located
 *  > everything else. Used as a sort-order bias, combined with recency as
 *  a tiebreaker by callers — never used to exclude anything. */
export function prominenceScore(companyName: string, location: string): number {
  const known = isKnownCompany(companyName)
  const uk = isLikelyUK(location)
  return (known ? 2 : 0) + (uk ? 1 : 0)
}
