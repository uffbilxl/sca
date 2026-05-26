import { OPPORTUNITIES } from '@/data/opportunities'
import { OpportunitiesClient } from '@/components/opportunities/OpportunitiesClient'

export default function OpportunitiesPage() {
  const opportunities = OPPORTUNITIES.filter(o => o.status !== 'CLOSED')
  return <OpportunitiesClient opportunities={opportunities as any} />
}
