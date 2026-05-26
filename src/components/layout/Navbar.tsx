'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SCALogo } from '@/components/ui/SCALogo'
import { CommitteeModal } from '@/components/layout/CommitteeModal'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/sca-opportunities', label: 'SCA Opportunities' },
  { href: '/events', label: 'Events' },
  { href: '/committee', label: 'Committee' },
]

export function Navbar() {
  const pathname = usePathname()
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--bg)]/95 backdrop-blur border-b border-[var(--b1)]">
        <nav className="flex items-center h-[52px] px-5 gap-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <SCALogo size={28} />
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-black text-[var(--t1)] tracking-wide">SCA</span>
              <span className="text-[9px] font-normal text-[var(--t1)] tracking-widest uppercase mt-[1px]">Opportunities Tracker</span>
            </div>
          </Link>

          {/* Divider */}
          <div className="w-px h-[18px] bg-[var(--b2)] mx-4 flex-shrink-0" />

          {/* Nav tabs */}
          <div className="flex items-center gap-0.5 flex-1">
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

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
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
        </nav>
      </header>

      {showModal && <CommitteeModal onClose={() => setShowModal(false)} />}
    </>
  )
}
