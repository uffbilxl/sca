'use client'
import { useState, useEffect } from 'react'
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

function useCountdown(target: Date | null) {
  const [diff, setDiff] = useState(() => (target ? Math.max(0, +target - Date.now()) : 0))
  useEffect(() => {
    if (!target) return
    const id = setInterval(() => setDiff(Math.max(0, +target - Date.now())), 1000)
    return () => clearInterval(id)
  }, [target])
  return {
    days:  Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins:  Math.floor((diff % 3600000) / 60000),
    secs:  Math.floor((diff % 60000) / 1000),
    over:  diff === 0,
  }
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-[54px] sm:w-[62px] h-[54px] sm:h-[62px] bg-[var(--bg3)] border border-[var(--b1)] flex items-center justify-center">
        <span className="font-display text-[24px] sm:text-[28px] font-black text-[var(--t1)] tabular-nums leading-none">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[9px] font-mono font-medium uppercase tracking-widest text-[var(--t4)]">{label}</span>
    </div>
  )
}

export default function EventsPage() {
  const now = new Date()
  const upcoming = EVENTS.filter(e => e.date >= now).sort((a, b) => +a.date - +b.date)
  const past     = EVENTS.filter(e => e.date < now).sort((a, b) => +b.date - +a.date)

  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming')
  const [posterSrc, setPosterSrc] = useState<string | null>(null)

  const list      = tab === 'upcoming' ? upcoming : past
  const nextEvent = upcoming[0] ?? null
  const countdown = useCountdown(nextEvent?.date ?? null)

  return (
    <div className="max-w-[860px] mx-auto px-4 sm:px-8 py-5 sm:py-7">
      {/* Header */}
      <div className="mb-6">
        <p className="text-[10px] font-mono text-[var(--t4)] uppercase tracking-[0.14em] mb-1">// events</p>
        <h1 className="font-display text-[20px] font-black tracking-[-0.4px] text-[var(--t1)]">Events</h1>
        <p className="text-[12px] text-[var(--t4)] mt-1">Workshops, talks, networking and career events for BCU computing students.</p>
      </div>

      {/* Countdown hero */}
      {nextEvent && !countdown.over && (
        <div className="relative mb-6 overflow-hidden border border-[var(--b2)] bg-[var(--bg2)]">
          <div className="relative px-5 sm:px-8 py-6 sm:py-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--t3)]" />
              <span className="text-[10px] font-mono font-medium uppercase tracking-widest text-[var(--t3)]">// next event</span>
            </div>

            <h2 className="font-display text-[22px] sm:text-[28px] font-black text-[var(--t1)] leading-tight text-balance mb-2">
              {nextEvent.title}
            </h2>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] font-mono text-[var(--t3)] mb-6">
              <span>{format(nextEvent.date, 'EEEE, d MMMM yyyy')}</span>
              <span>◷ {format(nextEvent.date, 'h:mm a')}{nextEvent.endDate ? ` – ${format(nextEvent.endDate, 'h:mm a')}` : ''}</span>
              <span>{nextEvent.isOnline ? '⊕' : '◎'} {nextEvent.location}</span>
            </div>

            {/* Countdown units */}
            <div className="flex items-end gap-2 sm:gap-3 mb-6">
              <CountdownUnit value={countdown.days}  label="Days"  />
              <span className="font-display text-[20px] font-black text-[var(--b2)] mb-[18px] select-none">:</span>
              <CountdownUnit value={countdown.hours} label="Hours" />
              <span className="font-display text-[20px] font-black text-[var(--b2)] mb-[18px] select-none">:</span>
              <CountdownUnit value={countdown.mins}  label="Mins"  />
              <span className="font-display text-[20px] font-black text-[var(--b2)] mb-[18px] select-none">:</span>
              <CountdownUnit value={countdown.secs}  label="Secs"  />
            </div>

            {/* Hero actions */}
            <div className="flex flex-wrap items-center gap-3">
              {!nextEvent.spots && !nextEvent.registrationUrl ? (
                <span className="px-4 py-2 border border-[var(--b1)] text-[12px] font-mono text-[var(--t3)] font-medium">
                  Open to all — no registration needed
                </span>
              ) : (
                <RegisterButton
                  eventId={nextEvent.id}
                  disabled={spotsLeft(nextEvent.spots, nextEvent.registrations) === 'Full'}
                  registrationUrl={nextEvent.registrationUrl}
                />
              )}
              {nextEvent.poster && (
                <button
                  onClick={() => setPosterSrc(nextEvent.poster!)}
                  className="px-4 py-2 border border-[var(--b1)] text-[12px] text-[var(--t3)] hover:border-[var(--t1)] hover:text-[var(--t1)] transition-colors"
                >
                  View poster
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border border-[var(--b1)] p-1 w-fit bg-[var(--bg2)]">
        {(['upcoming', 'past'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-[12px] font-medium transition-colors capitalize ${
              tab === t ? 'bg-[var(--t1)] text-[var(--bg)]' : 'text-[var(--t3)] hover:text-[var(--t1)]'
            }`}
          >
            {t === 'upcoming' ? `Upcoming${upcoming.length ? ` (${upcoming.length})` : ''}` : 'Past'}
          </button>
        ))}
      </div>

      {/* List */}
      {list.length === 0 ? (
        <div className="border border-[var(--b1)] bg-[var(--bg2)] py-20 px-6 sm:px-10 text-center">
          <div className="w-14 h-14 border border-[var(--b1)] flex items-center justify-center text-[28px] text-[var(--t4)] mx-auto mb-5">◷</div>
          {tab === 'upcoming' ? (
            <>
              <div className="font-display text-[16px] font-semibold text-[var(--t1)] mb-2">Events coming soon</div>
              <div className="text-[13px] text-[var(--t3)] max-w-xs mx-auto leading-relaxed">
                The SCA is busy planning workshops, talks, and networking events for BCU computing students.
                <span className="block mt-2 text-[var(--t2)] font-medium">Stay tuned. Announcements dropping very soon.</span>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 border border-[var(--b1)] text-[11px] font-mono text-[var(--t4)] tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--t3)] inline-block" />
                To be announced by the SCA
              </div>
            </>
          ) : (
            <>
              <div className="font-display text-[16px] font-semibold text-[var(--t1)] mb-2">No past events yet</div>
              <div className="text-[13px] text-[var(--t3)] max-w-xs mx-auto leading-relaxed">
                Previous events will appear here once they have taken place.
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map(event => {
            const sl    = spotsLeft(event.spots, event.registrations)
            const full  = sl === 'Full'
            const isPast = event.date < now

            return (
              <div
                key={event.id}
                className={`bg-[var(--bg)] border px-5 py-4 flex items-start gap-4 transition-colors ${
                  isPast
                    ? 'opacity-70 border-[var(--b1)]'
                    : 'border-[var(--b1)] hover:bg-[var(--bg2)] hover:border-[var(--b2)]'
                }`}
              >
                {/* Calendar date block */}
                <div className={`w-[58px] h-[66px] flex flex-col items-center justify-center flex-shrink-0 border ${
                  isPast
                    ? 'bg-[var(--bg3)] border-[var(--b1)]'
                    : 'bg-[var(--bg2)] border-[var(--b1)]'
                }`}>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-widest leading-none ${isPast ? 'text-[var(--t4)]' : 'text-[var(--t3)]'}`}>
                    {format(event.date, 'MMM')}
                  </span>
                  <span className={`font-display text-[28px] font-black leading-none my-0.5 ${isPast ? 'text-[var(--t3)]' : 'text-[var(--t1)]'}`}>
                    {format(event.date, 'd')}
                  </span>
                  <span className={`text-[9px] font-mono font-medium uppercase tracking-wide ${isPast ? 'text-[var(--t4)]' : 'text-[var(--t4)]'}`}>
                    {format(event.date, 'EEE')}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-display text-[17px] font-black text-[var(--t1)] leading-snug mb-1.5">{event.title}</div>
                  {event.description && (
                    <p className="text-[12px] text-[var(--t3)] leading-relaxed mb-2">{event.description}</p>
                  )}
                  <div className="flex gap-2 sm:gap-3 flex-wrap items-center">
                    <span className="text-[11px] font-mono text-[var(--t4)] flex items-center gap-1">
                      {event.isOnline ? '⊕' : '◎'} {event.location}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--t4)]">
                      ◷ {format(event.date, 'h:mm a')}{event.endDate ? ` – ${format(event.endDate, 'h:mm a')}` : ''}
                    </span>
                    <span className="badge-gray text-[10px]">{eventTypeLabel(event.type)}</span>
                    {event.poster && (
                      <button
                        onClick={() => setPosterSrc(event.poster!)}
                        className="text-[11px] font-mono text-[var(--t3)] hover:text-[var(--t1)] hover:underline transition-colors"
                      >
                        View poster
                      </button>
                    )}
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  {isPast ? (
                    <span className="text-[11px] font-mono text-[var(--t4)]">{event.spots ? `${event.registrations} attended` : 'Completed'}</span>
                  ) : !event.spots && !event.registrationUrl ? (
                    <span className="px-3 py-1.5 border border-[var(--b1)] text-[11px] font-mono text-[var(--t3)] font-medium">Open to all</span>
                  ) : (
                    <>
                      <RegisterButton eventId={event.id} disabled={full} registrationUrl={event.registrationUrl} />
                      {sl && sl !== 'Full' && <span className="text-[10px] font-mono text-[var(--t4)]">{sl}</span>}
                      {full && <span className="text-[10px] font-mono text-red-700">Full</span>}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--t1)]/70 backdrop-blur-sm p-4"
          onClick={() => setPosterSrc(null)}
        >
          <div className="relative max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPosterSrc(null)}
              className="absolute -top-3 -right-3 z-10 w-7 h-7 bg-[var(--bg)] border border-[var(--b1)] flex items-center justify-center text-[var(--t3)] hover:text-[var(--t1)] text-[13px] font-bold"
            >
              ✕
            </button>
            <Image
              src={posterSrc}
              alt="Event poster"
              width={480}
              height={600}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
