import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { OpportunityCard } from '@/components/opportunities/OpportunityCard'
import { StatsBar } from '@/components/layout/StatsBar'
import { SCALogo } from '@/components/ui/SCALogo'
import { TickerBanner } from '@/components/home/TickerBanner'
import { HeroContent } from '@/components/home/HeroContent'

async function getHomeData() {
  const [featured, totalCount, openCount, companiesCount, deadlineCount] = await Promise.all([
    (async () => {
      const types = ['INTERNSHIP', 'PLACEMENT', 'GRADUATE', 'SPRING_WEEK'] as const
      const perType = await Promise.all(
        types.map(t =>
          prisma.opportunity.findMany({
            where: { featured: true, status: { not: 'CLOSED' }, type: t },
            take: 2,
            include: { company: true, tags: { include: { tag: true } } },
            orderBy: { createdAt: 'asc' },
          })
        )
      )
      // interleave: first of each type, then second of each, capped at 6
      const first = perType.map(arr => arr[0]).filter(Boolean)
      const second = perType.map(arr => arr[1]).filter(Boolean)
      return [...first, ...second].slice(0, 6)
    })(),
    prisma.opportunity.count(),
    prisma.opportunity.count({ where: { status: { in: ['OPEN', 'CLOSING_SOON'] } } }),
    prisma.company.count(),
    prisma.opportunity.count({
      where: {
        deadline: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ])
  return { featured, stats: { totalCount, openCount, companiesCount, deadlineCount } }
}

const categories = [
  { label: 'Internships', type: 'INTERNSHIP', icon: null },
  { label: 'Placements', type: 'PLACEMENT', icon: null },
  { label: 'Graduate', type: 'GRADUATE', icon: null },
  { label: 'Spring Weeks', type: 'SPRING_WEEK', icon: null },
  { label: 'Events', type: null, href: '/events', icon: null },
]

const whyItems = [
  {
    title: 'Built for BCU computing students',
    text: 'Only tech roles and opportunities relevant to you — no noise, no irrelevant listings to wade through.',
  },
  {
    title: 'Never miss a deadline',
    text: 'Countdown indicators and status badges on every listing so you know exactly how much time you have.',
  },
  {
    title: 'Peer insights',
    text: 'Read honest feedback and tips from BCU students who have already applied, interviewed, and got the offer.',
  },
]

export default async function HomePage() {
  const { featured, stats } = await getHomeData()

  return (
    <div className="min-h-screen">
      <TickerBanner />
      <HeroContent />

      {/* Stats */}
      <StatsBar
        total={stats.totalCount}
        open={stats.openCount}
        companies={stats.companiesCount}
        deadlines={stats.deadlineCount}
      />

      {/* Featured */}
      <section className="px-10 py-14 border-b border-[var(--b1)]">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="text-[10px] text-accent uppercase tracking-[0.14em] mb-1">Handpicked</p>
            <h2 className="text-[16px] font-semibold text-[var(--t1)]">Featured opportunities</h2>
          </div>
          <Link href="/opportunities" className="text-[12px] text-[var(--t3)] hover:text-accent transition-colors flex items-center gap-1">
            View all <span>→</span>
          </Link>
        </div>
        {featured.length > 0 ? (
          <div className="grid grid-cols-3 gap-px bg-[var(--b1)] border border-[var(--b1)] rounded-xl overflow-hidden">
            {featured.map(opp => (
              <OpportunityCard key={opp.id} opportunity={opp as any} showFeaturedBadge />
            ))}
          </div>
        ) : (
          <div className="border border-[var(--b1)] rounded-xl bg-[var(--bg2)] py-16 text-center">
            <p className="text-[13px] text-[var(--t4)]">No featured opportunities yet.</p>
            <p className="text-[12px] text-[var(--t4)] mt-1">Add some from the admin panel.</p>
          </div>
        )}
      </section>

      {/* Browse by type */}
      <section className="px-10 py-14 border-b border-[var(--b1)]">
        <div className="mb-8">
          <p className="text-[10px] text-accent uppercase tracking-[0.14em] mb-1">Explore</p>
          <h2 className="text-[16px] font-semibold text-[var(--t1)]">Browse by type</h2>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {categories.map(cat => (
            <Link
              key={cat.label}
              href={cat.href ?? `/opportunities?type=${cat.type}`}
              className="group bg-[var(--bg2)] border border-[var(--b1)] rounded-xl px-4 py-6 text-center hover:border-[var(--b3)] hover:bg-[var(--bg3)] transition-all duration-200"
            >
              <div className="text-[11px] font-medium text-[var(--t2)] group-hover:text-[var(--t1)] transition-colors tracking-wide">{cat.label}</div>
              <div className="mt-2 h-px w-6 bg-[var(--b3)] mx-auto group-hover:bg-accent transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="px-10 py-14 border-b border-[var(--b1)]">
        <div className="mb-8">
          <p className="text-[10px] text-accent uppercase tracking-[0.14em] mb-1">About</p>
          <h2 className="text-[16px] font-semibold text-[var(--t1)]">Why use SCA Tracker?</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {whyItems.map((v, i) => (
            <div key={v.title} className="bg-[var(--bg2)] border border-[var(--b1)] border-l-accent border-l-2 rounded-xl p-7">
              <div className="text-[10px] text-[var(--t4)] uppercase tracking-[0.14em] mb-3">0{i + 1}</div>
              <div className="text-[14px] font-semibold text-[var(--t1)] mb-3 leading-snug">{v.title}</div>
              <div className="text-[12px] text-[var(--t4)] leading-relaxed">{v.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-10 py-20 text-center border-b border-[var(--b1)] relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(91,141,245,0.07) 0%, transparent 70%)',
          }}
        />
        <p className="text-[10px] text-accent uppercase tracking-[0.14em] mb-4">Get started</p>
        <h2 className="text-[28px] font-black tracking-[-0.8px] text-[var(--t1)] mb-3 leading-tight">
          Deadlines don&apos;t wait.
        </h2>
        <p className="text-[14px] text-[var(--t3)] mb-8 max-w-xs mx-auto leading-relaxed">
          The best placements and internships fill up fast — start tracking today.
        </p>
        <Link
          href="/opportunities"
          className="inline-flex items-center gap-2 px-7 py-3 bg-[var(--t1)] text-[#090909] text-[13px] font-semibold rounded-xl hover:bg-[#e0e0e0] transition-colors"
        >
          Browse all opportunities →
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-10 py-5 bg-[var(--bg2)] flex items-center justify-between border-t border-[var(--b1)]">
        <div className="flex items-center gap-2">
          <SCALogo size={18} />
          <span className="text-[11px] text-[var(--t4)]">Student Computing Association · Birmingham City University</span>
        </div>
        <span className="text-[11px] text-[var(--t4)]">© 2025 SCA BCU</span>
      </footer>
    </div>
  )
}
