'use client'
import { motion } from 'framer-motion'

interface Stat {
  value: string
  label: string
}

const stats: Stat[] = [
  { value: '250+', label: 'Live opportunities' },
  { value: '6',    label: 'Specialist divisions' },
  { value: '100%', label: 'Free for BCU students' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

export function StatsStrip() {
  return (
    <section
      className="section-divider"
      style={{
        background: 'var(--stats-strip-gradient)',
      }}
    >
      <div className="max-w-[1080px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-x divide-[var(--color-border-subtle)]">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              className="flex flex-col items-center justify-center py-10 sm:py-12 px-4 text-center"
            >
              <span
                className="block font-bold tabular-nums leading-none mb-2"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  letterSpacing: '-0.03em',
                  color: 'var(--color-text)',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
                }}
              >
                {stat.value}
              </span>
              <span
                className="text-[var(--color-muted)] font-medium"
                style={{ fontSize: '0.8125rem' }}
              >
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
