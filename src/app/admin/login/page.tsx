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
          <div className="text-[9px] font-bold text-accent uppercase tracking-widest mb-3">SCA Admin</div>
          <h1 className="text-[22px] font-black tracking-[-0.4px] text-[var(--t1)]">Admin Portal</h1>
          <p className="text-[12px] text-[var(--t4)] mt-1.5">Restricted access — enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[var(--bg2)] border border-[var(--b1)] rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-[10px] font-semibold text-[var(--t4)] uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full bg-[var(--bg3)] border border-[var(--b2)] rounded-lg px-3 py-2.5 text-[13px] text-[var(--t1)] placeholder:text-[var(--t4)] focus:outline-none focus:border-accent transition-colors"
              autoFocus
              required
            />
          </div>

          {error && (
            <div className="text-[12px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-white rounded-lg py-2.5 text-[13px] font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Enter Admin Panel →'}
          </button>
        </form>

        <p className="text-center text-[11px] text-[var(--t4)] mt-5">
          <a href="/" className="hover:text-[var(--t3)] transition-colors">← Back to site</a>
        </p>
      </div>
    </div>
  )
}
