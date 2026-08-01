/* See src/app/page.tsx for why this isn't force-dynamic anymore. */
export const revalidate = 300

import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { OpportunitiesClient } from '@/components/opportunities/OpportunitiesClient'

export default async function OpportunitiesPage() {
  const opportunities = await prisma.opportunity.findMany({
    // status !== CLOSED alone isn't enough — a listing whose deadline has
    // simply passed stays OPEN in the DB until something notices, but
    // shouldn't be shown (or offered to "apply" to) as if it still were.
    where: { status: { not: 'CLOSED' }, OR: [{ deadline: null }, { deadline: { gte: new Date() } }] },
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
