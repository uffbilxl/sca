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
    <section className="relative px-5 sm:px-10 pt-16 pb-14 sm:pt-24 sm:pb-20 text-center border-b border-[var(--b1)] overflow-hidden">
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
        <span className="hidden sm:inline">Birmingham City University · Student Computing Association</span>
        <span className="sm:hidden">BCU · Student Computing Association</span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-[38px] sm:text-[52px] font-black tracking-[-2px] leading-[1.05] text-[var(--t1)] mb-4"
      >
        Your BCU Computing
        <br />
        <span className="font-light tracking-[-1px] text-[var(--t2)]">
          Community & Career Hub
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-[14px] sm:text-[15px] text-[var(--t2)] font-normal max-w-[480px] mx-auto mb-10 leading-[1.7]"
      >
        From your first year to landing your first role - events, resources, opportunities, and a{' '}
        <span className="text-[var(--t1)] font-medium">community built for every BCU computing student.</span>
      </motion.p>

      {/* CTAs */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 bg-accent text-white text-[14px] sm:text-[15px] font-semibold rounded-2xl hover:bg-[var(--acc2)] transition-all duration-200 shadow-[0_0_40px_rgba(91,141,245,0.3)] hover:shadow-[0_0_60px_rgba(91,141,245,0.45)] hover:scale-[1.03]"
        >
          Explore Opportunities
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--b2)] text-[var(--t2)] text-[14px] font-medium rounded-2xl hover:border-[var(--b3)] hover:text-[var(--t1)] transition-all duration-200"
        >
          Upcoming Events
        </Link>
      </motion.div>

      {/* Affiliation disclaimer */}
      <motion.p
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="text-[10px] text-[var(--t4)] mt-7 leading-relaxed"
      >
        Not linked or affiliated in any way, shape, or form with BCUSU, BCU Computer Science Society, or BCU Cyber Security Society.
      </motion.p>
    </section>
  )
}
