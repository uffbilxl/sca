/* ── CV Builder: types, default template, ATS heuristics ────── */

export interface CVEntry {
  id: string
  org: string
  role: string
  location: string
  dates: string
  bullets: string[]
}

export interface SkillRow {
  id: string
  label: string
  value: string
}

export type SectionKey = 'summary' | 'education' | 'experience' | 'extracurricular' | 'skills'

export interface CVData {
  version: 1
  name: string
  email: string
  phone: string
  linkedin: string
  github: string
  portfolio: string
  summary: string
  education: CVEntry[]
  experience: CVEntry[]
  extracurricular: CVEntry[]
  skills: SkillRow[]
  sectionOrder: SectionKey[]
}

export const SECTION_TITLES: Record<SectionKey, string> = {
  summary:         'Professional Summary',
  education:       'Education',
  experience:      'Work Experience',
  extracurricular: 'Extracurricular Activities',
  skills:          'Skills & Interests',
}

export const SUMMARY_MAX = 360
export const BULLET_MAX  = 230

export const STORAGE_KEY = 'sca-cv-builder-v1'

/* Default document: the SCA one-page template. Users edit this in place. */
export const DEFAULT_CV: CVData = {
  version: 1,
  name: 'NAME',
  email: 'EMAIL@gmail.com',
  phone: '+44 number',
  linkedin: 'LinkedIn',
  github: '',
  portfolio: '',
  summary: '',
  sectionOrder: ['summary', 'education', 'experience', 'extracurricular', 'skills'],
  education: [
    {
      id: 'edu-1',
      org: 'Birmingham City University',
      role: 'Bachelor of Science: Computer Science',
      location: 'Birmingham, UK',
      dates: '2025 – 2028',
      bullets: [
        'Average Grade: 83% (First Class)',
        'Key Modules: Module (%), Module (%)',
      ],
    },
  ],
  experience: [
    {
      id: 'exp-1',
      org: 'National Gas',
      role: 'Software Engineer Summer Intern',
      location: 'London, UK',
      dates: 'Jun 2026 – Sep 2026',
      bullets: [
        'Developed and contributed to software features within a collaborative engineering environment, working across both frontend and backend systems.',
        'Participated in debugging, testing, and code reviews to improve application performance, reliability, and user experience.',
        'Contributed to the delivery of 8+ feature updates and fixes across the internship, working within weekly sprint cycles and collaborating with a team of 5+ developers.',
      ],
    },
    {
      id: 'exp-2',
      org: 'BCU Student Computing Association',
      role: 'Data Analytics Intern',
      location: 'Birmingham, UK',
      dates: 'Sep 2025 – May 2026',
      bullets: [
        'Collected and analysed performance data across 15+ basketball fixtures, supporting post-match analysis and opposition preparation for the university team.',
        'Used tools such as Excel, Python, and video analysis software to track player and team performance metrics, contributing to weekly analytical reports.',
        'Worked within a student-led analytics team to deliver data-driven insights for coaches and players.',
      ],
    },
    {
      id: 'exp-3',
      org: 'Barclays',
      role: 'Insight Day',
      location: 'Knutsford, UK',
      dates: 'April 2026',
      bullets: [
        'Participated in a competitive spring insight programme at Barclays, gaining exposure to financial services, technology, and investment banking operations.',
        'Took part in networking sessions, commercial awareness workshops, and team-based case studies with Barclays professionals and fellow students.',
      ],
    },
    {
      id: 'exp-4',
      org: 'Argos',
      role: 'Sales Assistant',
      location: 'Birmingham, UK',
      dates: 'Oct 2023 – Jun 2025',
      bullets: [
        'Delivered customer service in a fast-paced retail environment while supporting daily store operations and sales targets.',
      ],
    },
  ],
  extracurricular: [
    {
      id: 'ext-1',
      org: 'BCU Student Computing Association',
      role: 'Events Coordinator',
      location: 'Birmingham, UK',
      dates: 'May 2026 – Present',
      bullets: [
        'Coordinated and supported the delivery of student-focused technology events, workshops, and networking sessions across the university computing community.',
        'Worked with committee members, university staff, and external partners to manage event logistics, promotion, and attendee engagement.',
      ],
    },
  ],
  skills: [
    { id: 'skl-1', label: 'Technical Skills', value: 'Python, C++, SQL, HTML/CSS, Metasploit, Splunk' },
    { id: 'skl-2', label: 'Certifications',   value: 'CompTIA Security+, CCNA 1, CCNA 2' },
    { id: 'skl-3', label: 'Interests',        value: 'Badminton, Rock-Climbing, Chess, Painting' },
  ],
}

/* ── Wording heuristics ──────────────────────────────────────── */

export const ACTION_VERBS = [
  'Developed', 'Engineered', 'Led', 'Improved', 'Designed', 'Optimised',
  'Automated', 'Secured', 'Reduced', 'Increased', 'Built', 'Created',
  'Delivered', 'Implemented', 'Launched', 'Coordinated', 'Analysed',
  'Collected', 'Managed', 'Contributed',
]

const STRONG_STARTS = new Set(
  [
    ...ACTION_VERBS,
    'Participated', 'Collaborated', 'Used', 'Took', 'Supported', 'Presented',
    'Researched', 'Tested', 'Maintained', 'Deployed', 'Streamlined', 'Founded',
    'Organised', 'Mentored', 'Achieved', 'Won', 'Produced', 'Wrote', 'Migrated',
  ].map(v => v.toLowerCase())
)

export const WEAK_PHRASES = [
  'worked on', 'helped with', 'helped to', 'responsible for', 'assisted with',
  'was involved in', 'duties included', 'tasked with', 'things like',
]

export function startsWithActionVerb(bullet: string): boolean {
  const first = bullet.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '')
  if (!first) return false
  return STRONG_STARTS.has(first)
}

export function findWeakPhrases(text: string): string[] {
  const lower = text.toLowerCase()
  return WEAK_PHRASES.filter(p => lower.includes(p))
}

/* ── ATS report ──────────────────────────────────────────────── */

export interface ATSCheck {
  label: string
  ok: boolean
  points: number   /* earned */
  max: number
  tip: string
}

export interface ATSReport {
  score: number
  checks: ATSCheck[]
  weakHits: { section: string; bullet: string; phrases: string[] }[]
  repeatedStarts: string[]
}

function contentBullets(data: CVData): { section: string; bullet: string }[] {
  return [
    ...data.experience.flatMap(e => e.bullets.map(b => ({ section: e.org, bullet: b }))),
    ...data.extracurricular.flatMap(e => e.bullets.map(b => ({ section: e.org, bullet: b }))),
  ].filter(x => x.bullet.trim().length > 0)
}

export function atsReport(data: CVData, fitsOnePage: boolean): ATSReport {
  const checks: ATSCheck[] = []

  const emailOk = /.+@.+\..+/.test(data.email) && !data.email.toUpperCase().startsWith('EMAIL')
  const phoneOk = /\d{6,}/.test(data.phone.replace(/\s/g, ''))
  const linkOk  = data.linkedin.trim().length > 3 && data.linkedin.trim().toLowerCase() !== 'linkedin'
  const contactPts = (emailOk ? 6 : 0) + (phoneOk ? 5 : 0) + (linkOk ? 4 : 0)
  checks.push({
    label: 'Contact details complete',
    ok: contactPts === 15, points: contactPts, max: 15,
    tip: 'Use a real email, phone number, and a full LinkedIn URL so recruiters and ATS parsers can reach you.',
  })

  const eduOk = data.education.some(e => e.org.trim() && e.role.trim())
  checks.push({
    label: 'Education section present',
    ok: eduOk, points: eduOk ? 10 : 0, max: 10,
    tip: 'Include your university, degree title, and expected grade.',
  })

  const bullets = contentBullets(data)
  const expOk = data.experience.some(e => e.org.trim())
  checks.push({
    label: 'Work experience present',
    ok: expOk, points: expOk ? 15 : 0, max: 15,
    tip: 'Any experience counts: internships, part-time work, insight days, society roles.',
  })

  const enoughBullets = bullets.length >= 6
  checks.push({
    label: 'Enough detail (6+ bullet points)',
    ok: enoughBullets, points: enoughBullets ? 10 : Math.min(9, bullets.length), max: 10,
    tip: 'Aim for 2-3 bullet points per role describing what you did and the result.',
  })

  const verbCount = bullets.filter(b => startsWithActionVerb(b.bullet)).length
  const verbRatio = bullets.length ? verbCount / bullets.length : 0
  const verbPts = Math.round(verbRatio * 20)
  checks.push({
    label: 'Bullets start with action verbs',
    ok: verbRatio >= 0.7, points: verbPts, max: 20,
    tip: `Start bullets with verbs like ${ACTION_VERBS.slice(0, 6).join(', ')}…`,
  })

  const weakHits = bullets
    .map(b => ({ ...b, phrases: findWeakPhrases(b.bullet) }))
    .filter(b => b.phrases.length > 0)
  const weakPts = Math.max(0, 10 - weakHits.length * 3)
  checks.push({
    label: 'No weak wording',
    ok: weakHits.length === 0, points: weakPts, max: 10,
    tip: 'Replace phrases like "worked on" or "responsible for" with a specific action and outcome.',
  })

  const skillsOk = data.skills.some(s => s.value.trim().length > 0)
  checks.push({
    label: 'Skills section filled in',
    ok: skillsOk, points: skillsOk ? 10 : 0, max: 10,
    tip: 'List concrete tools and languages; ATS keyword matching relies on these.',
  })

  checks.push({
    label: 'Fits on one page',
    ok: fitsOnePage, points: fitsOnePage ? 10 : 0, max: 10,
    tip: 'Trim the least relevant bullets. One page is the UK standard for student CVs.',
  })

  /* Repeated first words across bullets (3+ repeats flagged) */
  const startCounts = new Map<string, number>()
  for (const b of bullets) {
    const first = b.bullet.trim().split(/\s+/)[0]?.toLowerCase()
    if (first) startCounts.set(first, (startCounts.get(first) ?? 0) + 1)
  }
  const repeatedStarts = Array.from(startCounts.entries())
    .filter(([, n]) => n >= 3)
    .map(([w]) => w[0].toUpperCase() + w.slice(1))

  const score = checks.reduce((sum, c) => sum + c.points, 0)
  return { score, checks, weakHits, repeatedStarts }
}
