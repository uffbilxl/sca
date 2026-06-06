import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { OPPORTUNITIES } from '@/data/opportunities'

export async function POST() {
  let added = 0
  let skipped = 0

  for (const opp of OPPORTUNITIES) {
    try {
      // Upsert company
      const company = await prisma.company.upsert({
        where: { slug: opp.company.slug },
        update: {},
        create: {
          name: opp.company.name,
          slug: opp.company.slug,
          logo: opp.company.logo ?? null,
          website: opp.company.website ?? null,
        },
      })

      // Skip if already exists
      const existing = await prisma.opportunity.findFirst({
        where: { OR: [{ id: opp.id }, { slug: opp.slug }] },
      })
      if (existing) { skipped++; continue }

      await prisma.opportunity.create({
        data: {
          id: opp.id,
          title: opp.title,
          slug: opp.slug,
          description: opp.description,
          type: opp.type,
          location: opp.location,
          workMode: opp.workMode,
          status: opp.status,
          featured: opp.featured,
          sponsored: opp.sponsored,
          applyUrl: opp.applyUrl ?? null,
          startDate: opp.startDate ?? null,
          deadline: opp.deadline ?? null,
          requirements: opp.requirements ?? null,
          responsibilities: opp.responsibilities ?? null,
          salary: opp.salary ?? null,
          salaryMin: opp.salaryMin ?? null,
          salaryMax: opp.salaryMax ?? null,
          duration: opp.duration ?? null,
          companyId: company.id,
          createdAt: opp.createdAt,
        },
      })
      added++
    } catch (err) {
      console.error(`Seed error for ${opp.title}:`, err)
      skipped++
    }
  }

  return NextResponse.json({ added, skipped, total: OPPORTUNITIES.length })
}
