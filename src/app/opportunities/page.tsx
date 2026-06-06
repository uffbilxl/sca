export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { OpportunitiesClient } from '@/components/opportunities/OpportunitiesClient'
import type { OpportunityType } from '@/types'

interface Props {
  searchParams: { type?: string }
}

export default async function OpportunitiesPage({ searchParams }: Props) {
  const opportunities = await prisma.opportunity.findMany({
    where: { status: { not: 'CLOSED' } },
    include: {
      company: true,
      tags: { include: { tag: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const initialType = searchParams.type as OpportunityType | undefined
  return <OpportunitiesClient opportunities={opportunities as any} initialType={initialType} />
}
