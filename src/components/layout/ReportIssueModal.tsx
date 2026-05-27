'use client'
import { useEffect } from 'react'

interface Props {
  onClose: () => void
}

const contacts = [
  { name: 'Baber Khan', role: 'Web Platform Engineer', email: 'baber.khan@mail.bcu.ac.uk' },
  { name: 'Tayyeb Nadeem Somro', role: 'President', email: 'tayyeb.nadeemsomro@mail.bcu.ac.uk' },
  { name: 'Bilal Arshad', role: 'VP Cyber Security', email: 'bilal.arshad2@mail.bcu.ac.uk' },
]

export function ReportIssueModal({ onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-[460px] bg-[var(--bg2)] border border-[var(--b2)] rounded-2xl p-8 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-md text-[var(--t4)] hover:text-[var(--t2)] hover:bg-[var(--bg4)] transition-colors text-[16px]"
        >
          ✕
        </button>

        <div className="w-12 h-12 rounded-xl bg-[var(--bg3)] border border-[var(--b2)] flex items-center justify-center text-[20px] mb-5">
          ◎
        </div>

        <p className="text-[10px] text-accent uppercase tracking-[0.14em] mb-2">Get in touch</p>
        <h2 className="text-[20px] font-black tracking-[-0.5px] text-[var(--t1)] mb-3 leading-snug">
          Report an Issue
        </h2>

        <p className="text-[13px] text-[var(--t3)] leading-relaxed mb-6">
          Spotted something not working, or have a suggestion for the platform? Reach out directly to one of the team members below and we will get it sorted.
        </p>

        <div className="flex flex-col gap-2">
          {contacts.map(c => (
            <a
              key={c.email}
              href={`mailto:${c.email}`}
              className="flex items-center justify-between gap-3 p-3.5 rounded-xl border border-[var(--b1)] bg-[var(--bg3)] hover:border-[var(--b3)] hover:bg-[var(--bg4)] transition-all group"
            >
              <div>
                <div className="text-[12px] font-semibold text-[var(--t1)]">{c.name}</div>
                <div className="text-[10px] text-[var(--t4)] mt-0.5">{c.role}</div>
              </div>
              <span className="text-[11px] text-[var(--t3)] group-hover:text-accent transition-colors shrink-0">{c.email}</span>
            </a>
          ))}
        </div>

        <p className="text-center text-[11px] text-[var(--t4)] mt-5">
          Clicking a name will open your email client directly.
        </p>
      </div>
    </div>
  )
}
