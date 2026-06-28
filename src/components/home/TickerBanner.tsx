'use client'

const items = [
  'Google', 'Open to all BCU Computing students', 'Amazon', 'Internships & Placements',
  'Apple', 'Graduate Schemes', 'Cloudflare', 'Spring Weeks & Insight Programmes',
  'Microsoft', 'Career Events & Workshops', 'Quantinuum', 'CV & Cover Letter Templates',
  'Arm', 'Networking Opportunities', 'DRW', 'Peer Mentorship',
  'IBM', 'Built by BCU students, for BCU students', 'Accenture', 'Community first',
  'Mastercard', 'For every computing student', 'Visa', 'Start your tech career here',
  'TPP', 'BCU Student Computing Association', 'G-Research', 'From first year to first job',
]

export function TickerBanner() {
  const doubled = [...items, ...items]

  return (
    <div className="border-b border-[var(--b1)] bg-[var(--bg2)] overflow-hidden py-2 select-none">
      <div className="ticker-track flex gap-8 whitespace-nowrap w-max">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className={`text-[11px] font-mono tracking-wide ${
              i % 2 === 0
                ? 'text-[var(--t1)] font-medium'
                : 'text-[var(--t4)] font-normal'
            }`}>
              {item}
            </span>
            <span className="text-[var(--b2)] text-[10px]">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
