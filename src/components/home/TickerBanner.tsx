'use client'

const companies = [
  'Google', 'Amazon', 'Apple', 'Cloudflare', 'Microsoft',
  'Quantinuum', 'Arm', 'DRW', 'IBM', 'Accenture',
  'Mastercard', 'Visa', 'TPP', 'G-Research',
]

const phrases = [
  'Internships & Placements',
  'Graduate Schemes',
  'Spring Weeks',
  'Career Events',
  'CV Templates',
  'From first year to first job',
  'Built by BCU students',
  'Community first',
]

const items: { text: string; isCompany: boolean }[] = companies.flatMap((c, i) => [
  { text: c, isCompany: true },
  { text: phrases[i % phrases.length], isCompany: false },
])

export function TickerBanner() {
  const doubled = [...items, ...items]

  return (
    <div
      className="overflow-hidden py-3 select-none border-b border-[var(--color-border)]"
      style={{ background: 'var(--color-surface)' }}
      aria-hidden="true"
    >
      <div className="ticker-track flex whitespace-nowrap w-max">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span
              className={`text-[12px] px-5 ${
                item.isCompany
                  ? 'text-[var(--color-text)] font-semibold'
                  : 'text-[var(--color-muted)] font-normal'
              }`}
              style={
                item.isCompany
                  ? { fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.02em' }
                  : undefined
              }
            >
              {item.text}
            </span>
            <span className="text-[var(--color-border)] select-none">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
