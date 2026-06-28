'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error ?? 'Invalid password')
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-[9px] font-mono font-bold text-[var(--t4)] uppercase tracking-widest mb-3">// SCA Admin</div>
          <h1 className="font-display text-[22px] font-black tracking-[-0.4px] text-[var(--t1)]">Admin Portal</h1>
          <p className="text-[12px] font-mono text-[var(--t4)] mt-1.5">Restricted access — enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--bg2)] border border-[var(--b1)] p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-mono font-medium text-[var(--t4)] uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-[var(--bg3)] border border-[var(--b1)] px-3 py-2.5 text-[13px] text-[var(--t1)] placeholder:text-[var(--t4)] focus:outline-none focus:border-[var(--t1)] transition-colors"
              autoFocus
              required
            />
          </div>

          {error && (
            <div className="text-[12px] font-mono text-red-700 border border-red-700/30 bg-red-50 px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--t1)] text-[var(--bg)] py-2.5 text-[13px] font-semibold hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Enter Admin Panel →'}
          </button>
        </form>

        <p className="text-center text-[11px] font-mono text-[var(--t4)] mt-5">
          <a href="/" className="hover:text-[var(--t1)] hover:underline transition-colors">← Back to site</a>
        </p>
      </div>
    </div>
  )
}
