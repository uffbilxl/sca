import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { eventTypeLabel, spotsLeft } from '@/lib/utils'
import { RegisterButton } from '@/components/events/RegisterButton'

async function getEvents() {
  return prisma.event.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: 'asc' },
  })
}

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <div className="max-w-[860px] mx-auto px-8 py-7">
      <div className="mb-7">
        <h1 className="text-[20px] font-black tracking-[-0.4px] text-[var(--t1)]">Events</h1>
        <p className="text-[12px] text-[var(--t4)] mt-1">Workshops, talks, networking and career events for BCU computing students.</p>
      </div>

      {events.length === 0 ? (
        <div className="border border-[var(--b1)] rounded-2xl bg-[var(--bg2)] py-20 px-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-[28px] mx-auto mb-5">◷</div>
          <div className="text-[16px] font-semibold text-[var(--t1)] mb-2">Events coming soon</div>
          <div className="text-[13px] text-[var(--t3)] max-w-xs mx-auto leading-relaxed">
            The SCA is busy planning workshops, talks, and networking events for BCU computing students.
            <span className="block mt-2 text-[var(--t2)] font-medium">Stay tuned. Announcements dropping very soon.</span>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 border border-[var(--b2)] rounded-full text-[11px] text-[var(--t4)] tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
            To be announced by the SCA
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-px border border-[var(--b1)] rounded-xl overflow-hidden">
          {events.map(event => {
            const sl = spotsLeft(event.spots, event.registrations)
            const full = sl === 'Full'

            return (
              <div key={event.id} className="bg-[var(--bg2)] px-5 py-4 flex items-center gap-4 border-b border-[var(--b1)] last:border-b-0 hover:bg-[var(--bg3)] transition-colors">
                {/* Date block */}
                <div className="w-11 h-11 rounded-md bg-accent/10 border border-accent/25 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[9px] font-medium text-accent uppercase tracking-wider leading-none">{format(event.date, 'MMM')}</span>
                  <span className="text-[17px] font-bold text-accent leading-tight">{format(event.date, 'd')}</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-medium text-[var(--t1)] mb-1.5">{event.title}</div>
                  <div className="flex gap-3 flex-wrap">
                    <span className="text-[11px] text-[var(--t4)] flex items-center gap-1">
                      {event.isOnline ? '⊕' : '◎'} {event.location}
                    </span>
                    <span className="text-[11px] text-[var(--t4)]">
                      ◷ {format(event.date, 'h:mm a')}{event.endDate ? ` – ${format(event.endDate, 'h:mm a')}` : ''}
                    </span>
                    <span className="badge-gray text-[10px]">{eventTypeLabel(event.type)}</span>
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <RegisterButton eventId={event.id} disabled={full} registrationUrl={event.registrationUrl} />
                  {sl && sl !== 'Full' && (
                    <span className="text-[10px] text-[var(--t4)]">{sl}</span>
                  )}
                  {full && (
                    <span className="text-[10px] text-red-400">Full</span>
                  )}
                  {!event.spots && (
                    <span className="text-[10px] text-[var(--t4)]">Open to all</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
