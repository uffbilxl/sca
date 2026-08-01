/* See src/app/page.tsx for why this isn't force-dynamic anymore. */
export const revalidate = 300

import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { OpportunitiesClient } from '@/components/opportunities/OpportunitiesClient'

export default async function OpportunitiesPage() {
  const opportunities = await prisma.opportunity.findMany({
    where: { status: { not: 'CLOSED' } },
    include: {
      company: true,
      tags: { include: { tag: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <Suspense>
      <OpportunitiesClient opportunities={opportunities as any} />
    </Suspense>
  )
}
