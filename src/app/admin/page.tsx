export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDeadline, opportunityTypeLabel, deadlineStatus } from '@/lib/utils'

async function getAdminData() {
  const [oppCount, activeCount, pendingComments, eventCount, recentOpps, pendingCommentList] = await Promise.all([
    prisma.opportunity.count(),
    prisma.opportunity.count({ where: { status: { in: ['OPEN', 'CLOSING_SOON'] } } }),
    prisma.comment.count({ where: { approved: false } }),
    prisma.event.count({ where: { date: { gte: new Date() } } }),
    prisma.opportunity.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { company: true } }),
    prisma.comment.findMany({ where: { approved: false }, take: 5, include: { opportunity: { select: { title: true, slug: true } } }, orderBy: { createdAt: 'desc' } }),
  ])
  return { oppCount, activeCount, pendingComments, eventCount, recentOpps, pendingCommentList }
}

export default async function AdminDashboard() {
  const d = await getAdminData()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-[20px] font-black tracking-[-0.4px] text-[var(--t1)]">Dashboard</h1>
        <p className="text-[11px] text-[var(--t4)] mt-1">SCA Opportunities Tracker · Admin Panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { n: d.oppCount, l: 'Total opportunities', delta: null },
          { n: d.activeCount, l: 'Active listings', delta: null },
          { n: d.pendingComments, l: 'Pending comments', delta: d.pendingComments > 0 ? 'Needs review' : null, warn: d.pendingComments > 0 },
          { n: d.eventCount, l: 'Upcoming events', delta: null },
        ].map((s, i) => (
          <div key={i} className="bg-[var(--bg2)] border border-[var(--b1)] rounded-xl p-4">
            <div className="text-[26px] font-bold text-[var(--t1)] tracking-tight">{s.n}</div>
            <div className="text-[10px] text-[var(--t4)] uppercase tracking-widest mt-1">{s.l}</div>
            {s.delta && (
              <div className={`text-[10px] mt-1.5 ${s.warn ? 'text-amber-400' : 'text-green-400'}`}>{s.delta}</div>
            )}
          </div>
        ))}
      </div>

      {/* Recent opps */}
      <div className="bg-[var(--bg2)] border border-[var(--b1)] rounded-xl overflow-hidden mb-4">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--b1)]">
          <span className="text-[12px] font-semibold text-[var(--t1)]">Recent opportunities</span>
          <Link href="/admin/opportunities" className="text-[11px] text-accent hover:underline">Manage all</Link>
        </div>
        <table className="w-full" style={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              {['Role', 'Company', 'Type', 'Deadline', 'Status', 'Actions'].map((h, i) => (
                <th key={h} className={`px-4 py-2 text-left text-[9px] font-semibold text-[var(--t4)] uppercase tracking-widest border-b border-[var(--b1)] ${i === 0 ? 'w-[34%]' : i === 4 ? 'w-[10%]' : i === 5 ? 'w-[14%]' : 'w-[14%]'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.recentOpps.map(opp => {
              const ds = deadlineStatus(opp.deadline)
              return (
                <tr key={opp.id} className="border-b border-[var(--b1)] last:border-b-0 hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="px-4 py-3 text-[12px] text-[var(--t1)] truncate">{opp.title}</td>
                  <td className="px-4 py-3 text-[11px] text-[var(--t3)] truncate">{opp.company.name}</td>
                  <td className="px-4 py-3 text-[11px] text-[var(--t3)]">{opportunityTypeLabel(opp.type)}</td>
                  <td className={`px-4 py-3 text-[11px] ${ds === 'closing' ? 'text-amber-400' : ds === 'closed' ? 'text-red-400' : 'text-[var(--t3)]'}`}>
                    {opp.deadline ? formatDeadline(opp.deadline) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] ${opp.status === 'OPEN' ? 'text-green-400' : opp.status === 'CLOSING_SOON' ? 'text-amber-400' : 'text-[var(--t4)]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${opp.status === 'OPEN' ? 'bg-green-400' : opp.status === 'CLOSING_SOON' ? 'bg-amber-400' : 'bg-[var(--t4)]'}`} />
                      {opp.status === 'OPEN' ? 'Open' : opp.status === 'CLOSING_SOON' ? 'Closing' : 'Closed'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <Link href={`/admin/opportunities/${opp.id}`} className="px-2 py-1 border border-[var(--b2)] rounded text-[10px] text-[var(--t3)] hover:bg-[var(--bg3)] transition-colors">Edit</Link>
                      <AdminDeleteBtn id={opp.id} type="opportunity" />
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pending comments */}
      {d.pendingCommentList.length > 0 && (
        <div className="bg-[var(--bg2)] border border-[var(--b1)] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--b1)]">
            <span className="text-[12px] font-semibold text-[var(--t1)]">Pending comments</span>
            <span className="text-[11px] text-[var(--t4)]">{d.pendingComments} awaiting review</span>
          </div>
          <table className="w-full" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr>
                {['Author', 'Role', 'Comment', 'Actions'].map((h, i) => (
                  <th key={h} className={`px-4 py-2 text-left text-[9px] font-semibold text-[var(--t4)] uppercase tracking-widest border-b border-[var(--b1)] ${i === 2 ? 'w-[40%]' : 'w-[20%]'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.pendingCommentList.map(c => (
                <tr key={c.id} className="border-b border-[var(--b1)] last:border-b-0 hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="px-4 py-3 text-[11px] text-[var(--t1)] truncate">{c.anonymous ? 'Anonymous' : c.authorName ?? 'Unknown'}</td>
                  <td className="px-4 py-3 text-[11px] text-[var(--t3)] truncate">{c.opportunity.title}</td>
                  <td className="px-4 py-3 text-[11px] text-[var(--t3)] truncate">{c.body}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <CommentApproveBtn id={c.id} />
                      <AdminDeleteBtn id={c.id} type="comment" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Client buttons
function AdminDeleteBtn({ id, type }: { id: string; type: string }) {
  return (
    <form action={`/api/admin/${type}s/${id}`} method="DELETE">
      <button type="submit" className="px-2 py-1 border border-red-500/25 rounded text-[10px] text-red-400 hover:bg-red-500/10 transition-colors">Del</button>
    </form>
  )
}

function CommentApproveBtn({ id }: { id: string }) {
  return (
    <form action={`/api/admin/comments/${id}/approve`} method="POST">
      <button type="submit" className="px-2 py-1 border border-[var(--b2)] rounded text-[10px] text-[var(--t3)] hover:bg-[var(--bg3)] transition-colors">Approve</button>
    </form>
  )
}
