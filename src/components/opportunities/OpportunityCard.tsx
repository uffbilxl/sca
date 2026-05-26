import Link from 'next/link'
import { Opportunity } from '@/types'
import { formatDeadline, deadlineStatus, opportunityTypeLabel, opportunityTypeBadgeClass, workModeLabel } from '@/lib/utils'
import { CompanyLogo } from '@/components/ui/CompanyLogo'

interface OpportunityCardProps {
  opportunity: Opportunity
  showFeaturedBadge?: boolean
}

export function OpportunityCard({ opportunity: opp, showFeaturedBadge }: OpportunityCardProps) {
  const ds = deadlineStatus(opp.deadline)

  return (
    <Link
      href={`/opportunities/${opp.slug}`}
      className="bg-[var(--bg2)] p-5 hover:bg-[var(--bg3)] transition-colors group block relative"
    >
      {/* Featured ribbon */}
      {showFeaturedBadge && (
        <div className="absolute top-0 right-0 flex items-center gap-1 px-2.5 py-1 bg-accent/10 border-b border-l border-accent/25 rounded-bl-lg rounded-tr-none text-[10px] font-semibold text-accent tracking-wide">
          Featured
        </div>
      )}

      {/* Top row */}
      <div className={`flex items-start justify-between mb-3 ${showFeaturedBadge ? 'mt-5' : ''}`}>
        <CompanyLogo name={opp.company.name} logoUrl={opp.company.logo} size={36} />
        {!showFeaturedBadge && (
          <div className="flex gap-1.5 flex-wrap justify-end">
            {opp.createdAt > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) && (
              <span className="badge-blue">New</span>
            )}
            {ds === 'open' && <span className="badge-green">Open</span>}
            {ds === 'closing' && <span className="badge-amber">Closing soon</span>}
            {ds === 'closed' && <span className="badge-red">Closed</span>}
          </div>
        )}
      </div>

      <div className="text-[11px] text-[var(--t4)] mb-1">{opp.company.name}</div>
      <div className="text-[14px] font-medium text-[var(--t1)] leading-snug mb-2 group-hover:text-white transition-colors">
        {opp.title}
      </div>

      <div className="flex gap-2.5 mb-2.5">
        <span className="text-[11px] text-[var(--t4)] flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="4" r="2.5" stroke="currentColor" strokeWidth="1"/><path d="M5 10C5 10 1.5 6.8 1.5 4a3.5 3.5 0 117 0C8.5 6.8 5 10 5 10z" stroke="currentColor" strokeWidth="1"/></svg>
          {opp.location}
        </span>
        <span className="text-[11px] text-[var(--t4)]">{workModeLabel(opp.workMode)}</span>
      </div>

      <div className="flex gap-1 flex-wrap mb-3">
        <span className={opportunityTypeBadgeClass(opp.type)}>{opportunityTypeLabel(opp.type)}</span>
        {opp.tags.slice(0, 3).map(({ tag }) => (
          <span key={tag.id} className="tag">{tag.name}</span>
        ))}
        {opp.tags.length > 3 && (
          <span className="tag">+{opp.tags.length - 3}</span>
        )}
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-[var(--b1)]">
        <div className="text-[11px] text-[var(--t4)]">
          {opp.deadline
            ? <>Closes <span className="text-amber-400">{formatDeadline(opp.deadline)}</span></>
            : 'Rolling deadline'}
        </div>
        <span className="px-3 py-1 bg-transparent border border-[var(--b2)] rounded text-[11px] font-medium text-[var(--t3)] group-hover:bg-accent group-hover:border-accent group-hover:text-white transition-all">
          Apply
        </span>
      </div>
    </Link>
  )
}
