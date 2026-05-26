import { notFound } from 'next/navigation'
import Link from 'next/link'
import { OPPORTUNITIES } from '@/data/opportunities'
import { formatDeadline, deadlineStatus, opportunityTypeLabel, opportunityTypeBadgeClass, workModeLabel, formatSalary } from '@/lib/utils'
import { CommentsSection } from '@/components/comments/CommentsSection'
import { CompanyLogo } from '@/components/ui/CompanyLogo'

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return OPPORTUNITIES.map(o => ({ slug: o.slug }))
}

export default function OpportunityDetailPage({ params }: Props) {
  const opp = OPPORTUNITIES.find(o => o.slug === params.slug)
  if (!opp) notFound()

  const related = OPPORTUNITIES.filter(o =>
    o.slug !== params.slug &&
    (o.type === opp.type || o.company.id === opp.company.id) &&
    o.status !== 'CLOSED'
  ).slice(0, 3)

  const ds = deadlineStatus(opp.deadline)

  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-8 py-5 sm:py-7">
      {/* Back */}
      <Link href="/opportunities" className="inline-flex items-center gap-1.5 text-[12px] text-[var(--t3)] hover:text-[var(--t1)] transition-colors mb-6 sm:mb-7">
        ← Back to opportunities
      </Link>

      {/* Hero */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 pb-7 border-b border-[var(--b1)] mb-7">
        <div className="flex gap-4 items-start">
          <CompanyLogo name={opp.company.name} logoUrl={opp.company.logo} size={56} />
          <div>
            <div className="text-[12px] text-[var(--t3)] mb-1">{opp.company.name} · {opp.location}</div>
            <h1 className="text-[24px] font-black tracking-[-0.5px] text-[var(--t1)] mb-3 leading-tight">{opp.title}</h1>
            <div className="flex gap-4 flex-wrap">
              {opp.startDate && <span className="text-[12px] text-[var(--t3)]">⊕ {opp.startDate}{opp.duration ? ` · ${opp.duration}` : ''}</span>}
              <span className="text-[12px] text-[var(--t3)]">{workModeLabel(opp.workMode)}</span>
              {(opp.salary || opp.salaryMin) && (
                <span className="text-[12px] text-[var(--t3)]">£ {formatSalary(opp.salaryMin, opp.salaryMax, opp.salary)}</span>
              )}
              {opp.sponsored && <span className="text-[12px] text-[var(--t3)]">✓ Visa sponsored</span>}
            </div>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col gap-2 sm:items-end flex-shrink-0">
          {opp.applyUrl ? (
            <a
              href={opp.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-accent text-white text-[13px] font-semibold rounded-xl hover:bg-accent-hover transition-colors whitespace-nowrap"
            >
              Apply now →
            </a>
          ) : (
            <button className="px-6 py-2.5 bg-accent text-white text-[13px] font-semibold rounded-xl whitespace-nowrap opacity-60 cursor-not-allowed">
              Application closed
            </button>
          )}
          <button className="px-3 py-1.5 bg-transparent border border-[var(--b2)] rounded-md text-[11px] text-[var(--t3)] hover:text-[var(--t2)] whitespace-nowrap">
            ◎ Save
          </button>
          <div className="flex gap-1.5">
            <span className={opportunityTypeBadgeClass(opp.type)}>{opportunityTypeLabel(opp.type)}</span>
            {ds === 'open' && <span className="badge-green">Open</span>}
            {ds === 'closing' && <span className="badge-amber">Closing soon</span>}
            {ds === 'closed' && <span className="badge-red">Closed</span>}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-7">
        {/* Main */}
        <div>
          <div className="mb-6">
            <h3 className="section-title mb-3">About the role</h3>
            <p className="text-[13px] text-[var(--t2)] leading-relaxed whitespace-pre-line">{opp.description}</p>
          </div>

          {opp.responsibilities && (
            <div className="mb-6">
              <h3 className="section-title mb-3">What you&apos;ll do</h3>
              <ul className="flex flex-col gap-1.5">
                {opp.responsibilities.split('\n').filter(Boolean).map((line, i) => (
                  <li key={i} className="text-[12px] text-[var(--t2)] pl-3.5 relative leading-relaxed before:content-['-'] before:absolute before:left-0 before:text-[var(--t4)]">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {opp.requirements && (
            <div className="mb-6">
              <h3 className="section-title mb-3">What they&apos;re looking for</h3>
              <ul className="flex flex-col gap-1.5">
                {opp.requirements.split('\n').filter(Boolean).map((line, i) => (
                  <li key={i} className="text-[12px] text-[var(--t2)] pl-3.5 relative leading-relaxed before:content-['-'] before:absolute before:left-0 before:text-[var(--t4)]">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {opp.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="section-title mb-3">Tech stack</h3>
              <div className="flex gap-1.5 flex-wrap">
                {opp.tags.map(({ tag }) => (
                  <span key={tag.id} className="px-2.5 py-1 bg-[var(--bg4)] border border-[var(--b1)] rounded text-[12px] text-[var(--t3)]">{tag.name}</span>
                ))}
              </div>
            </div>
          )}

          <CommentsSection opportunityId={opp.id} initialComments={[]} />
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-3">
          {/* Overview */}
          <div className="bg-[var(--bg2)] border border-[var(--b1)] rounded-xl p-4">
            <div className="section-title mb-3">Overview</div>
            <div className="flex flex-col">
              {(([
                ['Type', opportunityTypeLabel(opp.type)],
                opp.duration ? ['Duration', opp.duration] : null,
                opp.startDate ? ['Start', opp.startDate] : null,
                ['Location', opp.location],
                (opp.salary || opp.salaryMin) ? ['Salary', formatSalary(opp.salaryMin, opp.salaryMax, opp.salary)] : null,
                opp.deadline ? ['Deadline', formatDeadline(opp.deadline)] : null,
                ['Visa', opp.sponsored ? 'Sponsored ✓' : 'Not sponsored'],
              ] as ([string, string] | null)[]).filter((x): x is [string, string] => x !== null).map(([k, v], i, arr) => (
                <div key={k as string} className={`flex justify-between items-center py-2 ${i < arr.length - 1 ? 'border-b border-[var(--b1)]' : ''}`}>
                  <span className="text-[11px] text-[var(--t4)]">{k}</span>
                  <span className={`text-[11px] font-medium ${k === 'Salary' ? 'text-accent' : k === 'Deadline' && ds === 'closing' ? 'text-amber-400' : 'text-[var(--t1)]'}`}>{v}</span>
                </div>
              )))}
            </div>
          </div>

          {/* About company */}
          {opp.company.description && (
            <div className="bg-[var(--bg2)] border border-[var(--b1)] rounded-xl p-4">
              <div className="section-title mb-3">About {opp.company.name}</div>
              <p className="text-[11px] text-[var(--t4)] leading-relaxed">{opp.company.description}</p>
              {opp.company.website && (
                <a href={opp.company.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-accent mt-2 hover:underline">
                  Website →
                </a>
              )}
            </div>
          )}

          {/* Related */}
          {related.length > 0 && (
            <div className="bg-[var(--bg2)] border border-[var(--b1)] rounded-xl p-4">
              <div className="section-title mb-3">Related roles</div>
              <div className="flex flex-col gap-2">
                {related.map(r => (
                  <Link key={r.id} href={`/opportunities/${r.slug}`} className="p-2 rounded-md bg-[var(--bg3)] hover:bg-[var(--bg4)] transition-colors">
                    <div className="text-[12px] font-medium text-[var(--t1)]">{r.company.name} · {r.title}</div>
                    <div className="text-[10px] text-[var(--t4)] mt-0.5">{r.location}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
