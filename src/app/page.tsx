export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { OpportunityCard } from '@/components/opportunities/OpportunityCard'
import { SCALogo } from '@/components/ui/SCALogo'
import { TickerBanner } from '@/components/home/TickerBanner'
import { HeroContent } from '@/components/home/HeroContent'
import { FadeIn } from '@/components/ui/FadeIn'

async function getHomeData() {
  const types = ['INTERNSHIP', 'PLACEMENT', 'GRADUATE', 'SPRING_WEEK'] as const
  const allFeatured = await prisma.opportunity.findMany({
    where: { featured: true, status: { not: 'CLOSED' } },
    include: { company: true, tags: { include: { tag: true } }, _count: { select: { comments: true } } },
    orderBy: { createdAt: 'desc' },
  })
  const perType = types.map(t => allFeatured.filter(o => o.type === t).slice(0, 2))
  const first = perType.map(arr => arr[0]).filter(Boolean)
  const second = perType.map(arr => arr[1]).filter(Boolean)
  const featured = [...first, ...second].slice(0, 6)
  return { featured }
}

const strands = [
  { label: 'Opportunities', desc: 'Internships, placements & graduate roles', href: '/opportunities' },
  { label: 'Events', desc: 'Workshops, panels & networking nights', href: '/events' },
  { label: 'Resources', desc: 'CV templates, cover letters & guides', href: '/resources' },
  { label: 'Graduate Roles', desc: 'Life after university starts here', href: '/opportunities?type=GRADUATE' },
  { label: 'Spring Weeks', desc: 'First & second year programmes', href: '/opportunities?type=SPRING_WEEK' },
  { label: 'Meet the Committee', desc: 'The people behind the SCA', href: '/committee' },
]

const whyItems = [
  {
    title: 'Opportunities curated for you',
    text: 'Internships, placements, grad schemes and spring weeks - filtered for BCU computing students. No noise, no irrelevant listings.',
  },
  {
    title: 'Events & community',
    text: 'Industry panels, workshops, hackathons and networking events. Build connections and skills alongside your degree.',
  },
  {
    title: 'Career support from day one',
    text: 'CV templates, cover letter guides, and peer insights from BCU students who have already landed the role.',
  },
]

export default async function HomePage() {
  const { featured } = await getHomeData()

  return (
    <div className="min-h-screen">
      <TickerBanner />

      <HeroContent />

      {/* Featured */}
      <section className="px-5 sm:px-10 py-10 sm:py-14 border-b border-[var(--b1)]">
        <FadeIn>
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="text-[10px] text-accent uppercase tracking-[0.14em] mb-1">Handpicked</p>
              <h2 className="text-[16px] font-semibold text-[var(--t1)]">Featured opportunities</h2>
            </div>
            <Link href="/opportunities" className="text-[12px] text-[var(--t3)] hover:text-accent transition-colors flex items-center gap-1">
              View all <span>→</span>
            </Link>
          </div>
        </FadeIn>
        {featured.length > 0 ? (
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--b1)] border border-[var(--b1)] rounded-xl overflow-hidden">
              {featured.map(opp => (
                <OpportunityCard key={opp.id} opportunity={opp as any} showFeaturedBadge />
              ))}
            </div>
          </FadeIn>
        ) : (
          <FadeIn delay={0.1}>
            <div className="border border-[var(--b1)] rounded-xl bg-[var(--bg2)] py-16 text-center">
              <p className="text-[13px] text-[var(--t4)]">No featured opportunities yet.</p>
              <p className="text-[12px] text-[var(--t4)] mt-1">Add some from the admin panel.</p>
            </div>
          </FadeIn>
        )}
      </section>

      {/* Strands */}
      <section className="px-5 sm:px-10 py-10 sm:py-14 border-b border-[var(--b1)]">
        <FadeIn>
          <div className="mb-8">
            <p className="text-[10px] text-accent uppercase tracking-[0.14em] mb-1">Everything we offer</p>
            <h2 className="text-[16px] font-semibold text-[var(--t1)]">Where do you want to start?</h2>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {strands.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.07}>
              <Link
                href={s.href}
                className="group bg-[var(--bg2)] border border-[var(--b1)] rounded-xl px-5 py-5 flex items-center justify-between hover:border-accent/40 hover:bg-[var(--bg3)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(91,141,245,0.12)] transition-all duration-200"
              >
                <div>
                  <div className="text-[13px] font-semibold text-[var(--t1)] group-hover:text-white transition-colors mb-1">{s.label}</div>
                  <div className="text-[11px] text-[var(--t4)]">{s.desc}</div>
                </div>
                <span className="text-[var(--t4)] group-hover:text-accent group-hover:translate-x-1 transition-all duration-200 text-[16px] flex-shrink-0 ml-4">→</span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="px-5 sm:px-10 py-10 sm:py-14 border-b border-[var(--b1)]">
        <FadeIn>
          <div className="mb-8">
            <p className="text-[10px] text-accent uppercase tracking-[0.14em] mb-1">About</p>
            <h2 className="text-[16px] font-semibold text-[var(--t1)]">What the SCA offers</h2>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {whyItems.map((v, i) => (
            <FadeIn key={v.title} delay={i * 0.1}>
              <div className="bg-[var(--bg2)] border border-[var(--b1)] border-l-accent border-l-2 rounded-xl p-6 sm:p-7 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300">
                <div className="text-[10px] text-[var(--t4)] uppercase tracking-[0.14em] mb-3">0{i + 1}</div>
                <div className="text-[14px] font-semibold text-[var(--t1)] mb-3 leading-snug">{v.title}</div>
                <div className="text-[12px] text-[var(--t4)] leading-relaxed">{v.text}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 sm:px-10 py-14 sm:py-20 text-center border-b border-[var(--b1)] relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(91,141,245,0.07) 0%, transparent 70%)',
          }}
        />
        <FadeIn>
          <p className="text-[10px] text-accent uppercase tracking-[0.14em] mb-4">Join the community</p>
          <h2 className="text-[28px] font-black tracking-[-0.8px] text-[var(--t1)] mb-3 leading-tight">
            You belong here.
          </h2>
          <p className="text-[14px] text-[var(--t3)] mb-8 max-w-sm mx-auto leading-relaxed">
            Whether you&apos;re in your first year or finishing your degree, the SCA is here to support every step of your journey.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 px-7 py-3 bg-[var(--t1)] text-[#090909] text-[13px] font-semibold rounded-xl hover:bg-[#e0e0e0] hover:scale-[1.03] transition-all duration-200"
            >
              Browse opportunities →
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-7 py-3 border border-[var(--b2)] text-[var(--t2)] text-[13px] font-medium rounded-xl hover:border-[var(--b3)] hover:text-[var(--t1)] hover:scale-[1.03] transition-all duration-200"
            >
              See upcoming events
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="px-5 sm:px-10 py-5 bg-[var(--bg2)] border-t border-[var(--b1)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <SCALogo size={18} />
            <span className="text-[11px] text-[var(--t4)]">Student Computing Association · Birmingham City University</span>
          </div>
          <span className="text-[11px] text-[var(--t4)]">© 2026 SCA BCU</span>
        </div>
        <div className="border-t border-[var(--b1)] pt-3 flex flex-col sm:flex-row items-center justify-between gap-1.5">
          <span className="text-[10px] text-[var(--t4)]">Found a bug or want to report something?</span>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {[
              { name: 'Tayyeb', email: 'tayyeb.nadeemsomro@mail.bcu.ac.uk' },
              { name: 'Bilal', email: 'bilal.arshad2@mail.bcu.ac.uk' },
            ].map(c => (
              <a key={c.email} href={`mailto:${c.email}`} className="text-[10px] text-[var(--t3)] hover:text-accent transition-colors">
                {c.name} - {c.email}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
