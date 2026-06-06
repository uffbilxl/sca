'use client'
import { useState } from 'react'

type SeedResult = { added: number; skipped: number; total: number }

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SeedResult | null>(null)
  const [error, setError] = useState('')

  async function handleSeed() {
    if (!confirm('This will seed the database from the static opportunities file. Existing entries are skipped. Continue?')) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/admin/seed', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) setError(data.error ?? 'Seed failed')
      else setResult(data)
    } catch {
      setError('Network error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-[20px] font-black tracking-[-0.4px] text-[var(--t1)]">Seed Database</h1>
        <p className="text-[12px] text-[var(--t4)] mt-1">
          One-time migration: populates the database from the static opportunities file. Existing entries are skipped.
          Run this once, then use CSV import for future updates.
        </p>
      </div>

      <div className="bg-[var(--bg2)] border border-amber-500/20 rounded-xl p-5 mb-5">
        <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest mb-2">One-time operation</div>
        <p className="text-[12px] text-[var(--t3)]">
          After seeding, the public opportunities and homepage will read from the database.
          Any future changes should be made through the CSV import, not the static file.
        </p>
      </div>

      <button
        onClick={handleSeed}
        disabled={loading}
        className="px-5 py-2.5 bg-accent text-white text-[13px] font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? 'Seeding...' : 'Seed Database →'}
      </button>

      {error && (
        <div className="mt-4 text-[12px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>
      )}

      {result && (
        <div className="mt-5 bg-[var(--bg2)] border border-[var(--b1)] rounded-xl p-5">
          <div className="text-[10px] font-semibold text-[var(--t4)] uppercase tracking-widest mb-3">Seed complete</div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { n: result.total, label: 'Total', colour: 'text-[var(--t2)]' },
              { n: result.added, label: 'Added', colour: 'text-green-400' },
              { n: result.skipped, label: 'Skipped', colour: 'text-[var(--t4)]' },
            ].map(s => (
              <div key={s.label} className="text-center bg-[var(--bg3)] rounded-lg py-3">
                <div className={`text-[22px] font-bold ${s.colour}`}>{s.n}</div>
                <div className="text-[9px] text-[var(--t4)] uppercase tracking-widest mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
          <a href="/admin/opportunities" className="inline-block mt-4 text-[12px] text-accent hover:underline">
            View all opportunities →
          </a>
        </div>
      )}
    </div>
  )
}
