'use client'
import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  onClose: () => void
}

const contacts = [
  { name: 'Muhammad Asim Raza',   role: 'Web Platform Engineer', email: 'Muhammad.raza6@mail.bcu.ac.uk' },
  { name: 'Tayyeb Nadeem Somro',  role: 'President',             email: 'tayyeb.nadeemsomro@mail.bcu.ac.uk' },
  { name: 'Bilal Arshad',         role: 'Vice President',        email: 'bilal.arshad2@mail.bcu.ac.uk' },
]

export function ReportIssueModal({ onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        />

        {/* Panel */}
        <motion.div
          className="relative z-10 w-full max-w-[460px] rounded-2xl p-8 shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #141420 0%, #0f0f18 100%)',
            border: '1px solid rgba(255,255,255,0.09)',
          }}
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: '#6e6e73', background: 'transparent' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = '#f5f5f7' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#6e6e73' }}
            aria-label="Close"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>

          <p className="eyebrow mb-2">Get in touch</p>
          <h2
            className="font-bold mb-3 leading-snug"
            style={{ fontSize: '1.25rem', color: '#f5f5f7', letterSpacing: '-0.02em' }}
          >
            Report an Issue
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#86868b', lineHeight: 1.65, marginBottom: '1.5rem' }}>
            Spotted something not working, or have a suggestion? Reach out directly to a team member below.
          </p>

          <div className="flex flex-col gap-2">
            {contacts.map((c, i) => (
              <motion.a
                key={c.email}
                href={`mailto:${c.email}`}
                className="flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all group"
                style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + i * 0.06, duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'rgba(99,102,241,0.3)'
                  el.style.background = 'rgba(99,102,241,0.06)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement
                  el.style.borderColor = 'rgba(255,255,255,0.07)'
                  el.style.background = 'rgba(255,255,255,0.03)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f5f5f7' }}>{c.name}</div>
                  <div style={{ fontSize: '0.6875rem', color: '#6e6e73', marginTop: '2px' }}>{c.role}</div>
                </div>
                <span style={{ fontSize: '0.6875rem', color: '#86868b' }}>{c.email}</span>
              </motion.a>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.6875rem', color: '#48484a', marginTop: '1.25rem' }}>
            Clicking a name will open your email client directly.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
