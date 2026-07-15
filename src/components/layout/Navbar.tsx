'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CommitteeModal } from '@/components/layout/CommitteeModal'

const navLinks = [
  { href: '/',                label: 'Home' },
  { href: '/opportunities',   label: 'Opportunities' },
  { href: '/sca-opportunities', label: 'SCA' },
  { href: '/events',          label: 'Events' },
  { href: '/committee',       label: 'Committee' },
  { href: '/resources',       label: 'Resources' },
  { href: '/about',           label: 'About' },
]

export function Navbar() {
  const pathname = usePathname()
  const [showModal, setShowModal]   = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 1)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const glassStyle = scrolled
    ? {
        /* Apple's exact nav glass formula */
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }
    : {
        background: 'rgba(0, 0, 0, 0)',
        backdropFilter: 'saturate(180%) blur(0px)',
        WebkitBackdropFilter: 'saturate(180%) blur(0px)',
        borderBottom: '1px solid transparent',
      }

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-500"
        style={glassStyle}
      >
        <nav
          className="max-w-[1080px] mx-auto flex items-center h-12 px-6 sm:px-10"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col leading-none flex-shrink-0 mr-10 focus-ring rounded-sm"
          >
            <span
              className="font-bold tracking-tight text-[var(--color-text)]"
              style={{
                fontSize: '1rem',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
                letterSpacing: '-0.01em',
              }}
            >
              SCA
            </span>
            <span
              className="text-[var(--color-muted)]"
              style={{ fontSize: '0.5625rem', letterSpacing: '0.03em', marginTop: '1px' }}
            >
              Birmingham City University
            </span>
          </Link>

          {/* Desktop links — centered */}
          <div className="hidden md:flex items-center gap-0 flex-1 justify-center">
            {navLinks.map(link => {
              const active =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 rounded-md transition-colors duration-150 focus-ring group ${
                    active
                      ? 'text-[var(--color-text)]'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                  }`}
                  style={{ fontSize: '0.8125rem', fontWeight: active ? 500 : 400 }}
                >
                  {link.label}
                  {/* Underline slides from center */}
                  {active && (
                    <span
                      className="absolute bottom-[4px] left-3 right-3 h-px bg-[var(--color-text)] origin-center"
                      style={{ transform: 'scaleX(1)' }}
                    />
                  )}
                  {!active && (
                    <span
                      className="absolute bottom-[4px] left-3 right-3 h-px bg-[var(--color-muted)] origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-200"
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0 ml-auto">
            <Link
              href="/cv-builder"
              className="px-4 py-1.5 text-[var(--color-accent)] border border-[var(--color-accent)]/35 rounded-full hover:border-[var(--color-accent)]/70 hover:bg-[var(--color-accent-dim)] transition-all duration-200 focus-ring"
              style={{ fontSize: '0.8125rem', fontWeight: 500 }}
            >
              CV Builder
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-1.5 text-[var(--color-muted)] border border-[var(--color-border)] rounded-full hover:border-[var(--b2)] hover:text-[var(--color-text)] transition-all duration-200 focus-ring"
              style={{ fontSize: '0.8125rem' }}
            >
              Join Committee
            </button>
            <Link
              href="https://www.linkedin.com/company/bcu-student-computing-association/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient px-4 py-1.5 rounded-full focus-ring"
              style={{ fontSize: '0.8125rem' }}
            >
              Join SCA
            </Link>
          </div>

          {/* Mobile: Join + hamburger */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <Link
              href="https://www.linkedin.com/company/bcu-student-computing-association/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gradient px-3 py-1.5 rounded-full focus-ring"
              style={{ fontSize: '0.75rem' }}
            >
              Join SCA
            </Link>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="w-8 h-8 flex flex-col items-center justify-center gap-[5px] rounded-lg hover:bg-white/5 transition-colors focus-ring"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              <span
                className={`w-5 h-px bg-[var(--color-muted)] transition-all duration-200 origin-center ${
                  mobileOpen ? 'rotate-45 translate-y-[3px]' : ''
                }`}
              />
              <span
                className={`w-5 h-px bg-[var(--color-muted)] transition-all duration-200 ${
                  mobileOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`w-5 h-px bg-[var(--color-muted)] transition-all duration-200 origin-center ${
                  mobileOpen ? '-rotate-45 -translate-y-[3px]' : ''
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile fullscreen overlay */}
      {mobileOpen && (
        <div
          className="fixed top-12 inset-x-0 bottom-0 z-40 md:hidden flex flex-col overflow-y-auto"
          style={{
            background: 'rgba(0,0,0,0.96)',
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="px-6 py-6 flex flex-col gap-1">
            {navLinks.map(link => {
              const active =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-4 rounded-xl transition-colors text-[15px] font-medium ${
                    active
                      ? 'text-[var(--color-text)] bg-white/5'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            <div
              className="my-4"
              style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }}
            />

            <Link
              href="/cv-builder"
              className="px-4 py-4 text-[15px] font-medium text-left text-[var(--color-accent)] border border-[var(--color-accent)]/30 rounded-xl hover:border-[var(--color-accent)]/60 transition-colors focus-ring"
            >
              CV Builder
            </Link>
            <button
              onClick={() => { setShowModal(true); setMobileOpen(false) }}
              className="mt-2 px-4 py-4 text-[15px] font-medium text-left text-[var(--color-muted)] border border-[var(--color-border)] rounded-xl hover:text-[var(--color-text)] transition-colors focus-ring"
            >
              Join the Committee
            </button>
          </div>
        </div>
      )}

      {showModal && <CommitteeModal onClose={() => setShowModal(false)} />}
    </>
  )
}
