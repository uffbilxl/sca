'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CommitteeModal } from '@/components/layout/CommitteeModal'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/sca-opportunities', label: 'SCA Opportunities' },
  { href: '/events', label: 'Events' },
  { href: '/committee', label: 'Committee' },
  { href: '/resources', label: 'Resources' },
]

export function Navbar() {
  const pathname = usePathname()
  const [showModal, setShowModal] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--bg)]/95 backdrop-blur border-b border-[var(--b1)]">
        <nav className="flex items-center h-[52px] px-5 gap-0">
          {/* Logo */}
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-4 flex-shrink-0 mr-2">
            <div className="flex flex-col leading-none">
              <span className="text-[18px] font-black text-[var(--t1)] tracking-tight">SCA</span>
              <span className="text-[8.5px] font-normal text-[var(--t3)] tracking-wide mt-[2px]">Birmingham City University</span>
            </div>
            <div className="w-px h-7 bg-[var(--b2)]" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {navLinks.map(link => {
              const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-[13px] rounded-md transition-colors ${
                    active
                      ? 'text-[var(--t1)] bg-[var(--bg3)]'
                      : 'text-[var(--t3)] hover:text-[var(--t2)] hover:bg-[var(--bg3)]'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0 ml-auto">
            <button
              onClick={() => setShowModal(true)}
              className="px-3 py-1.5 text-[12px] font-medium text-[var(--t2)] border border-[var(--b2)] rounded-md hover:border-accent hover:text-accent transition-colors"
            >
              Join the Committee
            </button>
            <Link
              href="https://www.linkedin.com/company/bcu-student-computing-association/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-[12px] font-medium text-[#090909] bg-[var(--t1)] rounded-md hover:bg-[#e0e0e0] transition-colors"
            >
              Join SCA
            </Link>
          </div>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <Link
              href="https://www.linkedin.com/company/bcu-student-computing-association/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 text-[11px] font-medium text-[#090909] bg-[var(--t1)] rounded-md hover:bg-[#e0e0e0] transition-colors"
            >
              Join SCA
            </Link>
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="w-8 h-8 flex flex-col items-center justify-center gap-1.5 rounded-md hover:bg-[var(--bg3)] transition-colors flex-shrink-0"
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-0.5 bg-[var(--t2)] transition-all duration-200 origin-center ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-5 h-0.5 bg-[var(--t2)] transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-0.5 bg-[var(--t2)] transition-all duration-200 origin-center ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--b1)] bg-[var(--bg)]/98 backdrop-blur">
            <div className="px-4 py-2 flex flex-col gap-0.5">
              {navLinks.map(link => {
                const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2.5 text-[14px] rounded-md transition-colors ${
                      active
                        ? 'text-[var(--t1)] bg-[var(--bg3)]'
                        : 'text-[var(--t3)] hover:text-[var(--t2)] hover:bg-[var(--bg3)]'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <div className="h-px bg-[var(--b1)] my-1.5" />
              <button
                onClick={() => { setShowModal(true); setMobileOpen(false) }}
                className="px-3 py-2.5 text-[14px] text-left font-medium text-[var(--t2)] border border-[var(--b2)] rounded-md hover:border-accent hover:text-accent transition-colors mb-1"
              >
                Join the Committee
              </button>
            </div>
          </div>
        )}
      </header>

      {showModal && <CommitteeModal onClose={() => setShowModal(false)} />}
    </>
  )
}
