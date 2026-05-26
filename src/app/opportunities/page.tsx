export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import { OpportunitiesClient } from '@/components/opportunities/OpportunitiesClient'

async function getOpportunities() {
  return prisma.opportunity.findMany({
    where: { status: { not: 'CLOSED' } },
    include: {
      company: true,
      tags: { include: { tag: true } },
      _count: { select: { comments: { where: { approved: true } } } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function OpportunitiesPage() {
  const opportunities = await getOpportunities()
  return <OpportunitiesClient opportunities={opportunities as any} />
}
