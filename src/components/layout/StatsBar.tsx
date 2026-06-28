'use client'
import { motion } from 'framer-motion'

interface StatsBarProps {
  total: number
  open: number
  companies: number
  deadlines: number
}

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: 0.4 + i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
}

const borderClass = (i: number) => {
  if (i === 0) return 'border-r border-b sm:border-b-0 border-[var(--b1)]'
  if (i === 1) return 'border-b sm:border-b-0 sm:border-r border-[var(--b1)]'
  if (i === 2) return 'border-r border-[var(--b1)]'
  return ''
}

export function StatsBar({ total, open, companies, deadlines }: StatsBarProps) {
  const stats = [
    { n: total, l: 'Opportunities' },
    { n: open, l: 'Open Roles' },
    { n: companies, l: 'Companies Hiring' },
    { n: deadlines, l: 'Deadlines This Week' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[var(--b1)]">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className={`py-6 sm:py-8 text-center ${borderClass(i)}`}
        >
          <div className="font-display text-[26px] sm:text-[30px] font-black text-[var(--t1)] tracking-tight tabular-nums">
            {s.n.toLocaleString()}
          </div>
          <div className="text-[10px] font-mono text-[var(--t4)] uppercase tracking-[0.12em] mt-1.5">{s.l}</div>
        </motion.div>
      ))}
    </div>
  )
}
