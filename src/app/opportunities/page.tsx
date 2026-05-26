import { OPPORTUNITIES } from '@/data/opportunities'
import { OpportunitiesClient } from '@/components/opportunities/OpportunitiesClient'
import type { OpportunityType } from '@/types'

interface Props {
  searchParams: { type?: string }
}

export default function OpportunitiesPage({ searchParams }: Props) {
  const opportunities = OPPORTUNITIES.filter(o => o.status !== 'CLOSED')
  const initialType = searchParams.type as OpportunityType | undefined
  return <OpportunitiesClient opportunities={opportunities as any} initialType={initialType} />
}
