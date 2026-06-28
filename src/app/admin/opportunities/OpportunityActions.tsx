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
          className="px-2 py-1 border border-[var(--b1)] text-[10px] font-mono text-[var(--t3)] hover:bg-[var(--bg3)] transition-colors disabled:opacity-40"
        >
          Close
        </button>
      )}
      {status === 'CLOSED' && (
        <button
          onClick={() => setStatus('OPEN')}
          disabled={busy}
          className="px-2 py-1 border border-green-700/40 text-[10px] font-mono text-green-700 hover:bg-green-50 transition-colors disabled:opacity-40"
        >
          Reopen
        </button>
      )}
      <button
        onClick={deleteOpp}
        disabled={busy}
        className="px-2 py-1 border border-red-700/30 text-[10px] font-mono text-red-700 hover:bg-red-50 transition-colors disabled:opacity-40"
      >
        Delete
      </button>
    </div>
  )
}
