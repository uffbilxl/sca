'use client'

const items = [
  'Google', 'Software Engineering Internship', 'Microsoft', 'Year in Industry',
  'Amazon', 'Spring Week', 'Goldman Sachs', 'Data Science Placement',
  'Meta', 'Graduate Scheme', 'Palantir', 'Cyber Security Internship',
  'JPMorgan', 'Full-Stack Developer Placement', 'Apple', 'Machine Learning Intern',
  'Deloitte', 'Cloud Engineering Placement', 'KPMG', 'UX Design Internship',
  'IBM', 'Insight Programme', 'PwC', 'Software Developer Graduate',
  'Accenture', 'BCU Computing', 'BCG', 'Technology Analyst Internship',
]

export function TickerBanner() {
  const doubled = [...items, ...items]

  return (
    <div className="border-b border-[var(--b1)] bg-[var(--bg2)] overflow-hidden py-2 select-none">
      <div className="ticker-track flex gap-8 whitespace-nowrap w-max">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className={`text-[11px] tracking-wide ${
              i % 2 === 0
                ? 'text-accent/60 font-medium'
                : 'text-[var(--t4)] font-normal'
            }`}>
              {item}
            </span>
            <span className="text-[var(--b3)] text-[10px]">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
