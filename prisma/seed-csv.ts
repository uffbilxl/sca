import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const toSlug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60)

// Unique new entries from the CSV (duplicates removed, existing internships skipped)
// [company, title, type, location, deadline, salary, workMode, applyUrl]
type E = [string, string, 'INTERNSHIP'|'PLACEMENT'|'GRADUATE'|'SPRING_WEEK', string, string|null, string|null, 'HYBRID'|'ONSITE'|'REMOTE', string|null]

const entries: E[] = [
  // Real specific links from Gradcracker
  ['KEYENCE', 'IT Support Placement', 'PLACEMENT', 'Uxbridge, UK', '2026-05-31', '£22,000 + allowance', 'ONSITE',
    'https://www.gradcracker.com/hub/923/keyence/work-placement-internship/74910/it-support-placement'],
  ['Sigma Labs', 'Graduate Technology Consultant Programme', 'GRADUATE', 'Multiple UK Locations', '2026-06-08', '£30,000+', 'HYBRID',
    'https://www.gradcracker.com/hub/973/sigma-labs/graduate-job/78924/graduate-technology-consultant-programme-august-2026-start'],

  // Real specific links from Bright Network
  ['Morgan Stanley', 'Technology Spring Insight Event 2026', 'SPRING_WEEK', 'London, UK', '2026-03-01', null, 'ONSITE',
    'https://www.brightnetwork.co.uk/graduate-jobs/morgan-stanley/morgan-stanley-technology-spring-insight-event-2026'],
  ['Deutsche Bank', 'Spring Into Technology: Data & Innovation', 'SPRING_WEEK', 'London, UK', '2025-11-09', null, 'HYBRID',
    'https://www.brightnetwork.co.uk/graduate-jobs/deutsche-bank/spring-into-technology-data-innovation-2026'],

  // New opportunity types for existing companies (placements & graduate roles not yet in DB)
  ['Microsoft', 'Software Engineering Placement', 'PLACEMENT', 'Reading, UK', null, 'Competitive', 'HYBRID',
    'https://www.brightnetwork.co.uk/industrial-placements/technology/'],
  ['Cisco', 'Cybersecurity Placement', 'PLACEMENT', 'London, UK', null, 'Competitive', 'HYBRID',
    'https://www.gradcracker.com/search/computing-technology/software-work-placements-internships'],
  ['IBM', 'Cloud Engineering Graduate', 'GRADUATE', 'Manchester, UK', null, 'Competitive', 'HYBRID',
    'https://www.brightnetwork.co.uk/graduate-jobs/technology/'],
  ['Accenture', 'Technology Consulting Analyst', 'GRADUATE', 'Manchester, UK', null, 'Competitive', 'HYBRID',
    'https://www.brightnetwork.co.uk/graduate-jobs/technology/'],
  ['Deloitte', 'Technology Industrial Placement', 'PLACEMENT', 'Birmingham, UK', null, 'Competitive', 'HYBRID',
    'https://www.brightnetwork.co.uk/industrial-placements/technology/'],
  ['J.P. Morgan', 'Technology Analyst Programme', 'GRADUATE', 'Glasgow, UK', null, 'Competitive', 'HYBRID',
    'https://www.brightnetwork.co.uk/graduate-jobs/technology/'],
]

async function main() {
  console.log(`Adding ${entries.length} new unique entries from CSV…`)

  const usedSlugs: Record<string, boolean> = {}

  // Pre-load existing slugs to avoid collisions
  const existing = await prisma.opportunity.findMany({ select: { slug: true } })
  existing.forEach(o => { usedSlugs[o.slug] = true })

  for (const [company, title, type, location, deadlineStr, salary, workMode, applyUrl] of entries) {
    const companySlug = toSlug(company)

    // Upsert company
    let finalSlug = companySlug
    let n = 2
    while (true) {
      const existing = await prisma.company.findUnique({ where: { slug: finalSlug } })
      if (!existing || existing.name === company) break
      finalSlug = `${companySlug}-${n++}`
    }
    const comp = await prisma.company.upsert({
      where: { slug: finalSlug },
      update: {},
      create: { name: company, slug: finalSlug },
    })

    // Generate unique opportunity slug
    let baseSlug = toSlug(`${company}-${title}`)
    let oppSlug = baseSlug
    let m = 2
    while (usedSlugs[oppSlug]) oppSlug = `${baseSlug}-${m++}`
    usedSlugs[oppSlug] = true

    const deadline = deadlineStr ? new Date(deadlineStr) : null
    const today = new Date('2026-05-26')
    const status = !deadline ? 'OPEN' :
      deadline < today ? 'CLOSED' :
      deadline <= new Date(today.getTime() + 7*24*60*60*1000) ? 'CLOSING_SOON' : 'OPEN'

    try {
      await prisma.opportunity.create({
        data: {
          title,
          slug: oppSlug,
          description: `${title} at ${company}. Based in ${location}.`,
          type,
          location,
          workMode,
          deadline,
          salary: salary ?? undefined,
          sponsored: false,
          status: status as any,
          applyUrl: applyUrl ?? undefined,
          companyId: comp.id,
        },
      })
      console.log(`✓ [${type}] ${company} — ${title}`)
    } catch (e: any) {
      console.error(`✗ ${company} — ${title}: ${e.message}`)
    }
  }

  console.log('\nDone!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
