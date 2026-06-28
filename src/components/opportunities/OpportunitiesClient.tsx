'use client'
import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Opportunity, OpportunityType, WorkMode } from '@/types'
import { formatDeadline, deadlineStatus, opportunityTypeLabel, opportunityTypeBadgeClass, workModeLabel, formatSalary } from '@/lib/utils'
import { CompanyLogo } from '@/components/ui/CompanyLogo'
import { lookupPostcode, locationCoordsWithinRadius } from '@/lib/geo'

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

interface Props {
  opportunities: Opportunity[]
  initialType?: OpportunityType
}

export function OpportunitiesClient({ opportunities, initialType }: Props) {
  const [types, setTypes] = useState<OpportunityType[]>(initialType ? [initialType] : [])
  const [modes, setModes] = useState<WorkMode[]>([])
  const [sponsored, setSponsored] = useState(false)
  const [salaryMin, setSalaryMin] = useState(0)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'newest' | 'deadline' | 'salary' | 'az'>('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [postcode, setPostcode] = useState('')
  const [radius, setRadius] = useState(25)
  const [postcodeCoords, setPostcodeCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [postcodeState, setPostcodeState] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const trimmed = postcode.trim()
    if (trimmed.length < 5) {
      setPostcodeCoords(null)
      setPostcodeState('idle')
      return
    }
    setPostcodeState('loading')
    debounceRef.current = setTimeout(async () => {
      const result = await lookupPostcode(trimmed)
      if (result) {
        setPostcodeCoords(result)
        setPostcodeState('ok')
      } else {
        setPostcodeCoords(null)
        setPostcodeState('error')
      }
    }, 600)
  }, [postcode])

  function toggleType(t: OpportunityType) {
    setTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }
  function toggleMode(m: WorkMode) {
    setModes(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  }
  function clearAll() {
    setTypes([]); setModes([]); setSponsored(false); setSalaryMin(0); setSearch('')
    setPostcode(''); setPostcodeCoords(null); setPostcodeState('idle'); setRadius(25)
  }

  const activeFilterCount = types.length + modes.length + (sponsored ? 1 : 0) + (salaryMin > 0 ? 1 : 0) + (postcodeCoords ? 1 : 0)

  const filtered = useMemo(() => {
    let list = [...opportunities]
    if (types.length) list = list.filter(o => types.includes(o.type))
    if (modes.length) list = list.filter(o => modes.includes(o.workMode))
    if (sponsored) list = list.filter(o => o.sponsored)
    if (salaryMin > 0) list = list.filter(o => (o.salaryMin ?? 0) >= salaryMin || (o.salaryMax ?? 0) >= salaryMin)
    if (postcodeCoords) {
      const radiusKm = radius * 1.60934
      list = list.filter(o => locationCoordsWithinRadius(o.location, postcodeCoords.lat, postcodeCoords.lng, radiusKm))
    }
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
  }, [opportunities, types, modes, sponsored, salaryMin, postcodeCoords, radius, search, sort])

  const filterPanel = (
    <div className="flex flex-col h-full">
      <div className="text-[10px] font-mono font-medium text-[var(--t4)] uppercase tracking-widest pb-3 border-b border-[var(--b1)] mb-4">// filters</div>

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
            <label key={t.value} className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-[var(--bg3)] transition-colors">
              <input
                type="checkbox"
                checked={types.includes(t.value)}
                onChange={() => toggleType(t.value)}
                className="accent-[var(--t1)] w-3 h-3"
              />
              <span className="text-[12px] text-[var(--t2)] flex-1">{t.label}</span>
              <span className="text-[10px] font-mono text-[var(--t4)]">
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
            <label key={m.value} className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-[var(--bg3)] transition-colors">
              <input
                type="checkbox"
                checked={modes.includes(m.value)}
                onChange={() => toggleMode(m.value)}
                className="accent-[var(--t1)] w-3 h-3"
              />
              <span className="text-[12px] text-[var(--t2)]">{m.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sponsorship */}
      <div className="mb-4">
        <label className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-[var(--bg3)] transition-colors">
          <input
            type="checkbox"
            checked={sponsored}
            onChange={e => setSponsored(e.target.checked)}
            className="accent-[var(--t1)] w-3 h-3"
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
          className="w-full accent-[var(--t1)]"
        />
        <div className="flex justify-between text-[10px] font-mono text-[var(--t4)] mt-1">
          <span>£0</span><span>£60k+</span>
        </div>
      </div>

      {/* Postcode proximity */}
      <div className="mb-4">
        <label className="label">Near postcode</label>
        <div className="relative">
          <input
            type="text"
            value={postcode}
            onChange={e => setPostcode(e.target.value)}
            placeholder="e.g. B1 1AA"
            className="input text-[12px] pr-7"
            maxLength={8}
          />
          {postcodeState === 'loading' && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[var(--t4)]">...</span>
          )}
          {postcodeState === 'ok' && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-green-700">✓</span>
          )}
          {postcodeState === 'error' && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-red-700">✕</span>
          )}
        </div>
        {postcodeState === 'error' && (
          <p className="text-[10px] font-mono text-red-700 mt-1">Postcode not found</p>
        )}
        {postcodeCoords && (
          <div className="mt-3">
            <label className="label">Radius: {radius} miles</label>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={radius}
              onChange={e => setRadius(Number(e.target.value))}
              className="w-full accent-[var(--t1)]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[var(--t4)] mt-1">
              <span>5 mi</span><span>100 mi</span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={clearAll}
        className="w-full py-1.5 text-[11px] font-mono text-[var(--t3)] border border-[var(--b1)] hover:border-[var(--t1)] hover:text-[var(--t1)] transition-colors"
      >
        Clear all filters
      </button>
    </div>
  )

  const totalOpen = opportunities.length
  const companies = new Set(opportunities.map(o => o.company.name)).size
  const internships = opportunities.filter(o => o.type === 'INTERNSHIP').length
  const graduates = opportunities.filter(o => o.type === 'GRADUATE').length
  const placements = opportunities.filter(o => o.type === 'PLACEMENT').length

  const tickerItems = [
    { text: `We aim to provide as many opportunities as possible, but we will not promote defence companies — BCUSCA`, highlight: true },
    { text: `${totalOpen} opportunities currently open` },
    { text: `Roles from ${companies} companies across the UK` },
    { text: `${internships} internships · ${placements} placements · ${graduates} graduate roles` },
    { text: `Updated regularly with the latest UK tech opportunities` },
  ]
  const sep = <span className="text-[var(--b2)] mx-6">◆</span>

  return (
    <div className="flex flex-col min-h-screen">
      {/* Disclaimer ticker */}
      <div className="w-full overflow-hidden border-b border-[var(--b1)] bg-[var(--bg2)] py-2">
        <div className="ticker-track flex w-max">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className={`flex items-center whitespace-nowrap text-[11px] font-mono font-medium ${item.highlight ? 'text-amber-700' : 'text-[var(--t3)]'}`}>
              {sep}{item.text}
            </span>
          ))}
        </div>
      </div>

      {/* Mini stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-[var(--b1)] bg-[var(--bg2)]">
        {[
          { n: totalOpen, l: 'Opportunities' },
          { n: internships, l: 'Internships' },
          { n: graduates, l: 'Graduate Roles' },
          { n: companies, l: 'Companies' },
        ].map((s, i) => (
          <div key={i} className={`py-4 text-center ${i < 3 ? 'border-r border-[var(--b1)]' : ''} ${i < 2 ? 'border-b sm:border-b-0 border-[var(--b1)]' : ''}`}>
            <div className="font-display text-[20px] font-black text-[var(--t1)] tabular-nums">{s.n}</div>
            <div className="text-[9px] font-mono text-[var(--t4)] uppercase tracking-[0.12em] mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-[240px] flex-shrink-0 border-r border-[var(--b1)] bg-[var(--bg2)] p-5 sticky top-[52px] self-start max-h-[calc(100vh-52px)] overflow-y-auto">
          {filterPanel}
        </aside>

        {/* Mobile filter drawer */}
        {showFilters && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div className="flex-1 bg-[var(--t1)]/40" onClick={() => setShowFilters(false)} />
            <div className="w-[290px] bg-[var(--bg)] border-l border-[var(--b1)] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--b1)] flex-shrink-0">
                <span className="text-[13px] font-semibold text-[var(--t1)]">Filters</span>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-[var(--t3)] hover:text-[var(--t1)] transition-colors text-[16px] leading-none"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {filterPanel}
              </div>
              <div className="p-4 border-t border-[var(--b1)] flex-shrink-0">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full py-2.5 bg-[var(--t1)] text-[var(--bg)] text-[13px] font-medium hover:opacity-80 transition-opacity"
                >
                  Show {filtered.length} results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 p-4 md:p-6 min-w-0">
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-center gap-2">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters(true)}
                className="md:hidden flex items-center gap-2 px-3 py-1.5 border border-[var(--b1)] text-[12px] text-[var(--t2)] hover:border-[var(--t1)] transition-colors"
              >
                <svg width="13" height="11" viewBox="0 0 13 11" fill="none">
                  <path d="M1 1h11M3 5.5h7M5 10h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 bg-[var(--t1)] text-[var(--bg)] text-[9px] font-mono flex items-center justify-center leading-none">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <span className="text-[12px] text-[var(--t3)]">
                <strong className="text-[var(--t1)] font-semibold">{filtered.length}</strong> opportunities
              </span>
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as any)}
              className="bg-[var(--bg2)] border border-[var(--b1)] px-2.5 sm:px-3 py-1.5 text-[11px] font-mono text-[var(--t2)] outline-none flex-shrink-0 focus:border-[var(--t1)]"
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
              <div className="font-display text-[14px] font-medium text-[var(--t2)] mb-1">No opportunities found</div>
              <div className="text-[12px] font-mono">Try adjusting your filters</div>
            </div>
          ) : (
            <div className="flex flex-col gap-px border border-[var(--b1)] overflow-hidden">
              {filtered.map(opp => (
                <OpportunityRow key={opp.id} opp={opp} />
              ))}
            </div>
          )}
        </div>
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
      className="bg-[var(--bg)] px-4 sm:px-5 py-4 flex items-center gap-3 sm:gap-4 border-b border-[var(--b1)] last:border-b-0 hover:bg-[var(--bg2)] transition-colors group"
    >
      <CompanyLogo name={opp.company.name} logoUrl={opp.company.logo} size={40} />

      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-mono text-[var(--t4)] mb-0.5 truncate">{opp.company.name} · {opp.location}</div>
        <div className="text-[13px] font-medium text-[var(--t1)] mb-1.5 group-hover:underline group-hover:decoration-[var(--t1)] truncate">{opp.title}</div>
        <div className="flex gap-1.5 flex-wrap">
          {isNew && <span className="badge-blue">New</span>}
          <span className={opportunityTypeBadgeClass(opp.type)}>{opportunityTypeLabel(opp.type)}</span>
          <span className="hidden sm:inline badge-white">{workModeLabel(opp.workMode)}</span>
          {opp.tags.slice(0, 2).map(({ tag }) => (
            <span key={tag.id} className="tag">{tag.name}</span>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        {(opp.salary || opp.salaryMin || opp.salaryMax) && (
          <span className="text-[13px] font-medium text-[var(--t1)] hidden sm:block">
            {formatSalary(opp.salaryMin, opp.salaryMax, opp.salary)}
          </span>
        )}
        <span className="text-[11px] font-mono text-[var(--t4)] hidden sm:block">
          {opp.deadline ? `Closes ${formatDeadline(opp.deadline)}` : 'Rolling'}
        </span>
        {ds === 'open' && <span className="badge-green">Open</span>}
        {ds === 'closing' && <span className="badge-amber">Closing</span>}
        {ds === 'closed' && <span className="badge-red">Closed</span>}
      </div>
    </Link>
  )
}
