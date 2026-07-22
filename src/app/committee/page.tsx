'use client'
import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Linkedin, Globe, ChevronDown } from 'lucide-react'

/* ── Types ─────────────────────────────────────────────────── */
interface Person {
  name: string
  role: string
  linkedin?: string
  website?: string
}

interface Section {
  name: string
  color: string
  head?: Person
  members: Person[]
}

/* ── Data ──────────────────────────────────────────────────── */
const LEADERSHIP: Person[] = [
  {
    name: 'Tayyeb Nadeem Somro',
    role: 'President',
    linkedin: 'https://www.linkedin.com/in/tayyeb-nadeem-somro/',
    website: 'http://tayyebns.com',
  },
  {
    name: 'Bilal Arshad',
    role: 'Vice President',
    linkedin: 'https://www.linkedin.com/in/bilal-arshad-4a07812b4/',
    website: 'https://bilalarshad.co.uk',
  },
  {
    name: 'Michael Martinak',
    role: 'Head of Research',
    linkedin: 'https://www.linkedin.com/in/profile-mmartinak/',
  },
  {
    name: 'Asim Raza',
    role: 'Technical Operations Manager',
    linkedin: 'https://www.linkedin.com/in/muhammad-asim-r-0a577b3a9/',
  },
]

const DEPARTMENTS: Section[] = [
  {
    name: 'Software Engineering',
    color: '#22c55e',
    head: {
      name: 'Yasamin Zaid',
      role: 'Head of Software Engineering',
      linkedin: 'https://www.linkedin.com/in/yasaminzaid/',
      website: 'https://yasaminzaid.com',
    },
    members: [
      { name: 'Hamzah Abdur Rahman', role: 'Technical Coordinator', linkedin: 'https://www.linkedin.com/in/hamzah-abdur-rahman-5553ab2b8/' },
      { name: 'Asim Raza',           role: 'Technical Coordinator', linkedin: 'https://www.linkedin.com/in/muhammad-asim-r-0a577b3a9/' },
    ],
  },
  {
    name: 'Cyber Security',
    color: '#ef4444',
    head: {
      name: 'TBC',
      role: 'Head of Cyber Security',
    },
    members: [
      { name: 'Daeron Wallace', role: 'Content Creator', linkedin: 'https://www.linkedin.com/in/daeron-wallace/' },
    ],
  },
  {
    name: 'Artificial Intelligence',
    color: '#a855f7',
    head: {
      name: 'Orlando Igwe',
      role: 'Head of AI',
      linkedin: 'https://www.linkedin.com/in/orlando-igwe/',
    },
    members: [
      { name: 'Mohamed Dahir',  role: 'Sports Analytics Lead',  linkedin: 'https://www.linkedin.com/in/m-a-dahir/' },
      { name: 'Zakaria Miah',   role: 'Technical Coordinator',  linkedin: 'https://www.linkedin.com/in/zakaria-miah/' },
      { name: 'Ali Bhuiyan',    role: 'Technical Coordinator',  linkedin: 'https://www.linkedin.com/in/shakayat-ali-bhuiyan-b93179309/' },
      { name: 'Al Tahsin Rafi', role: 'Technical Coordinator',  linkedin: 'https://www.linkedin.com/in/al-tahsin-rafi-18b75631b/' },
    ],
  },
  {
    name: 'Digital Transformation',
    color: '#06b6d4',
    head: {
      name: 'Hodane Gouled',
      role: 'Head of Digital Transformation',
      linkedin: 'https://www.linkedin.com/in/hodane-gouled-b32534230/',
    },
    members: [
      { name: 'Joe Paddock', role: 'Strategy',    linkedin: 'https://www.linkedin.com/in/joepaddock-uk/' },
      { name: 'Tamara',      role: 'Coordinator' },
    ],
  },
  {
    name: 'Computer Science',
    color: '#f59e0b',
    head: {
      name: 'Alaa Aljasem',
      role: 'Head of Computer Science',
      linkedin: 'https://www.linkedin.com/in/alaa-aljasem-b816b83aa/',
    },
    members: [
      { name: 'Ayaan Ahmed',  role: 'Technical Coordinator', linkedin: 'https://www.linkedin.com/in/ayaan-ahmed-477289330/' },
      { name: 'Jasleen Kaur', role: 'Events Coordinator',    linkedin: 'https://www.linkedin.com/in/jasleen-kaur-269367387/' },
      { name: 'Abigail',      role: 'Events Coordinator' },
    ],
  },
]

const TEAMS: Section[] = [
  {
    name: 'Marketing',
    color: '#ec4899',
    members: [
      { name: 'Mohammad Hamza', role: 'Marketing',                   linkedin: 'https://www.linkedin.com/in/mohammad-hamza-97729322b/' },
      { name: 'Abrar Alam',     role: 'Content Creator / Photographer', linkedin: 'https://www.linkedin.com/in/abrartalam/' },
      { name: 'Samyaan Khan',   role: 'Graphic Designer',            linkedin: 'https://www.linkedin.com/in/samyaan-khan-036977250/' },
    ],
  },
  {
    name: 'Community Engagement',
    color: '#2dd4bf',
    members: [
      { name: 'Maryam Ahmad', role: 'Community Engagement', linkedin: 'https://www.linkedin.com/in/maryam-a-259297235' },
    ],
  },
  {
    name: 'Web Team',
    color: '#f97316',
    members: [
      { name: 'Bilal Arshad',         role: 'Web', linkedin: 'https://www.linkedin.com/in/bilal-arshad-4a07812b4/', website: 'https://bilalarshad.co.uk' },
      { name: 'Asim Raza',            role: 'Web', linkedin: 'https://www.linkedin.com/in/muhammad-asim-r-0a577b3a9/' },
      { name: 'Tayyeb Nadeem Somro',  role: 'Web', linkedin: 'https://www.linkedin.com/in/tayyeb-nadeem-somro/', website: 'http://tayyebns.com' },
    ],
  },
  {
    name: 'App Team',
    color: '#3b82f6',
    members: [
      { name: 'Bilal Arshad',         role: 'App Dev', linkedin: 'https://www.linkedin.com/in/bilal-arshad-4a07812b4/', website: 'https://bilalarshad.co.uk' },
      { name: 'Asim Raza',            role: 'App Dev', linkedin: 'https://www.linkedin.com/in/muhammad-asim-r-0a577b3a9/' },
      { name: 'Tayyeb Nadeem Somro',  role: 'App Dev', linkedin: 'https://www.linkedin.com/in/tayyeb-nadeem-somro/', website: 'http://tayyebns.com' },
    ],
  },
  {
    name: 'Research & Development',
    color: '#8b5cf6',
    members: [
      { name: 'Bilal Arshad',         role: 'Researcher', linkedin: 'https://www.linkedin.com/in/bilal-arshad-4a07812b4/', website: 'https://bilalarshad.co.uk' },
      { name: 'George James',          role: 'Researcher', linkedin: 'https://www.linkedin.com/in/georgeojames/' },
      { name: 'Baber Khan',            role: 'Researcher', linkedin: 'https://www.linkedin.com/in/baberr/', website: 'https://baberr.com' },
      { name: 'Orlando Igwe',          role: 'Researcher', linkedin: 'https://www.linkedin.com/in/orlando-igwe/' },
      { name: 'Tayyeb Nadeem Somro',   role: 'Researcher', linkedin: 'https://www.linkedin.com/in/tayyeb-nadeem-somro/', website: 'http://tayyebns.com' },
    ],
  },
]

/* ── Helper ────────────────────────────────────────────────── */
function initials(name: string) {
  return name.split(' ').map(p => p[0]).join('').slice(0, 3).toUpperCase()
}

/* ── Social icon buttons ───────────────────────────────────── */
function SocialLinks({ person }: { person: Person }) {
  return (
    <div className="flex items-center gap-1.5">
      {person.linkedin ? (
        <Link
          href={person.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150 focus-ring"
          style={{ background: 'rgba(10,102,194,0.12)', border: '1px solid rgba(10,102,194,0.28)', color: '#0A66C2' }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'rgba(10,102,194,0.22)'
            el.style.borderColor = 'rgba(10,102,194,0.5)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'rgba(10,102,194,0.12)'
            el.style.borderColor = 'rgba(10,102,194,0.28)'
          }}
          aria-label={`${person.name} on LinkedIn`}
        >
          {/* LinkedIn "in" wordmark SVG */}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </Link>
      ) : (
        <span
          className="flex items-center justify-center w-7 h-7 rounded-lg"
          style={{ background: 'rgba(var(--hairline-rgb),0.02)', border: '1px solid rgba(var(--hairline-rgb),0.04)' }}
          aria-hidden="true"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--bg4)">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </span>
      )}
      {person.website && (
        <Link
          href={person.website}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150 focus-ring"
          style={{ background: 'rgba(var(--hairline-rgb),0.05)', border: '1px solid rgba(var(--hairline-rgb),0.08)', color: 'var(--t3)' }}
          onMouseEnter={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'rgba(var(--hairline-rgb),0.1)'
            el.style.borderColor = 'rgba(var(--hairline-rgb),0.18)'
            el.style.color = 'var(--t1)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.background = 'rgba(var(--hairline-rgb),0.05)'
            el.style.borderColor = 'rgba(var(--hairline-rgb),0.08)'
            el.style.color = 'var(--t3)'
          }}
          aria-label={`${person.name}'s website`}
        >
          <Globe size={12} />
        </Link>
      )}
    </div>
  )
}

/* ── Member row ────────────────────────────────────────────── */
function MemberRow({ person, accentColor, index = 0 }: { person: Person; accentColor: string; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors"
      style={{ background: 'rgba(var(--hairline-rgb),0.02)', borderColor: 'rgba(var(--hairline-rgb),0.05)' }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
        style={{ background: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}30` }}
      >
        {initials(person.name)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[var(--color-text)] leading-tight truncate">{person.name}</p>
        <p className="text-[11px] text-[var(--color-muted)] leading-tight mt-0.5">{person.role}</p>
      </div>
      <SocialLinks person={person} />
    </motion.div>
  )
}

/* ── Section tile (departments + teams) ────────────────────── */
function SectionTile({ section, isOpen, onToggle }: { section: Section; isOpen: boolean; onToggle: () => void }) {
  const { name, color, head, members } = section
  const memberCount = (head ? 1 : 0) + members.length

  return (
    <div className="rounded-2xl border overflow-hidden transition-all duration-300"
      style={{
        borderColor: isOpen ? `${color}50` : 'rgba(var(--hairline-rgb),0.07)',
        background: 'var(--card-gradient)',
        boxShadow: isOpen ? `0 0 32px ${color}18` : 'none',
      }}
    >
      {/* Tile header — always visible */}
      <button
        onClick={onToggle}
        className="w-full text-left flex items-center gap-4 p-5 transition-colors focus-ring"
        style={{ background: isOpen ? `${color}08` : 'transparent' }}
      >
        <span
          className="w-3 h-3 rounded-full flex-shrink-0 transition-shadow duration-300"
          style={{ background: color, boxShadow: isOpen ? `0 0 10px ${color}` : 'none' }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-bold text-[var(--color-text)] leading-tight">{name}</p>
          <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
            {head ? 'Click to meet the team' : `${members.length} members`}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-[var(--color-muted)]">
            {memberCount} {memberCount === 1 ? 'member' : 'members'}
          </span>
          <ChevronDown
            size={14}
            className="text-[var(--color-muted)] transition-transform duration-300"
            style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </button>

      {/* Expanded panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ overflow: 'hidden', borderTop: `1px solid ${color}20` }}
          >
            <div className="p-4 flex flex-col gap-2">
              {/* Head first */}
              {head && (
                <MemberRow person={head} accentColor={color} index={0} />
              )}
              {/* Members */}
              {members.map((m, i) => (
                <MemberRow key={m.name + i} person={m} accentColor={color} index={(head ? 1 : 0) + i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Page ──────────────────────────────────────────────────── */
export default function CommitteePage() {
  const [openDept, setOpenDept] = useState<string | null>(null)
  const [openTeam, setOpenTeam] = useState<string | null>(null)

  return (
    <div className="max-w-[900px] mx-auto px-5 sm:px-8 py-10 sm:py-14" style={{ position: 'relative', zIndex: 1 }}>

      {/* Header */}
      <div className="mb-14">
        <span className="eyebrow mb-3 block">Student Computing Association</span>
        <h1
          className="display-headline mb-3"
          style={{ fontSize: 'clamp(1.75rem, 5vw, 2.75rem)' }}
        >
          Meet the Committee
        </h1>
        <p className="text-sm text-[var(--color-muted)] max-w-lg leading-relaxed">
          The people behind the SCA: organising events, driving projects, and building the BCU computing community.
        </p>
      </div>

      {/* ── Leadership ──────────────────────────────────────── */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <span className="section-title">Leadership</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(var(--hairline-rgb),0.07)' }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LEADERSHIP.map((person, i) => (
            <motion.div
              key={person.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-start gap-4 p-6 rounded-2xl"
              style={{
                background: 'var(--card-gradient)',
                border: '1px solid rgba(99,102,241,0.2)',
                boxShadow: '0 0 32px rgba(99,102,241,0.06)',
              }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-[14px] font-bold flex-shrink-0"
                style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1.5px solid rgba(99,102,241,0.3)' }}
              >
                {initials(person.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[var(--color-text)] leading-tight mb-0.5" style={{ fontSize: '1rem' }}>
                  {person.name}
                </p>
                <span
                  className="inline-block mb-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest"
                  style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}
                >
                  {person.role}
                </span>
                <SocialLinks person={person} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Departments ─────────────────────────────────────── */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <span className="section-title">Departments</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(var(--hairline-rgb),0.07)' }} />
        </div>

        <div className="flex flex-col gap-3">
          {DEPARTMENTS.map(dept => (
            <SectionTile
              key={dept.name}
              section={dept}
              isOpen={openDept === dept.name}
              onToggle={() => setOpenDept(openDept === dept.name ? null : dept.name)}
            />
          ))}
        </div>
      </section>

      {/* ── Teams ───────────────────────────────────────────── */}
      <section className="mb-14">
        <div className="flex items-center gap-3 mb-6">
          <span className="section-title">Teams</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(var(--hairline-rgb),0.07)' }} />
        </div>

        <div className="flex flex-col gap-3">
          {TEAMS.map(team => (
            <SectionTile
              key={team.name}
              section={team}
              isOpen={openTeam === team.name}
              onToggle={() => setOpenTeam(openTeam === team.name ? null : team.name)}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="pt-6" style={{ borderTop: '1px solid rgba(var(--hairline-rgb),0.07)' }}>
        <p className="text-[12px] text-[var(--color-muted)] text-center">
          Interested in joining the committee?{' '}
          <Link
            href="https://tally.so/r/681g7e"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-accent)] hover:underline focus-ring rounded"
          >
            Apply here →
          </Link>
        </p>
      </div>
    </div>
  )
}
