'use client'
import { useEffect } from 'react'

interface Props {
  onClose: () => void
}

export function CommitteeModal({ onClose }: Props) {
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
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[var(--t1)]/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 w-full max-w-[480px] bg-[var(--bg)] border border-[var(--b1)] p-8"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center text-[var(--t4)] hover:text-[var(--t1)] transition-colors text-[16px]"
        >
          ✕
        </button>

        {/* Icon */}
        <div className="w-10 h-10 border border-[var(--b1)] flex items-center justify-center text-[18px] text-[var(--t3)] mb-5">
          ✦
        </div>

        <p className="text-[10px] font-mono text-[var(--t4)] uppercase tracking-[0.14em] mb-2">// get involved</p>
        <h2 className="font-display text-[20px] font-black tracking-[-0.5px] text-[var(--t1)] mb-3 leading-snug">
          Join the SCA Committee
        </h2>

        <p className="text-[13px] text-[var(--t2)] leading-relaxed mb-4">
          The Student Computing Association is always looking for passionate BCU computing students
          to join the committee and help shape the society.
        </p>

        <p className="text-[13px] text-[var(--t3)] leading-relaxed mb-6">
          Whether you're interested in organising events, managing social media, building tech
          projects, or leading sponsorship. There's a role for you. No experience needed, just
          enthusiasm and a drive to make a difference for fellow students.
        </p>

        <div className="flex flex-col gap-2.5 p-4 bg-[var(--bg2)] border border-[var(--b1)] mb-6">
          {['Organise events & workshops', 'Grow the SCA community', 'Build real leadership experience', 'Network with industry professionals'].map(item => (
            <div key={item} className="flex items-center gap-2.5 text-[12px] text-[var(--t2)]">
              <span className="text-[var(--t4)] font-mono">—</span>
              {item}
            </div>
          ))}
        </div>

        <a
          href="https://tally.so/r/681g7e"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-[var(--t1)] text-[var(--bg)] text-[13px] font-semibold hover:opacity-80 transition-opacity"
        >
          Apply now →
        </a>

        <p className="text-center text-[11px] font-mono text-[var(--t4)] mt-3">
          Takes less than 5 minutes · Open to all BCU computing students
        </p>
      </div>
    </div>
  )
}
