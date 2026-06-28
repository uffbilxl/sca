'use client'
import { useEffect, useState } from 'react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error'
}

let toastQueue: ((t: Toast) => void)[] = []
export function toast(message: string, type: 'success' | 'error' = 'success') {
  toastQueue.forEach(fn => fn({ id: Math.random().toString(36), message, type }))
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    const fn = (t: Toast) => {
      setToasts(prev => [...prev, t])
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3500)
    }
    toastQueue.push(fn)
    return () => { toastQueue = toastQueue.filter(f => f !== fn) }
  }, [])

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`px-4 py-3 text-sm font-mono border animate-fade-in ${
            t.type === 'success'
              ? 'bg-[var(--bg3)] border-[var(--b1)] text-[var(--t1)]'
              : 'bg-red-50 border-red-700/30 text-red-700'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
