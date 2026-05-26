// prisma/seed.ts
import { PrismaClient, OpportunityType, WorkMode, Status, EventType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin
  const hashed = await bcrypt.hash('admin123', 12)
  await prisma.admin.upsert({
    where: { email: 'admin@bcu.ac.uk' },
    update: {},
    create: { email: 'admin@bcu.ac.uk', password: hashed, name: 'SCA Admin' },
  })

  // Tags
  const tagNames = ['Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Java', 'C#', '.NET', 'Go', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'SQL', 'Spark', 'Docker', 'GraphQL']
  const tags: Record<string, { id: string }> = {}
  for (const name of tagNames) {
    const t = await prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
    tags[name] = t
  }

  // Companies
  const google = await prisma.company.upsert({ where: { slug: 'google' }, update: {}, create: { name: 'Google', slug: 'google', website: 'https://careers.google.com', description: 'Global technology company known for Search, Cloud, and software engineering. 180k+ employees worldwide.' } })
  const microsoft = await prisma.company.upsert({ where: { slug: 'microsoft' }, update: {}, create: { name: 'Microsoft', slug: 'microsoft', website: 'https://careers.microsoft.com', description: 'Technology corporation behind Windows, Azure, and Office. One of the world\'s most valuable companies.' } })
  const amazon = await prisma.company.upsert({ where: { slug: 'amazon' }, update: {}, create: { name: 'Amazon', slug: 'amazon', website: 'https://amazon.jobs', description: 'E-commerce and cloud computing giant. AWS powers a significant portion of the internet.' } })
  const meta = await prisma.company.upsert({ where: { slug: 'meta' }, update: {}, create: { name: 'Meta', slug: 'meta', website: 'https://metacareers.com', description: 'Social technology company behind Facebook, Instagram, and WhatsApp.' } })
  const deloitte = await prisma.company.upsert({ where: { slug: 'deloitte' }, update: {}, create: { name: 'Deloitte', slug: 'deloitte', website: 'https://deloitte.com/careers', description: 'One of the Big Four accounting and consulting firms, with a large technology practice.' } })
  const jpmorgan = await prisma.company.upsert({ where: { slug: 'jpmorgan' }, update: {}, create: { name: 'JPMorgan Chase', slug: 'jpmorgan', website: 'https://careers.jpmorgan.com', description: 'Leading global financial services firm with a world-class technology division.' } })

  // Opportunities
  const opp1 = await prisma.opportunity.upsert({ where: { slug: 'google-swe-intern-2025' }, update: {}, create: {
    title: 'Software Engineering Intern — Summer 2025',
    slug: 'google-swe-intern-2025',
    description: 'Google\'s STEP Internship gives undergraduate students the opportunity to work alongside engineers for 12 weeks. You\'ll ship features, attend design reviews, and leave with production-level experience that genuinely counts.\n\nYou\'ll be embedded in a team from day one — not shadowing, but contributing. Past interns have shipped code to products used by billions of people.',
    requirements: 'Studying Computer Science or a related degree (2nd/3rd year preferred). Proficiency in at least one programming language. Solid grasp of data structures and algorithms. Collaborative mindset and strong problem-solving skills.',
    responsibilities: 'Design, develop and test features using Python or Go. Collaborate with full-time engineers on production systems. Participate in code reviews and present your work to the team. Write engineering documentation and design docs.',
    type: OpportunityType.INTERNSHIP,
    location: 'London, UK',
    workMode: WorkMode.HYBRID,
    salary: '£4,200/mo',
    salaryMin: 4200,
    salaryMax: 4200,
    deadline: new Date('2025-06-14'),
    startDate: 'June 2025',
    duration: '12 weeks',
    sponsored: true,
    featured: true,
    status: Status.OPEN,
    applyUrl: 'https://careers.google.com',
    companyId: google.id,
  }})
  await prisma.opportunityTag.createMany({ skipDuplicates: true, data: ['Python', 'Go', 'Kubernetes', 'GCP', 'SQL'].map(n => ({ opportunityId: opp1.id, tagId: tags[n].id })) })

  const opp2 = await prisma.opportunity.upsert({ where: { slug: 'microsoft-placement-2025' }, update: {}, create: {
    title: 'Year in Industry — Software Development',
    slug: 'microsoft-placement-2025',
    description: 'A 12-month placement at Microsoft gives you real ownership over engineering work on products used globally. You\'ll join a team in Reading and be treated as a full member — same projects, same standups, same impact.',
    requirements: 'Studying a Computing-related degree with a placement year. Experience with C# or another OOP language. Enthusiasm for cloud technology and modern development practices.',
    responsibilities: 'Build and maintain features in production .NET applications. Work within an Agile team using Azure DevOps. Participate in design discussions and contribute to architecture decisions.',
    type: OpportunityType.PLACEMENT,
    location: 'Reading, UK',
    workMode: WorkMode.ONSITE,
    salary: '£28,000/yr',
    salaryMin: 28000,
    salaryMax: 28000,
    deadline: new Date('2025-07-01'),
    startDate: 'September 2025',
    duration: '12 months',
    sponsored: false,
    featured: true,
    status: Status.OPEN,
    applyUrl: 'https://careers.microsoft.com',
    companyId: microsoft.id,
  }})
  await prisma.opportunityTag.createMany({ skipDuplicates: true, data: ['C#', '.NET', 'Azure', 'TypeScript'].map(n => ({ opportunityId: opp2.id, tagId: tags[n].id })) })

  const opp3 = await prisma.opportunity.upsert({ where: { slug: 'amazon-grad-sde-2025' }, update: {}, create: {
    title: 'Graduate SDE — AWS Infrastructure',
    slug: 'amazon-grad-sde-2025',
    description: 'Join AWS as a Graduate Software Development Engineer and work on the infrastructure that powers the internet. This role is for final-year students or recent graduates ready to work at scale from day one.',
    requirements: 'Final year or recent graduate in Computer Science or equivalent. Strong Java skills. Experience with distributed systems or cloud concepts. Demonstrated ability to write clean, testable code.',
    responsibilities: 'Build and improve AWS infrastructure services used by millions of customers. Debug and resolve production issues. Participate in on-call rotations. Write technical specs and lead features end-to-end.',
    type: OpportunityType.GRADUATE,
    location: 'Edinburgh, UK',
    workMode: WorkMode.REMOTE,
    salary: '£42,000/yr',
    salaryMin: 42000,
    salaryMax: 50000,
    deadline: new Date('2025-06-03'),
    startDate: 'September 2025',
    duration: 'Permanent',
    sponsored: true,
    featured: true,
    status: Status.CLOSING_SOON,
    applyUrl: 'https://amazon.jobs',
    companyId: amazon.id,
  }})
  await prisma.opportunityTag.createMany({ skipDuplicates: true, data: ['Java', 'AWS', 'Terraform', 'Docker'].map(n => ({ opportunityId: opp3.id, tagId: tags[n].id })) })

  const opp4 = await prisma.opportunity.upsert({ where: { slug: 'meta-data-intern-2025' }, update: {}, create: {
    title: 'Data Engineering Intern',
    slug: 'meta-data-intern-2025',
    description: 'Work on the data pipelines that process billions of events per day at Meta. You\'ll build ETL systems, work with Spark and SQL, and collaborate with data scientists and product engineers.',
    requirements: 'Strong Python and SQL skills. Understanding of data pipeline architecture. Experience with any distributed data processing framework is a plus.',
    responsibilities: 'Build and maintain data pipelines using Python and Spark. Optimise slow queries and improve data availability. Work with stakeholders across product and engineering.',
    type: OpportunityType.INTERNSHIP,
    location: 'London, UK',
    workMode: WorkMode.HYBRID,
    salary: '£5,000/mo',
    salaryMin: 5000,
    salaryMax: 5000,
    deadline: new Date('2025-06-20'),
    startDate: 'July 2025',
    duration: '12 weeks',
    sponsored: true,
    featured: false,
    status: Status.OPEN,
    applyUrl: 'https://metacareers.com',
    companyId: meta.id,
  }})
  await prisma.opportunityTag.createMany({ skipDuplicates: true, data: ['Python', 'Spark', 'SQL'].map(n => ({ opportunityId: opp4.id, tagId: tags[n].id })) })

  const opp5 = await prisma.opportunity.upsert({ where: { slug: 'deloitte-spring-week-2025' }, update: {}, create: {
    title: 'Technology Spring Week',
    slug: 'deloitte-spring-week-2025',
    description: 'A week inside Deloitte\'s Technology practice for first and second-year students. You\'ll attend workshops, shadow consultants, and tackle a client case study with a small team.',
    requirements: 'First or second-year student in a computing or numerate degree. Curious, commercially aware, and keen to explore a career at the intersection of tech and business.',
    responsibilities: 'Participate in client simulation exercises. Attend practice area showcases. Complete a team project presented to senior staff.',
    type: OpportunityType.SPRING_WEEK,
    location: 'Birmingham, UK',
    workMode: WorkMode.ONSITE,
    salary: 'Paid',
    salaryMin: null,
    salaryMax: null,
    deadline: new Date('2025-07-15'),
    startDate: 'September 2025',
    duration: '1 week',
    sponsored: false,
    featured: false,
    status: Status.OPEN,
    applyUrl: 'https://deloitte.com/careers',
    companyId: deloitte.id,
  }})
  await prisma.opportunityTag.createMany({ skipDuplicates: true, data: ['JavaScript', 'TypeScript'].map(n => ({ opportunityId: opp5.id, tagId: tags[n].id })) })

  const opp6 = await prisma.opportunity.upsert({ where: { slug: 'jpmorgan-spring-insight-2025' }, update: {}, create: {
    title: 'Software Engineer Spring Insight',
    slug: 'jpmorgan-spring-insight-2025',
    description: 'JPMorgan\'s Spring Insight programme gives first-year students a window into engineering at one of the world\'s largest banks. You\'ll work on real systems and leave with a clearer picture of your career options.',
    requirements: 'First-year student in a computing or engineering degree. Any programming experience welcome. Commercially curious and motivated.',
    responsibilities: 'Shadow and pair with engineers. Take part in a team challenge. Network with graduates and senior engineers across the business.',
    type: OpportunityType.SPRING_WEEK,
    location: 'London, UK',
    workMode: WorkMode.ONSITE,
    salary: '£450/day',
    salaryMin: null,
    salaryMax: null,
    deadline: new Date('2025-06-30'),
    startDate: 'August 2025',
    duration: '1 week',
    sponsored: true,
    featured: false,
    status: Status.OPEN,
    applyUrl: 'https://careers.jpmorgan.com',
    companyId: jpmorgan.id,
  }})
  await prisma.opportunityTag.createMany({ skipDuplicates: true, data: ['Java', 'React', 'Python'].map(n => ({ opportunityId: opp6.id, tagId: tags[n].id })) })

  // Comments (approved)
  await prisma.comment.createMany({ skipDuplicates: false, data: [
    { body: 'Applied last cycle — the online assessment is Leetcode medium difficulty, focused on DS&A. Team matching took about 3 weeks after passing interviews. Really positive experience overall, the buddy system is great.', authorName: 'Aisha K.', anonymous: false, approved: true, pinned: true, opportunityId: opp1.id },
    { body: 'Does anyone know if they consider applicants who haven\'t done a placement before? First time applying here.', authorName: 'James S.', anonymous: false, approved: true, pinned: false, opportunityId: opp1.id },
    { body: 'Yes they do — I applied as a first-timer and got through. Focus on your personal projects and problem-solving approach in the behavioural round.', authorName: null, anonymous: true, approved: true, pinned: false, opportunityId: opp1.id },
    { body: 'The Reading office is great. Free lunch, good tech stack, and the team is really welcoming to placement students. Highly recommend applying.', authorName: 'Priya M.', anonymous: false, approved: true, pinned: true, opportunityId: opp2.id },
  ]})

  // Events
  await prisma.event.createMany({ skipDuplicates: false, data: [
    { title: 'CV & Application Workshop — Tech Roles', description: 'A hands-on session covering how to tailor your CV for software engineering roles, write compelling cover letters, and navigate online application systems. Bring a draft CV if you have one.', location: 'Room MC105, BCU City Campus', isOnline: false, date: new Date('2025-06-05T14:00:00'), endDate: new Date('2025-06-05T16:00:00'), spots: 30, registrations: 18, type: EventType.WORKSHOP },
    { title: 'Industry Panel: Getting Into Big Tech', description: 'Four BCU alumni who now work at Google, Microsoft, Amazon, and Meta come back to share how they got there, what the interview process is really like, and what they wish they\'d known at university.', location: 'Online — Microsoft Teams', isOnline: true, date: new Date('2025-06-11T18:00:00'), endDate: new Date('2025-06-11T19:30:00'), spots: null, registrations: 87, type: EventType.PANEL },
    { title: 'Hackathon — SCA Build Day 2025', description: 'A full-day hackathon in the BCU computing labs. Build something in teams of 2–4, present at the end of the day, and compete for prizes. Any tech stack welcome.', location: 'BCU Computing Labs, Millennium Point', isOnline: false, date: new Date('2025-06-18T09:00:00'), endDate: new Date('2025-06-18T21:00:00'), spots: 60, registrations: 26, type: EventType.HACKATHON },
    { title: 'Mock Technical Interview Sessions', description: 'One-to-one mock technical interview slots with third-year and postgraduate students trained in interview technique. Each session is 45 minutes with structured feedback at the end.', location: 'Room TL304, BCU Curzon Building', isOnline: false, date: new Date('2025-07-02T13:00:00'), endDate: new Date('2025-07-02T17:00:00'), spots: 16, registrations: 10, type: EventType.WORKSHOP },
    { title: 'Networking Evening — SCA & Industry Partners', description: 'An informal evening bringing together BCU computing students and representatives from our industry partners. Free food, good conversation, and an opportunity to make connections that count.', location: 'BCU Parkside Building, Atrium', isOnline: false, date: new Date('2025-07-09T17:30:00'), endDate: new Date('2025-07-09T20:00:00'), spots: null, registrations: 54, type: EventType.NETWORKING },
    { title: 'Leetcode Study Group — Weekly Session', description: 'A regular drop-in study group working through Leetcode problems together. Bring your laptop, pick a problem, and work through it with others. All levels welcome.', location: 'BCU Computing Labs / Online', isOnline: false, date: new Date('2025-07-22T18:00:00'), endDate: new Date('2025-07-22T20:00:00'), spots: null, registrations: 12, type: EventType.OTHER },
    { title: 'Intro to System Design for Interviews', description: 'A workshop covering the system design concepts that come up most in technical interviews at large companies — load balancing, caching, databases, and more. Aimed at students in their final year.', location: 'Online — Microsoft Teams', isOnline: true, date: new Date('2025-07-28T17:00:00'), endDate: new Date('2025-07-28T19:00:00'), spots: null, registrations: 33, type: EventType.WORKSHOP },
    { title: 'Internship & Placement Experience Talks', description: 'Students who completed internships and placements in 2024 share what they did, what they learned, and advice for students who are currently applying. Q&A included.', location: 'Room MC101, BCU City Campus', isOnline: false, date: new Date('2025-08-06T15:00:00'), endDate: new Date('2025-08-06T17:00:00'), spots: 50, registrations: 8, type: EventType.TALK },
  ]})

  console.log('✅ Seed complete')
}

main().catch(e => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
