'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
}

export function HeroContent() {
  return (
    <section className="relative px-10 pt-24 pb-20 text-center border-b border-[var(--b1)] overflow-hidden">
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 60% at 50% 0%, rgba(91,141,245,0.22) 0%, transparent 70%)',
        }}
      />

      {/* Badge */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[var(--b2)] rounded-full text-[10px] text-[var(--t3)] tracking-[0.12em] uppercase mb-7"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 animate-pulse" />
        Birmingham City University · Student Computing Association
      </motion.div>

      {/* Headline */}
      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-[52px] font-black tracking-[-2px] leading-[1.05] text-[var(--t1)] mb-4"
      >
        Find Your Next
        <br />
        <span className="font-light tracking-[-1px] text-[var(--t2)]">
          Tech Opportunity
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-[15px] text-[var(--t2)] font-normal max-w-[420px] mx-auto mb-10 leading-[1.7]"
      >
        Internships, placements, grad roles, spring weeks and events —{' '}
        <span className="text-[var(--t1)] font-medium">curated for BCU computing students.</span>
      </motion.p>

      {/* CTA */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="show"
      >
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-3 px-10 py-4 bg-accent text-white text-[15px] font-semibold rounded-2xl hover:bg-[var(--acc2)] transition-all duration-200 shadow-[0_0_40px_rgba(91,141,245,0.3)] hover:shadow-[0_0_60px_rgba(91,141,245,0.45)] hover:scale-[1.03]"
        >
          Explore Opportunities
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </motion.div>
    </section>
  )
}
