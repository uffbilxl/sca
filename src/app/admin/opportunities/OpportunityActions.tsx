'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Status = 'OPEN' | 'CLOSING_SOON' | 'CLOSED'

export default function OpportunityActions({ id, status }: { id: string; status: Status }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  async function setStatus(newStatus: Status) {
    setBusy(true)
    await fetch(`/api/admin/opportunities/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    router.refresh()
    setBusy(false)
  }

  async function deleteOpp() {
    if (!confirm('Delete this opportunity? This cannot be undone.')) return
    setBusy(true)
    await fetch(`/api/admin/opportunities/${id}`, { method: 'DELETE' })
    router.refresh()
    setBusy(false)
  }

  return (
    <div className="flex gap-1.5 flex-wrap">
      {status !== 'CLOSED' && (
        <button
          onClick={() => setStatus('CLOSED')}
          disabled={busy}
          className="px-2 py-1 border border-[var(--b2)] rounded text-[10px] text-[var(--t3)] hover:bg-[var(--bg3)] transition-colors disabled:opacity-40"
        >
          Close
        </button>
      )}
      {status === 'CLOSED' && (
        <button
          onClick={() => setStatus('OPEN')}
          disabled={busy}
          className="px-2 py-1 border border-green-500/30 rounded text-[10px] text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-40"
        >
          Reopen
        </button>
      )}
      <button
        onClick={deleteOpp}
        disabled={busy}
        className="px-2 py-1 border border-red-500/25 rounded text-[10px] text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
      >
        Delete
      </button>
    </div>
  )
}
