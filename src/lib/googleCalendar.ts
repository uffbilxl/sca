import type { EventType, SCAEvent } from '@/types'

/* Reads the SCA's Google Calendar so the events page follows whatever the
 * committee puts in the calendar, instead of an array somebody has to
 * remember to edit. One direction only: the site never writes back.
 *
 * Needs GOOGLE_CALENDAR_ID and GOOGLE_CALENDAR_API_KEY. Without them (local
 * dev, a preview build, a revoked key) every call returns null and the page
 * falls back to its committed event list, so a missing key degrades to
 * "slightly stale" rather than an empty events page. */

const API = 'https://www.googleapis.com/calendar/v3/calendars'

/* How far either side of today to read. Past events still render in the
 * list view's Past tab and in earlier calendar months, so the window has to
 * reach backwards too. */
const MONTHS_BACK = 6
const MONTHS_AHEAD = 12

/* Title keywords, most specific first — "Cyber Security Panel" is a panel,
 * not a workshop, so whichever keyword appears earliest in this list wins
 * rather than whichever appears earliest in the title. Anything unmatched
 * becomes OTHER, which renders as the neutral "Event" badge. */
const TYPE_KEYWORDS: [RegExp, EventType][] = [
  [/\b(hackathon|capture the flag|ctf|game ?jam)\b/i, 'HACKATHON'],
  [/\b(panel|roundtable|round table|q&a|ama)\b/i, 'PANEL'],
  [/\b(fireside|talk|speaker|lecture|keynote|seminar)\b/i, 'TALK'],
  [/\b(networking|meet|mixer|social|welcome|mingle)\b/i, 'NETWORKING'],
  [
    /\b(workshop|club|session|bootcamp|lab|tutorial|training|course|build|coding|hands[- ]on|intro to)\b/i,
    'WORKSHOP',
  ],
]

const VALID_TYPES: EventType[] = ['WORKSHOP', 'PANEL', 'HACKATHON', 'NETWORKING', 'TALK', 'OTHER']

/* An explicit [WORKSHOP] anywhere in the title or description beats the
 * keywords, for the events whose name gives nothing away ("Build Your Own
 * LLM"). stripTypeTag() keeps the tag out of what students actually see. */
const TYPE_TAG = /\[(workshop|panel|hackathon|networking|talk|other)\]/i

export function stripTypeTag(title: string): string {
  return title.replace(TYPE_TAG, '').replace(/\s{2,}/g, ' ').trim()
}

export function inferEventType(title: string, description = ''): EventType {
  const haystack = `${title} ${description}`

  const tagged = haystack.match(TYPE_TAG)
  if (tagged) {
    const explicit = tagged[1].toUpperCase() as EventType
    if (VALID_TYPES.includes(explicit)) return explicit
  }

  for (const [pattern, type] of TYPE_KEYWORDS) {
    if (pattern.test(haystack)) return type
  }
  return 'OTHER'
}

/* Things Google Calendar has no field for. Keyed by the lowercased event
 * title so it survives the event being deleted and recreated (which changes
 * its Google id). Add an entry here when an event needs a poster image, an
 * external registration form, or a capacity. */
interface EventExtras {
  poster?: string
  registrationUrl?: string
  spots?: number
}

const EXTRAS: Record<string, EventExtras> = {
  'social night: debate & gaming': { poster: '/posters/social-night-june-2026.jpg' },
}

/* Google's HTML descriptions carry <br>, <a> and entities; the card renders
 * plain text, so flatten rather than dangerouslySetInnerHTML. */
function toPlainText(html: string | undefined): string | null {
  if (!html) return null
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return text.length > 0 ? text : null
}

interface GoogleEvent {
  id?: string
  status?: string
  summary?: string
  description?: string
  location?: string
  start?: { dateTime?: string; date?: string }
  end?: { dateTime?: string; date?: string }
}

function toSCAEvent(g: GoogleEvent): SCAEvent | null {
  const rawTitle = g.summary?.trim()
  // An untitled or cancelled entry is not something to show students.
  if (!rawTitle || g.status === 'cancelled') return null
  // Type is read from the raw title, then the tag is stripped for display.
  const type = inferEventType(rawTitle, toPlainText(g.description) ?? '')
  const title = stripTypeTag(rawTitle)

  const startRaw = g.start?.dateTime ?? g.start?.date
  if (!startRaw) return null
  const date = new Date(startRaw)
  if (Number.isNaN(date.getTime())) return null

  /* All-day events give a bare date and an exclusive end date. Showing
   * "12:00 AM – 12:00 AM" for those would be worse than showing no end
   * time at all, so they get a null endDate and the card omits the range. */
  const allDay = !g.start?.dateTime
  const endRaw = g.end?.dateTime
  const endDate = !allDay && endRaw ? new Date(endRaw) : null

  const description = toPlainText(g.description)
  const extras = EXTRAS[title.toLowerCase()] ?? {}

  return {
    id: g.id ?? `gcal-${date.toISOString()}-${title}`,
    title,
    description,
    location: g.location?.split(',')[0]?.trim() || 'STEAMhouse',
    isOnline: /online|zoom|teams|meet\.google/i.test(`${g.location ?? ''} ${description ?? ''}`),
    date,
    endDate: endDate && !Number.isNaN(endDate.getTime()) ? endDate : null,
    spots: extras.spots ?? null,
    registrations: 0,
    registrationUrl: extras.registrationUrl ?? null,
    type,
    poster: extras.poster ?? null,
  }
}

/** Returns null when sync is not configured or the fetch fails, so callers
 *  can fall back to their committed list rather than render nothing. */
export async function fetchGoogleCalendarEvents(): Promise<SCAEvent[] | null> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY
  if (!calendarId || !apiKey) return null

  const now = new Date()
  const timeMin = new Date(now)
  timeMin.setMonth(timeMin.getMonth() - MONTHS_BACK)
  const timeMax = new Date(now)
  timeMax.setMonth(timeMax.getMonth() + MONTHS_AHEAD)

  const url =
    `${API}/${encodeURIComponent(calendarId)}/events` +
    `?key=${encodeURIComponent(apiKey)}` +
    `&timeMin=${timeMin.toISOString()}` +
    `&timeMax=${timeMax.toISOString()}` +
    // Expands weekly series (LeetCode Club) into one entry per occurrence.
    `&singleEvents=true&orderBy=startTime&maxResults=250`

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) {
      console.error(`Google Calendar fetch failed: ${res.status} ${await res.text()}`)
      return null
    }
    const data = (await res.json()) as { items?: GoogleEvent[] }
    if (!Array.isArray(data.items)) return null

    const events = data.items
      .map(toSCAEvent)
      .filter((e): e is SCAEvent => e !== null)
      .sort((a, b) => +a.date - +b.date)

    /* An empty calendar and a silently broken key look identical downstream,
     * and the second one should not wipe the page. */
    return events.length > 0 ? events : null
  } catch (err) {
    console.error('Google Calendar fetch threw:', err)
    return null
  }
}
