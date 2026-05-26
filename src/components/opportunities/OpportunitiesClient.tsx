'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Opportunity, OpportunityType, WorkMode } from '@/types'
import { formatDeadline, deadlineStatus, opportunityTypeLabel, workModeLabel, formatSalary } from '@/lib/utils'
import { CompanyLogo } from '@/components/ui/CompanyLogo'

const TYPES: { value: OpportunityType; label: string }[] = [
  { value: 'INTERNSHIP', label: 'Internship' },
  { value: 'PLACEMENT', label: 'Placement' },
  { value: 'GRADUATE', label: 'Graduate' },
  { value: 'SPRING_WEEK', label: 'Spring Week' },
  { value: 'INSIGHT', label: 'Insight' },
]
const MODES: { value: WorkMode; label: string }[] = [
  { value: 'REMOTE', label: 'Remote' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'ONSITE', label: 'On-site' },
]

interface Props { opportunities: Opportunity[] }

export function OpportunitiesClient({ opportunities }: Props) {
  const [types, setTypes] = useState<OpportunityType[]>([])
  const [modes, setModes] = useState<WorkMode[]>([])
  const [sponsored, setSponsored] = useState(false)
  const [salaryMin, setSalaryMin] = useState(0)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'newest' | 'deadline' | 'salary' | 'az'>('newest')

  function toggleType(t: OpportunityType) {
    setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }
  function toggleMode(m: WorkMode) {
    setModes(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  }
  function clearAll() {
    setTypes([]); setModes([]); setSponsored(false); setSalaryMin(0); setSearch('')
  }

  const filtered = useMemo(() => {
    let list = [...opportunities]
    if (types.length) list = list.filter(o => types.includes(o.type))
    if (modes.length) list = list.filter(o => modes.includes(o.workMode))
    if (sponsored) list = list.filter(o => o.sponsored)
    if (salaryMin > 0) list = list.filter(o => (o.salaryMin ?? 0) >= salaryMin || (o.salaryMax ?? 0) >= salaryMin)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(o =>
        o.title.toLowerCase().includes(q) ||
        o.company.name.toLowerCase().includes(q) ||
        o.location.toLowerCase().includes(q) ||
        o.tags.some(({ tag }) => tag.name.toLowerCase().includes(q))
      )
    }
    if (sort === 'newest') list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    if (sort === 'deadline') list.sort((a, b) => {
      if (!a.deadline) return 1; if (!b.deadline) return -1
      return +new Date(a.deadline) - +new Date(b.deadline)
    })
    if (sort === 'salary') list.sort((a, b) => (b.salaryMin ?? b.salaryMax ?? 0) - (a.salaryMin ?? a.salaryMax ?? 0))
    if (sort === 'az') list.sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [opportunities, types, modes, sponsored, salaryMin, search, sort])

  return (
    <div className="flex min-h-screen">
      {/* Filters sidebar */}
      <aside className="w-[240px] flex-shrink-0 border-r border-[var(--b1)] bg-[var(--bg2)] p-5 sticky top-[52px] self-start max-h-[calc(100vh-52px)] overflow-y-auto">
        <div className="text-[10px] font-semibold text-[var(--t4)] uppercase tracking-widest pb-3 border-b border-[var(--b1)] mb-4">Filters</div>

        {/* Search */}
        <div className="mb-4">
          <label className="label">Search</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Role, company, skill…"
            className="input text-[12px]"
          />
        </div>

        {/* Type */}
        <div className="mb-4">
          <label className="label">Type</label>
          <div className="flex flex-col gap-0.5">
            {TYPES.map(t => (
              <label key={t.value} className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-[var(--bg3)] transition-colors">
                <input
                  type="checkbox"
                  checked={types.includes(t.value)}
                  onChange={() => toggleType(t.value)}
                  className="accent-accent w-3 h-3"
                />
                <span className="text-[12px] text-[var(--t2)] flex-1">{t.label}</span>
                <span className="text-[10px] text-[var(--t4)]">
                  {opportunities.filter(o => o.type === t.value).length}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Work mode */}
        <div className="mb-4">
          <label className="label">Work mode</label>
          <div className="flex flex-col gap-0.5">
            {MODES.map(m => (
              <label key={m.value} className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-[var(--bg3)] transition-colors">
                <input
                  type="checkbox"
                  checked={modes.includes(m.value)}
                  onChange={() => toggleMode(m.value)}
                  className="accent-accent w-3 h-3"
                />
                <span className="text-[12px] text-[var(--t2)]">{m.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sponsorship */}
        <div className="mb-4">
          <label className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-[var(--bg3)] transition-colors">
            <input
              type="checkbox"
              checked={sponsored}
              onChange={e => setSponsored(e.target.checked)}
              className="accent-accent w-3 h-3"
            />
            <span className="text-[12px] text-[var(--t2)]">Visa sponsored only</span>
          </label>
        </div>

        {/* Salary */}
        <div className="mb-5">
          <label className="label">Min salary: {salaryMin > 0 ? `£${salaryMin.toLocaleString()}` : 'Any'}</label>
          <input
            type="range"
            min={0}
            max={60000}
            step={1000}
            value={salaryMin}
            onChange={e => setSalaryMin(Number(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-[10px] text-[var(--t4)] mt-1">
            <span>£0</span><span>£60k+</span>
          </div>
        </div>

        <button
          onClick={clearAll}
          className="w-full py-1.5 text-[11px] text-[var(--t3)] border border-[var(--b2)] rounded-md hover:border-[var(--b3)] hover:text-[var(--t2)] transition-colors"
        >
          Clear all filters
        </button>
      </aside>

      {/* List */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[12px] text-[var(--t3)]">
            <strong className="text-[var(--t1)]">{filtered.length}</strong> opportunities
          </span>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as any)}
            className="bg-[var(--bg3)] border border-[var(--b2)] rounded-md px-3 py-1.5 text-[11px] text-[var(--t2)] outline-none"
          >
            <option value="newest">Newest first</option>
            <option value="deadline">Deadline soonest</option>
            <option value="salary">Highest salary</option>
            <option value="az">A–Z</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-[var(--t4)]">
            <div className="text-[32px] mb-3">◎</div>
            <div className="text-[14px] font-medium text-[var(--t2)] mb-1">No opportunities found</div>
            <div className="text-[12px]">Try adjusting your filters</div>
          </div>
        ) : (
          <div className="flex flex-col gap-px border border-[var(--b1)] rounded-xl overflow-hidden">
            {filtered.map(opp => (
              <OpportunityRow key={opp.id} opp={opp} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function OpportunityRow({ opp }: { opp: Opportunity }) {
  const ds = deadlineStatus(opp.deadline)
  const isNew = opp.createdAt > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

  return (
    <Link
      href={`/opportunities/${opp.slug}`}
      className="bg-[var(--bg2)] px-5 py-4 flex items-center gap-4 border-b border-[var(--b1)] last:border-b-0 hover:bg-[var(--bg3)] transition-colors group"
    >
      <CompanyLogo name={opp.company.name} logoUrl={opp.company.logo} size={40} />

      <div className="flex-1 min-w-0">
        <div className="text-[11px] text-[var(--t4)] mb-0.5">{opp.company.name} · {opp.location}</div>
        <div className="text-[13px] font-medium text-[var(--t1)] mb-1.5 group-hover:text-white transition-colors truncate">{opp.title}</div>
        <div className="flex gap-1.5 flex-wrap">
          {isNew && <span className="badge-blue">New</span>}
          <span className="badge-gray">{opportunityTypeLabel(opp.type)}</span>
          <span className="badge-gray">{workModeLabel(opp.workMode)}</span>
          {opp.tags.slice(0, 3).map(({ tag }) => (
            <span key={tag.id} className="tag">{tag.name}</span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        {(opp.salary || opp.salaryMin || opp.salaryMax) && (
          <span className="text-[13px] font-medium text-accent">
            {formatSalary(opp.salaryMin, opp.salaryMax, opp.salary)}
          </span>
        )}
        <span className="text-[11px] text-[var(--t4)]">
          {opp.deadline ? `Closes ${formatDeadline(opp.deadline)}` : 'Rolling'}
        </span>
        {ds === 'open' && <span className="badge-green">Open</span>}
        {ds === 'closing' && <span className="badge-amber">Closing</span>}
        {ds === 'closed' && <span className="badge-red">Closed</span>}
      </div>
    </Link>
  )
}
