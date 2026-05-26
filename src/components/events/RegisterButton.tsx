'use client'
interface Props {
  eventId: string
  disabled: boolean
  registrationUrl: string | null
}
export function RegisterButton({ eventId, disabled, registrationUrl }: Props) {
  if (disabled) {
    return (
      <button disabled className="px-3 py-1.5 bg-[var(--bg4)] text-[var(--t4)] text-[11px] font-medium rounded-md cursor-not-allowed">
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
        className="px-3 py-1.5 bg-accent text-white text-[11px] font-medium rounded-md hover:bg-accent-hover transition-colors"
      >
        Register
      </a>
    )
  }
  return (
    <button
      onClick={() => alert('Registration will be available soon. Check back later.')}
      className="px-3 py-1.5 bg-accent text-white text-[11px] font-medium rounded-md hover:bg-accent-hover transition-colors"
    >
      Register
    </button>
  )
}
