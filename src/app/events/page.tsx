'use client'
import { useState } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { eventTypeLabel, spotsLeft } from '@/lib/utils'
import { RegisterButton } from '@/components/events/RegisterButton'
import type { SCAEvent } from '@/types'

const EVENTS: SCAEvent[] = [
  {
    id: 'social-night-june-2026',
    title: 'Social Night: Debate & Gaming',
    description: 'A collaborative social night with BCU Gaming Society and the Law Debating & Mooting Society. Speed debates on topics from Gaming and AI (12–3 PM), then a relaxed gaming session to meet students from across courses and societies (3–8 PM).',
    location: 'STEAMhouse, CST-302',
    isOnline: false,
    date: new Date('2026-06-04T12:00:00'),
    endDate: new Date('2026-06-04T20:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'OTHER',
    poster: '/posters/social-night-june-2026.jpg',
  },
]

export default function EventsPage() {
  const now = new Date()
  const upcoming = EVENTS.filter(e => e.date >= now).sort((a, b) => +a.date - +b.date)
  const past = EVENTS.filter(e => e.date < now).sort((a, b) => +b.date - +a.date)

  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [posterSrc, setPosterSrc] = useState<string | null>(null)

  const list = tab === 'upcoming' ? upcoming : past

  return (
    <div className="max-w-[860px] mx-auto px-4 sm:px-8 py-5 sm:py-7">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[20px] font-black tracking-[-0.4px] text-[var(--t1)]">Events</h1>
        <p className="text-[12px] text-[var(--t4)] mt-1">Workshops, talks, networking and career events for BCU computing students.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border border-[var(--b1)] rounded-lg p-1 w-fit bg-[var(--bg2)]">
        {(['upcoming', 'past'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-md text-[12px] font-medium transition-colors capitalize ${
              tab === t
                ? 'bg-accent text-white'
                : 'text-[var(--t3)] hover:text-[var(--t1)]'
            }`}
          >
            {t === 'upcoming' ? `Upcoming${upcoming.length ? ` (${upcoming.length})` : ''}` : 'Past'}
          </button>
        ))}
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div className="border border-[var(--b1)] rounded-2xl bg-[var(--bg2)] py-20 px-6 sm:px-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-[28px] mx-auto mb-5">◷</div>
          {tab === 'upcoming' ? (
            <>
              <div className="text-[16px] font-semibold text-[var(--t1)] mb-2">Events coming soon</div>
              <div className="text-[13px] text-[var(--t3)] max-w-xs mx-auto leading-relaxed">
                The SCA is busy planning workshops, talks, and networking events for BCU computing students.
                <span className="block mt-2 text-[var(--t2)] font-medium">Stay tuned. Announcements dropping very soon.</span>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 border border-[var(--b2)] rounded-full text-[11px] text-[var(--t4)] tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
                To be announced by the SCA
              </div>
            </>
          ) : (
            <>
              <div className="text-[16px] font-semibold text-[var(--t1)] mb-2">No past events yet</div>
              <div className="text-[13px] text-[var(--t3)] max-w-xs mx-auto leading-relaxed">
                Previous events will appear here once they've taken place.
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-px border border-[var(--b1)] rounded-xl overflow-hidden">
          {list.map(event => {
            const sl = spotsLeft(event.spots, event.registrations)
            const full = sl === 'Full'
            const isPast = event.date < now

            return (
              <div
                key={event.id}
                className={`bg-[var(--bg2)] px-4 sm:px-5 py-4 flex items-start gap-3 sm:gap-4 border-b border-[var(--b1)] last:border-b-0 transition-colors ${isPast ? 'opacity-70' : 'hover:bg-[var(--bg3)]'}`}
              >
                {/* Date block */}
                <div className={`w-11 h-11 rounded-md flex flex-col items-center justify-center flex-shrink-0 mt-0.5 ${isPast ? 'bg-[var(--bg3)] border border-[var(--b1)]' : 'bg-accent/10 border border-accent/25'}`}>
                  <span className={`text-[9px] font-medium uppercase tracking-wider leading-none ${isPast ? 'text-[var(--t4)]' : 'text-accent'}`}>{format(event.date, 'MMM')}</span>
                  <span className={`text-[17px] font-bold leading-tight ${isPast ? 'text-[var(--t3)]' : 'text-accent'}`}>{format(event.date, 'd')}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[var(--t1)] mb-1">{event.title}</div>
                  {event.description && (
                    <p className="text-[12px] text-[var(--t3)] leading-relaxed mb-2">{event.description}</p>
                  )}
                  <div className="flex gap-2 sm:gap-3 flex-wrap items-center">
                    <span className="text-[11px] text-[var(--t4)] flex items-center gap-1">
                      {event.isOnline ? '⊕' : '◎'} {event.location}
                    </span>
                    <span className="text-[11px] text-[var(--t4)]">
                      ◷ {format(event.date, 'h:mm a')}{event.endDate ? ` – ${format(event.endDate, 'h:mm a')}` : ''}
                    </span>
                    <span className="badge-gray text-[10px]">{eventTypeLabel(event.type)}</span>
                    {event.poster && (
                      <button
                        onClick={() => setPosterSrc(event.poster!)}
                        className="text-[11px] text-accent hover:underline flex items-center gap-1"
                      >
                        View poster
                      </button>
                    )}
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  {isPast ? (
                    <span className="text-[11px] text-[var(--t4)]">{event.spots ? `${event.registrations} attended` : 'Completed'}</span>
                  ) : !event.spots && !event.registrationUrl ? (
                    <span className="px-3 py-1.5 border border-[var(--b2)] rounded-md text-[11px] text-[var(--t3)] font-medium">Open to all</span>
                  ) : (
                    <>
                      <RegisterButton eventId={event.id} disabled={full} registrationUrl={event.registrationUrl} />
                      {sl && sl !== 'Full' && <span className="text-[10px] text-[var(--t4)]">{sl}</span>}
                      {full && <span className="text-[10px] text-red-400">Full</span>}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Poster modal */}
      {posterSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setPosterSrc(null)}
        >
          <div className="relative max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPosterSrc(null)}
              className="absolute -top-3 -right-3 z-10 w-7 h-7 rounded-full bg-[var(--bg1)] border border-[var(--b1)] flex items-center justify-center text-[var(--t3)] hover:text-[var(--t1)] text-[13px] font-bold"
            >
              ✕
            </button>
            <Image
              src={posterSrc}
              alt="Event poster"
              width={480}
              height={600}
              className="rounded-xl w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
