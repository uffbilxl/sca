'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface Member {
  name: string
  role: string
  linkedin?: string
  website?: string
}

interface Division {
  name: string
  color: string
  members: Member[]
}

const LEADERSHIP: Member[] = [
  {
    name: 'Tayyeb Nadeem Somro',
    role: 'President',
    linkedin: 'https://www.linkedin.com/in/tayyeb-nadeem-somro/',
    website: 'http://tayyebns.com',
  },
]

const DIVISIONS: Division[] = [
  {
    name: 'Cyber Security',
    color: '#ef4444',
    members: [
      { name: 'Bilal Arshad', role: 'VP Cyber Security', linkedin: 'https://www.linkedin.com/in/bilal-arshad-4a07812b4/', website: 'https://bilalarshad.co.uk' },
      { name: 'Prem Lodhia', role: 'Technical Coordinator', linkedin: 'https://www.linkedin.com/in/prem-lodhia-29a888382/', website: 'https://premlodhia.com' },
      { name: 'Daeron Wallace', role: 'Cyber Security Project Supervisor', linkedin: 'https://www.linkedin.com/in/daeron-wallace/' },
    ],
  },
  {
    name: 'Software Engineering',
    color: '#22c55e',
    members: [
      { name: 'Yasamin Zaid', role: 'VP Software Engineering', linkedin: 'https://www.linkedin.com/in/yasaminzaid/', website: 'https://yasaminzaid.com' },
      { name: 'Asim Raza', role: 'Software Engineering Project Supervisor', linkedin: 'https://www.linkedin.com/in/muhammad-asim-r-0a577b3a9/' },
      { name: 'Hamzah Abdur Rahman', role: 'Software Engineering Project Supervisor', linkedin: 'https://www.linkedin.com/in/hamzah-abdur-rahman-5553ab2b8/' },
      { name: 'Prem Lodhia', role: 'Technical Coordinator', linkedin: 'https://www.linkedin.com/in/prem-lodhia-29a888382/', website: 'https://premlodhia.com' },
      { name: 'Baber Khan', role: 'Technical Assistant', linkedin: 'https://www.linkedin.com/in/baberr/', website: 'https://baberr.com' },
    ],
  },
  {
    name: 'Artificial Intelligence',
    color: '#a855f7',
    members: [
      { name: 'Orlando Igwe', role: 'VP Artificial Intelligence', linkedin: 'https://www.linkedin.com/in/orlando-igwe/' },
      { name: 'Mohamed Dahir', role: 'Analytics Lead', linkedin: 'https://www.linkedin.com/in/m-a-dahir/' },
      { name: 'Ali Bhuiyan', role: 'AI Project Supervisor', linkedin: 'https://www.linkedin.com/in/shakayat-ali-bhuiyan-b93179309/' },
      { name: 'Zakaria Miah', role: 'AI Project Supervisor', linkedin: 'https://www.linkedin.com/in/zakaria-miah/' },
      { name: 'Al Tahsin Rafi', role: 'AI Project Supervisor', linkedin: 'https://www.linkedin.com/in/al-tahsin-rafi-18b75631b/' },
    ],
  },
  {
    name: 'Computer Science',
    color: '#f59e0b',
    members: [
      { name: 'Alaa Aljasem', role: 'VP Computer Science', linkedin: 'https://www.linkedin.com/in/alaa-aljasem-b816b83aa/' },
      { name: 'Jasleen Kaur', role: 'Events Assistant', linkedin: 'https://www.linkedin.com/in/jasleen-kaur-269367387/' },
      { name: 'Ayaan Ahmed', role: 'Technical Coordinator', linkedin: 'https://www.linkedin.com/in/ayaan-ahmed-477289330/' },
    ],
  },
  {
    name: 'Digital Transformation',
    color: '#06b6d4',
    members: [
      { name: 'Hodane Gouled', role: 'VP Digital Transformation', linkedin: 'https://www.linkedin.com/in/hodane-gouled-b32534230/' },
      { name: 'Joe Paddock', role: 'Strategic Advisor', linkedin: 'https://www.linkedin.com/in/joepaddock-uk/' },
    ],
  },
  {
    name: 'Research & Development',
    color: '#f97316',
    members: [
      { name: 'Michael Martinak', role: 'Head of R&D', linkedin: 'https://www.linkedin.com/in/profile-mmartinak/' },
      { name: 'George James', role: 'Researcher', linkedin: 'https://www.linkedin.com/in/georgeojames/' },
      { name: 'Baber Khan', role: 'Researcher', linkedin: 'https://www.linkedin.com/in/baberr/', website: 'https://baberr.com' },
    ],
  },
  {
    name: 'Web Platform',
    color: '#ec4899',
    members: [
      { name: 'Muhammad Asim Raza', role: 'Web Platform Engineer', linkedin: 'https://www.linkedin.com/in/muhammad-asim-r-0a577b3a9/' },
      { name: 'Bilal Arshad', role: 'Website Administrator', linkedin: 'https://www.linkedin.com/in/bilal-arshad-4a07812b4/', website: 'https://bilalarshad.co.uk' },
    ],
  },
  {
    name: 'Engagement & Marketing',
    color: '#2dd4bf',
    members: [
      { name: 'Maryam Ahmad', role: 'Head of Engagement', linkedin: 'https://www.linkedin.com/in/maryam-a-259297235' },
      { name: 'Samyaan Khan', role: 'Graphic Designer', linkedin: 'https://www.linkedin.com/in/samyaan-khan-036977250/' },
      { name: 'Mohammad Hamza', role: 'Social Media Manager', linkedin: 'https://www.linkedin.com/in/mohammad-hamza-97729322b/' },
      { name: 'Abrar Alam', role: 'Content Creator / Photographer', linkedin: 'https://www.linkedin.com/in/abrartalam/' },
    ],
  },
]

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function PaperclipIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  )
}

function LinkedInButton({ member }: { member: Member }) {
  if (member.linkedin) {
    return (
      <Link href={member.linkedin} target="_blank" rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className="flex items-center justify-center w-7 h-7 text-[#0077b5] border border-[var(--b1)] hover:border-[var(--t1)] transition-colors"
        title={`${member.name} on LinkedIn`}>
        <LinkedInIcon />
      </Link>
    )
  }
  return (
    <span className="flex items-center justify-center w-7 h-7 text-[var(--t4)] border border-[var(--b1)]" title="LinkedIn coming soon">
      <LinkedInIcon />
    </span>
  )
}

function WebsiteButton({ member }: { member: Member }) {
  if (!('website' in member)) return null
  if (member.website) {
    return (
      <Link href={member.website} target="_blank" rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className="flex items-center justify-center w-7 h-7 text-[var(--t3)] border border-[var(--b1)] hover:border-[var(--t1)] hover:text-[var(--t1)] transition-colors"
        title={`${member.name}'s website`}>
        <PaperclipIcon />
      </Link>
    )
  }
  return (
    <span className="flex items-center justify-center w-7 h-7 text-[var(--t4)] border border-[var(--b1)]" title="Website coming soon">
      <PaperclipIcon />
    </span>
  )
}

function MemberCard({ member, accentColor, isVP, index }: { member: Member; accentColor: string; isVP: boolean; index: number }) {
  const initials = member.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-3 p-4 border border-[var(--b1)] bg-[var(--bg)] hover:bg-[var(--bg2)] transition-colors"
      style={isVP ? { borderTopColor: accentColor, borderTopWidth: '2px' } : {}}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 flex items-center justify-center text-[13px] font-mono font-bold flex-shrink-0 border border-[var(--b1)]"
          style={{ color: accentColor }}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-[var(--t1)] leading-tight">{member.name}</p>
          <p className="text-[11px] font-mono text-[var(--t3)] leading-tight mt-0.5">{member.role}</p>
          {isVP && (
            <span className="inline-block mt-1 text-[9px] font-mono font-medium uppercase tracking-wider px-1.5 py-0.5 border border-[var(--b1)] text-[var(--t4)]">
              Lead
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <LinkedInButton member={member} />
          <WebsiteButton member={member} />
        </div>
      </div>
    </motion.div>
  )
}

export default function CommitteePage() {
  const [selected, setSelected] = useState<string | null>(null)
  const divisionsRef = useRef<HTMLElement>(null)

  const activeDivision = DIVISIONS.find(d => d.name === selected) ?? null

  function openDivision(name: string) {
    setSelected(name)
    setTimeout(() => {
      divisionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  return (
    <div className="max-w-[1000px] mx-auto px-4 sm:px-8 py-7 sm:py-10">

      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] font-mono text-[var(--t4)] uppercase tracking-[0.14em] mb-2">// Student Computing Association</p>
        <h1 className="font-display text-[26px] font-black tracking-[-0.6px] text-[var(--t1)] mb-2">Meet the Committee</h1>
        <p className="text-[13px] text-[var(--t3)] max-w-lg leading-relaxed">
          The people behind the SCA, organising events, driving projects, and building the BCU computing community.
        </p>
      </div>

      {/* Leadership */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[10px] font-mono font-medium text-[var(--t4)] uppercase tracking-widest">// leadership</span>
          <div className="flex-1 h-px bg-[var(--b1)]" />
        </div>

        {/* President */}
        <div className="flex justify-center mb-4">
          <div className="p-5 border border-[var(--b1)] border-t-2 border-t-[var(--t1)] bg-[var(--bg2)] w-full max-w-[300px]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 flex items-center justify-center text-[13px] font-mono font-bold flex-shrink-0 text-[var(--t1)] border border-[var(--b1)]">
                TNS
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <p className="text-[14px] font-bold text-[var(--t1)]">{LEADERSHIP[0].name}</p>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-medium tracking-wide text-[var(--t4)] border border-[var(--b1)] uppercase flex-shrink-0">
                    President
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <LinkedInButton member={LEADERSHIP[0]} />
              <WebsiteButton member={LEADERSHIP[0]} />
            </div>
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center mb-4">
          <div className="w-px h-5 bg-[var(--b1)]" />
        </div>

        {/* Vice Presidents */}
        <div className="flex flex-wrap justify-center gap-3">
          {DIVISIONS.map(div => {
            const vp = div.members[0]
            const initials = vp.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
            return (
              <button
                key={div.name}
                onClick={() => openDivision(div.name)}
                className="w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(25%-9px)] text-left flex flex-col gap-3 p-4 border border-[var(--b1)] bg-[var(--bg)] hover:bg-[var(--bg2)] hover:border-[var(--b2)] transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center text-[12px] font-mono font-bold flex-shrink-0 border border-[var(--b1)]"
                    style={{ color: div.color }}
                  >
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--t1)] leading-tight">{vp.name}</p>
                    <p className="text-[11px] font-mono leading-tight mt-0.5" style={{ color: div.color }}>{div.name}</p>
                  </div>
                </div>
                <p className="text-[11px] text-[var(--t3)] leading-tight">{vp.role}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <LinkedInButton member={vp} />
                    <WebsiteButton member={vp} />
                  </div>
                  <span className="text-[10px] font-mono text-[var(--t4)] group-hover:text-[var(--t1)] transition-colors">
                    View team →
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Division selector */}
      <section ref={divisionsRef}>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[10px] font-mono font-medium text-[var(--t4)] uppercase tracking-widest">// divisions</span>
          <div className="flex-1 h-px bg-[var(--b1)]" />
          {selected && (
            <button onClick={() => setSelected(null)}
              className="text-[11px] font-mono text-[var(--t4)] hover:text-[var(--t1)] transition-colors">
              ✕ close
            </button>
          )}
        </div>

        {/* Tile grid */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {DIVISIONS.map(div => {
            const isActive = selected === div.name
            return (
              <button
                key={div.name}
                onClick={() => setSelected(isActive ? null : div.name)}
                className="relative text-left p-4 border transition-colors overflow-hidden group w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] lg:w-[calc(25%-9px)]"
                style={{
                  borderColor: isActive ? div.color : 'var(--b1)',
                  background: isActive ? 'var(--bg2)' : 'var(--bg)',
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full block mb-3 flex-shrink-0"
                  style={{ background: div.color }}
                />
                <p className="text-[12px] font-display font-bold text-[var(--t1)] leading-snug mb-1">{div.name}</p>
                <p className="text-[10px] font-mono text-[var(--t4)]">{div.members.length - 1} member{div.members.length - 1 !== 1 ? 's' : ''}</p>

                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: div.color }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Animated members panel */}
        <AnimatePresence mode="wait">
          {activeDivision && (
            <motion.div
              key={activeDivision.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="border border-[var(--b1)] overflow-hidden"
            >
              {/* Panel header */}
              <div className="px-5 py-3.5 flex items-center gap-3 bg-[var(--bg2)] border-b border-[var(--b1)]">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: activeDivision.color }} />
                <span className="font-display text-[13px] font-bold text-[var(--t1)]">{activeDivision.name}</span>
                <span className="text-[11px] font-mono text-[var(--t4)] ml-auto">{activeDivision.members.length} members</span>
              </div>

              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-[var(--bg)]">
                {activeDivision.members.slice(1).map((member, i) => (
                  <MemberCard
                    key={member.name}
                    member={member}
                    accentColor={activeDivision.color}
                    isVP={false}
                    index={i}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-[var(--b1)] text-center">
        <p className="text-[12px] text-[var(--t4)]">
          Interested in joining the committee?{' '}
          <Link href="https://tally.so/r/681g7e" target="_blank" rel="noopener noreferrer" className="text-[var(--t1)] hover:underline">
            Apply here →
          </Link>
        </p>
      </div>
    </div>
  )
}
