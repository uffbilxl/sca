import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format, isPast, differenceInDays } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDeadline(date: Date | null): string {
  if (!date) return 'No deadline'
  return format(date, 'MMM d, yyyy')
}

export function deadlineStatus(date: Date | null): 'open' | 'closing' | 'closed' {
  if (!date) return 'open'
  if (isPast(date)) return 'closed'
  if (differenceInDays(date, new Date()) <= 7) return 'closing'
  return 'open'
}

export function daysUntil(date: Date | null): number | null {
  if (!date) return null
  return differenceInDays(date, new Date())
}

export function formatTimeAgo(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true })
}

export function formatSalary(min: number | null, max: number | null, raw: string | null): string {
  if (raw) return raw
  if (!min && !max) return 'Unpaid'
  if (min && !max) return `£${min.toLocaleString()}`
  if (!min && max) return `Up to £${max!.toLocaleString()}`
  if (min === max) return `£${min!.toLocaleString()}`
  return `£${min!.toLocaleString()} – £${max!.toLocaleString()}`
}

export function opportunityTypeLabel(type: string): string {
  const map: Record<string, string> = {
    INTERNSHIP: 'Internship',
    PLACEMENT: 'Placement',
    GRADUATE: 'Graduate',
    SPRING_WEEK: 'Spring Week',
    INSIGHT: 'Insight',
  }
  return map[type] ?? type
}

export function workModeLabel(mode: string): string {
  const map: Record<string, string> = {
    REMOTE: 'Remote',
    HYBRID: 'Hybrid',
    ONSITE: 'On-site',
  }
  return map[mode] ?? mode
}

export function eventTypeLabel(type: string): string {
  const map: Record<string, string> = {
    WORKSHOP: 'Workshop',
    PANEL: 'Panel',
    HACKATHON: 'Hackathon',
    NETWORKING: 'Networking',
    TALK: 'Talk',
    OTHER: 'Event',
  }
  return map[type] ?? type
}

export function spotsLeft(spots: number | null, registrations: number): string | null {
  if (!spots) return null
  const left = spots - registrations
  if (left <= 0) return 'Full'
  if (left <= 5) return `${left} spots left`
  if (left <= 15) return `${left} spots left`
  return null
}
