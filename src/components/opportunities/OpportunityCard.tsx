import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import { Opportunity } from '@/types'
import {
  formatDeadline,
  deadlineStatus,
  opportunityTypeLabel,
  opportunityTypeBadgeClass,
  workModeLabel,
} from '@/lib/utils'
import { CompanyLogo } from '@/components/ui/CompanyLogo'

interface OpportunityCardProps {
  opportunity: Opportunity
  showFeaturedBadge?: boolean
}

export function OpportunityCard({ opportunity: opp, showFeaturedBadge }: OpportunityCardProps) {
  const ds    = deadlineStatus(opp.deadline)
  const isNew = opp.createdAt > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

  return (
    <Link
      href={`/opportunities/${opp.slug}`}
      className="group relative flex flex-col rounded-2xl p-5 border border-[rgba(var(--hairline-rgb),0.07)] hover:border-[rgba(99,102,241,0.3)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)] transition-all duration-300 focus-ring"
      style={{
        background: 'var(--card-gradient)',
        transitionTimingFunction: 'cubic-bezier(0.25,0.46,0.45,0.94)',
      }}
    >
      {/* Featured badge */}
      {showFeaturedBadge && (
        <div
          className="absolute top-4 right-4 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-widest"
          style={{
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.2)',
            color: 'var(--color-accent)',
          }}
        >
          Featured
        </div>
      )}

      {/* Logo + status */}
      <div className={`flex items-start justify-between mb-4 ${showFeaturedBadge ? 'mt-1' : ''}`}>
        <CompanyLogo name={opp.company.name} logoUrl={opp.company.logo} size={36} />
        {!showFeaturedBadge && (
          <div className="flex gap-1.5 flex-wrap justify-end">
            {isNew && <span className="badge-blue">New</span>}
            {ds === 'open'    && <span className="badge-green">Open</span>}
            {ds === 'closing' && <span className="badge-amber">Closing soon</span>}
            {ds === 'closed'  && <span className="badge-red">Closed</span>}
          </div>
        )}
      </div>

      {/* Company */}
      <div
        className="mb-1"
        style={{ fontSize: '0.6875rem', color: 'var(--color-muted-2)', letterSpacing: '0.03em' }}
      >
        {opp.company.name}
      </div>

      {/* Title */}
      <div
        className="font-semibold leading-snug mb-3 flex-1"
        style={{
          fontSize: '0.9375rem',
          color: 'var(--color-text)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif',
        }}
      >
        {opp.title}
      </div>

      {/* Location + work mode */}
      <div className="flex items-center gap-3 mb-3">
        <span
          className="flex items-center gap-1"
          style={{ fontSize: '0.6875rem', color: 'var(--color-muted)' }}
        >
          <MapPin size={10} aria-hidden="true" />
          {opp.location}
        </span>
        <span style={{ fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
          {workModeLabel(opp.workMode)}
        </span>
      </div>

      {/* Tags */}
      <div className="flex gap-1.5 flex-wrap mb-4">
        <span className={opportunityTypeBadgeClass(opp.type)}>
          {opportunityTypeLabel(opp.type)}
        </span>
        {opp.tags.slice(0, 3).map(({ tag }) => (
          <span key={tag.id} className="tag">{tag.name}</span>
        ))}
        {opp.tags.length > 3 && (
          <span className="tag">+{opp.tags.length - 3}</span>
        )}
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-3 mt-auto"
        style={{ borderTop: '1px solid var(--color-border-subtle)' }}
      >
        <div style={{ fontSize: '0.6875rem', color: 'var(--color-muted)' }}>
          {opp.deadline
            ? <>Closes <span style={{ color: '#f59e0b' }}>{formatDeadline(opp.deadline)}</span></>
            : 'Rolling deadline'}
        </div>
        <span
          className="flex items-center gap-1 font-medium group-hover:gap-1.5 transition-all duration-200"
          style={{ fontSize: '0.6875rem', color: 'var(--color-accent)' }}
        >
          Apply <ArrowRight size={11} aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
