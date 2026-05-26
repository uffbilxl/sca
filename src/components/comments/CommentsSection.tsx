'use client'
import { useState } from 'react'
import { Comment } from '@/types'
import { formatTimeAgo } from '@/lib/utils'
import { toast } from '@/components/ui/Toaster'

interface Props {
  opportunityId: string
  initialComments: Comment[]
}

export function CommentsSection({ opportunityId, initialComments }: Props) {
  const [comments] = useState(initialComments)
  const [body, setBody] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit() {
    if (!body.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId, body, authorName: anonymous ? null : authorName || null, anonymous }),
      })
      if (res.ok) {
        setBody(''); setAuthorName(''); setSubmitted(true)
        toast('Comment submitted — it will appear after review')
      } else {
        toast('Failed to submit comment', 'error')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-7 pt-7 border-t border-[var(--b1)]">
      <h2 className="text-[14px] font-semibold text-[var(--t1)] mb-4">
        Student feedback ({comments.filter(c => c.approved).length})
      </h2>

      {/* Input */}
      {!submitted ? (
        <div className="bg-[var(--bg2)] border border-[var(--b2)] rounded-xl p-4 mb-4 focus-within:border-accent transition-colors">
          {!anonymous && (
            <input
              type="text"
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full bg-transparent border-none outline-none text-[12px] text-[var(--t1)] placeholder-[var(--t4)] mb-2 pb-2 border-b border-[var(--b1)]"
            />
          )}
          <textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Share your experience, tips, or questions about this role…"
            rows={3}
            className="w-full bg-transparent border-none outline-none text-[12px] text-[var(--t1)] placeholder-[var(--t4)] resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between pt-2.5 border-t border-[var(--b1)] mt-2">
            <label className="flex items-center gap-1.5 text-[11px] text-[var(--t4)] cursor-pointer">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={e => setAnonymous(e.target.checked)}
                className="accent-accent w-3 h-3"
              />
              Post anonymously
            </label>
            <button
              onClick={handleSubmit}
              disabled={submitting || !body.trim()}
              className="px-4 py-1.5 bg-accent text-white text-[11px] font-medium rounded-md hover:bg-accent-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Posting…' : 'Post comment'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[var(--bg2)] border border-[var(--b1)] rounded-xl p-4 mb-4 text-[12px] text-[var(--t3)]">
          ✓ Thanks — your comment will appear once reviewed by an admin.
        </div>
      )}

      {/* Comment list */}
      {comments.length === 0 ? (
        <div className="py-8 text-center text-[12px] text-[var(--t4)]">
          No feedback yet — be the first to share your experience.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {comments.map(c => (
            <div key={c.id} className="bg-[var(--bg2)] border border-[var(--b1)] rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-[var(--bg4)] flex items-center justify-center text-[9px] font-semibold text-[var(--t3)] flex-shrink-0">
                  {c.anonymous || !c.authorName ? 'AN' : c.authorName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <span className="text-[12px] font-medium text-[var(--t1)]">
                  {c.anonymous || !c.authorName ? 'Anonymous' : c.authorName}
                </span>
                <span className="text-[10px] text-[var(--t4)]">{formatTimeAgo(new Date(c.createdAt))}</span>
                {c.pinned && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-accent/10 text-accent border border-accent/25 rounded">Pinned</span>
                )}
              </div>
              <p className="text-[12px] text-[var(--t3)] leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
