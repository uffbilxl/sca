'use client'
interface Props {
  eventId: string
  disabled: boolean
  registrationUrl: string | null
}
export function RegisterButton({ eventId, disabled, registrationUrl }: Props) {
  if (disabled) {
    return (
      <button disabled className="px-3 py-1.5 bg-[var(--bg3)] text-[var(--t4)] text-[11px] font-medium cursor-not-allowed">
        Full
      </button>
    )
  }
  if (registrationUrl) {
    return (
      <a
        href={registrationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1.5 bg-[var(--t1)] text-[var(--bg)] text-[11px] font-medium hover:opacity-80 transition-opacity"
      >
        Register
      </a>
    )
  }
  return (
    <button
      onClick={() => alert('Registration will be available soon. Check back later.')}
      className="px-3 py-1.5 bg-[var(--t1)] text-[var(--bg)] text-[11px] font-medium hover:opacity-80 transition-opacity"
    >
      Register
    </button>
  )
}
