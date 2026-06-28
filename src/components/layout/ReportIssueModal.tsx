'use client'
import { useEffect } from 'react'

interface Props {
  onClose: () => void
}

const contacts = [
  { name: 'Muhammad Asim Raza', role: 'Web Platform Engineer', email: 'Muhammad.raza6@mail.bcu.ac.uk' },
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
      <div className="absolute inset-0 bg-[var(--t1)]/40 backdrop-blur-sm" />

      <div
        className="relative z-10 w-full max-w-[460px] bg-[var(--bg)] border border-[var(--b1)] p-8"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center text-[var(--t4)] hover:text-[var(--t1)] transition-colors text-[16px]"
        >
          ✕
        </button>

        <div className="w-10 h-10 border border-[var(--b1)] flex items-center justify-center text-[18px] text-[var(--t3)] mb-5">
          ◎
        </div>

        <p className="text-[10px] font-mono text-[var(--t4)] uppercase tracking-[0.14em] mb-2">// get in touch</p>
        <h2 className="font-display text-[20px] font-black tracking-[-0.5px] text-[var(--t1)] mb-3 leading-snug">
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
              className="flex items-center justify-between gap-3 p-3.5 border border-[var(--b1)] bg-[var(--bg2)] hover:border-[var(--t1)] hover:bg-[var(--bg3)] transition-all group"
            >
              <div>
                <div className="text-[12px] font-semibold text-[var(--t1)]">{c.name}</div>
                <div className="text-[10px] font-mono text-[var(--t4)] mt-0.5">{c.role}</div>
              </div>
              <span className="text-[11px] font-mono text-[var(--t3)] group-hover:text-[var(--t1)] transition-colors shrink-0">{c.email}</span>
            </a>
          ))}
        </div>

        <p className="text-center text-[11px] font-mono text-[var(--t4)] mt-5">
          Clicking a name will open your email client directly.
        </p>
      </div>
    </div>
  )
}
