'use client'
import { useState } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { MapPin, Clock, X } from 'lucide-react'
import { eventTypeLabel, spotsLeft } from '@/lib/utils'
import { RegisterButton } from '@/components/events/RegisterButton'
import type { SCAEvent } from '@/types'

const EVENTS: SCAEvent[] = [
  {
    id: 'placements-interns-panel-oct-2026',
    title: 'Placements and Interns Panel',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-10-02T13:00:00'),
    endDate: new Date('2026-10-02T14:30:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'PANEL',
    poster: null,
  },
  {
    id: 'placements-interns-roundtable-oct-2026',
    title: 'Placements and Interns Roundtable',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-10-12T15:00:00'),
    endDate: new Date('2026-10-12T16:30:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'PANEL',
    poster: null,
  },
  {
    id: 'career-panel-oct-2026',
    title: 'Career Panel',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-10-15T12:00:00'),
    endDate: new Date('2026-10-15T13:30:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'PANEL',
    poster: null,
  },
  {
    id: 'capture-the-flag-oct-2026',
    title: 'Capture the Flag',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-10-23T10:00:00'),
    endDate: new Date('2026-10-23T16:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'HACKATHON',
    poster: null,
  },
  {
    id: 'fireside-chat-harris-khaliq-oct-2026',
    title: 'Fireside Chat with Cllr. Harris Khaliq',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-10-26T17:00:00'),
    endDate: new Date('2026-10-26T18:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'TALK',
    poster: null,
  },
  {
    id: 'fireside-chat-hamza-hanif-oct-2026',
    title: 'Fireside Chat with Hamza Hanif, Founder and CEO of Sunna Supplements',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-10-29T17:30:00'),
    endDate: new Date('2026-10-29T18:30:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'TALK',
    poster: null,
  },
  {
    id: 'scratch-hackathon-nov-2026',
    title: 'Scratch Hackathon',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-11-06T11:00:00'),
    endDate: new Date('2026-11-06T18:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'HACKATHON',
    poster: null,
  },
  {
    id: 'build-your-own-llm-2026-10-07',
    title: 'Build Your Own LLM',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-10-07T15:00:00'),
    endDate: new Date('2026-10-07T17:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'build-your-own-llm-2026-10-14',
    title: 'Build Your Own LLM',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-10-14T15:00:00'),
    endDate: new Date('2026-10-14T17:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'build-your-own-llm-2026-10-21',
    title: 'Build Your Own LLM',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-10-21T15:00:00'),
    endDate: new Date('2026-10-21T17:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'build-your-own-llm-2026-10-28',
    title: 'Build Your Own LLM',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-10-28T15:00:00'),
    endDate: new Date('2026-10-28T17:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'build-your-own-llm-2026-11-04',
    title: 'Build Your Own LLM',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-11-04T15:00:00'),
    endDate: new Date('2026-11-04T17:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'build-your-own-llm-2026-11-11',
    title: 'Build Your Own LLM',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-11-11T15:00:00'),
    endDate: new Date('2026-11-11T17:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'build-your-own-llm-2026-11-18',
    title: 'Build Your Own LLM',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-11-18T15:00:00'),
    endDate: new Date('2026-11-18T17:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'build-your-own-llm-2026-11-25',
    title: 'Build Your Own LLM',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-11-25T15:00:00'),
    endDate: new Date('2026-11-25T17:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'welcome-week-sept-2026',
    title: 'Welcome Week: Meet the Committee',
    description:
      'Kick off the new academic year with the SCA. Meet the committee, win prizes, and get stuck into a week of fun activities.',
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-09-14T12:00:00'),
    endDate: null,
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'NETWORKING',
    poster: null,
  },
  {
    id: 'leetcode-club-2026-09-29',
    title: 'LeetCode Club',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-09-29T14:00:00'),
    endDate: new Date('2026-09-29T16:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'leetcode-club-2026-10-06',
    title: 'LeetCode Club',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-10-06T14:00:00'),
    endDate: new Date('2026-10-06T16:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'leetcode-club-2026-10-13',
    title: 'LeetCode Club',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-10-13T14:00:00'),
    endDate: new Date('2026-10-13T16:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'leetcode-club-2026-10-20',
    title: 'LeetCode Club',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-10-20T14:00:00'),
    endDate: new Date('2026-10-20T16:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'leetcode-club-2026-10-27',
    title: 'LeetCode Club',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-10-27T14:00:00'),
    endDate: new Date('2026-10-27T16:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'leetcode-club-2026-11-03',
    title: 'LeetCode Club',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-11-03T14:00:00'),
    endDate: new Date('2026-11-03T16:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'leetcode-club-2026-11-10',
    title: 'LeetCode Club',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-11-10T14:00:00'),
    endDate: new Date('2026-11-10T16:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'leetcode-club-2026-11-17',
    title: 'LeetCode Club',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-11-17T14:00:00'),
    endDate: new Date('2026-11-17T16:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'leetcode-club-2026-11-24',
    title: 'LeetCode Club',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-11-24T14:00:00'),
    endDate: new Date('2026-11-24T16:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'WORKSHOP',
    poster: null,
  },
  {
    id: 'meet-and-greet-sept-2026',
    title: 'Meet and Greet',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-09-23T16:00:00'),
    endDate: null,
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'NETWORKING',
    poster: null,
  },
  {
    id: 'application-simulation-day-oct-2026',
    title: 'Application Simulation Day',
    description: null,
    location: 'STEAMhouse',
    isOnline: false,
    date: new Date('2026-10-01T09:00:00'),
    endDate: new Date('2026-10-01T17:00:00'),
    spots: null,
    registrations: 0,
    registrationUrl: null,
    type: 'OTHER',
    poster: null,
  },
  {
    id: 'social-night-june-2026',
    title: 'Social Night: Debate & Gaming',
    description:
      'A collaborative social night with BCU Gaming Society and the Law Debating & Mooting Society. Speed debates on topics from Gaming and AI (12–3 PM), then a relaxed gaming session to meet students from across courses and societies (3–8 PM).',
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
  const past     = EVENTS.filter(e => e.date <  now).sort((a, b) => +b.date - +a.date)

  const [tab, setTab]           = useState<'upcoming' | 'past'>('upcoming')
  const [posterSrc, setPosterSrc] = useState<string | null>(null)

  const list = tab === 'upcoming' ? upcoming : past

  return (
    <div className="max-w-[860px] mx-auto px-5 sm:px-8 py-10 sm:py-14" style={{ position: 'relative', zIndex: 1 }}>

      {/* Page header */}
      <div className="mb-10">
        <span className="eyebrow mb-3">Student Computing Association</span>
        <h1
          className="text-[clamp(1.75rem,5vw,2.75rem)] font-bold tracking-tight text-[var(--color-text)] mb-2"
          style={{ fontFamily: 'var(--font-geist-sans)' }}
        >
          Events
        </h1>
        <p className="text-sm text-[var(--color-muted)] max-w-lg">
          Workshops, talks, networking and career events for BCU computing students.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border border-[var(--color-border)] rounded-full p-1 w-fit bg-[var(--color-surface)]">
        {(['upcoming', 'past'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200 capitalize focus-ring ${
              tab === t
                ? 'bg-[var(--color-accent)] text-white shadow-sm'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            {t === 'upcoming'
              ? `Upcoming${upcoming.length ? ` (${upcoming.length})` : ''}`
              : 'Past'}
          </button>
        ))}
      </div>

      {/* Timeline list */}
      {list.length === 0 ? (
        <div className="border border-[rgba(var(--hairline-rgb),0.07)] rounded-2xl py-20 px-6 text-center" style={{ background: 'var(--card-gradient)' }}>
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center mx-auto mb-5">
            <Clock size={24} className="text-[var(--color-accent)]" aria-hidden="true" />
          </div>
          {tab === 'upcoming' ? (
            <>
              <div
                className="text-[16px] font-semibold text-[var(--color-text)] mb-2"
                style={{ fontFamily: 'var(--font-geist-sans)' }}
              >
                Events coming soon
              </div>
              <div className="text-[13px] text-[var(--color-muted)] max-w-xs mx-auto leading-relaxed">
                The SCA is busy planning workshops, talks, and networking events.
                <span className="block mt-2 text-[var(--color-text)] font-medium">
                  Stay tuned, announcements dropping soon.
                </span>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 border border-[var(--color-border)] rounded-full text-[11px] text-[var(--color-muted)] tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse inline-block" />
                To be announced by the SCA
              </div>
            </>
          ) : (
            <>
              <div className="text-[16px] font-semibold text-[var(--color-text)] mb-2">
                No past events yet
              </div>
              <div className="text-[13px] text-[var(--color-muted)] max-w-xs mx-auto">
                Previous events will appear here once they have taken place.
              </div>
            </>
          )}
        </div>
      ) : (
        /* Timeline */
        <div className="relative">
          {/* Vertical indigo line */}
          <div
            className="absolute left-[23px] top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, var(--color-accent), transparent)' }}
          />

          <div className="flex flex-col gap-6">
            {list.map(event => {
              const sl     = spotsLeft(event.spots, event.registrations)
              const full   = sl === 'Full'
              const isPast = event.date < now

              return (
                <div key={event.id} className="flex gap-5 relative">
                  {/* Timeline node */}
                  <div
                    className="flex-shrink-0 w-12 flex flex-col items-center pt-1"
                    aria-hidden="true"
                  >
                    <div
                      className={`w-3 h-3 rounded-full border-2 mt-1.5 ${
                        isPast
                          ? 'border-[var(--color-border)] bg-[var(--color-bg)]'
                          : 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                      }`}
                    />
                  </div>

                  {/* Event card */}
                  <div
                    className={`flex-1 rounded-2xl px-5 py-4 transition-all mb-1 ${
                      isPast ? 'opacity-60' : 'hover:border-[rgba(99,102,241,0.3)]'
                    }`}
                    style={{
                      background: 'var(--card-gradient)',
                      border: '1px solid rgba(var(--hairline-rgb),0.07)',
                    }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Date block */}
                      <div
                        className={`hidden sm:flex w-[58px] h-[66px] rounded-xl flex-col items-center justify-center flex-shrink-0 ${
                          isPast
                            ? 'bg-[var(--color-bg)] border border-[var(--color-border)]'
                            : 'bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/25'
                        }`}
                      >
                        <span
                          className={`text-[9px] font-bold uppercase tracking-widest leading-none ${
                            isPast ? 'text-[var(--color-muted)]' : 'text-[var(--color-accent)]/80'
                          }`}
                        >
                          {format(event.date, 'MMM')}
                        </span>
                        <span
                          className={`text-[28px] font-bold leading-none my-0.5 ${
                            isPast ? 'text-[var(--color-muted)]' : 'text-[var(--color-accent)]'
                          }`}
                          style={{ fontFamily: 'var(--font-geist-mono)' }}
                        >
                          {format(event.date, 'd')}
                        </span>
                        <span
                          className={`text-[9px] font-medium uppercase tracking-wide ${
                            isPast ? 'text-[var(--color-muted)]' : 'text-[var(--color-accent)]/60'
                          }`}
                        >
                          {format(event.date, 'EEE')}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-[16px] font-semibold text-[var(--color-text)] leading-snug mb-1.5"
                          style={{ fontFamily: 'var(--font-geist-sans)' }}
                        >
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="text-[12px] text-[var(--color-muted)] leading-relaxed mb-3">
                            {event.description}
                          </p>
                        )}
                        <div className="flex gap-3 flex-wrap items-center">
                          <span className="flex items-center gap-1 text-[11px] text-[var(--color-muted)]">
                            <MapPin size={10} aria-hidden="true" />
                            {event.location}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-[var(--color-muted)]">
                            <Clock size={10} aria-hidden="true" />
                            {format(event.date, 'h:mm a')}
                            {event.endDate ? ` – ${format(event.endDate, 'h:mm a')}` : ''}
                          </span>
                          <span className="badge-gray text-[10px]">{eventTypeLabel(event.type)}</span>
                          {event.poster && (
                            <button
                              onClick={() => setPosterSrc(event.poster!)}
                              className="text-[11px] text-[var(--color-accent)] hover:underline focus-ring rounded"
                            >
                              View poster
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Right actions */}
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        {isPast ? (
                          <span className="text-[11px] text-[var(--color-muted)]">
                            {event.spots ? `${event.registrations} attended` : 'Completed'}
                          </span>
                        ) : !event.spots && !event.registrationUrl ? (
                          <span className="px-3 py-1.5 border border-[var(--color-border)] rounded-full text-[11px] text-[var(--color-muted)] font-medium">
                            Open to all
                          </span>
                        ) : (
                          <>
                            <RegisterButton
                              eventId={event.id}
                              disabled={full}
                              registrationUrl={event.registrationUrl}
                            />
                            {sl && sl !== 'Full' && (
                              <span className="text-[10px] text-[var(--color-muted)]">{sl}</span>
                            )}
                            {full && (
                              <span className="text-[10px] text-red-400">Full</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Poster modal */}
      {posterSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
          onClick={() => setPosterSrc(null)}
        >
          <div
            className="relative max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setPosterSrc(null)}
              className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors focus-ring"
              aria-label="Close poster"
            >
              <X size={14} />
            </button>
            <Image
              src={posterSrc}
              alt="Event poster"
              width={480}
              height={600}
              className="rounded-2xl w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
