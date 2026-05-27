interface SCALogoProps {
  size?: number
  className?: string
}

export function SCALogo({ size = 28, className = '' }: SCALogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SCA Logo"
    >
      {/* Outer border */}
      <rect x="0.75" y="0.75" width="26.5" height="26.5" stroke="#2a2a2a" strokeWidth="0.5" />

      {/* Corner brackets - top left */}
      <line x1="0.75" y1="0.75" x2="6" y2="0.75" stroke="#f5f5f5" strokeWidth="1.5" />
      <line x1="0.75" y1="0.75" x2="0.75" y2="6" stroke="#f5f5f5" strokeWidth="1.5" />

      {/* Corner brackets - top right */}
      <line x1="27.25" y1="0.75" x2="22" y2="0.75" stroke="#f5f5f5" strokeWidth="1.5" />
      <line x1="27.25" y1="0.75" x2="27.25" y2="6" stroke="#f5f5f5" strokeWidth="1.5" />

      {/* Corner brackets - bottom left */}
      <line x1="0.75" y1="27.25" x2="6" y2="27.25" stroke="#f5f5f5" strokeWidth="1.5" />
      <line x1="0.75" y1="27.25" x2="0.75" y2="22" stroke="#f5f5f5" strokeWidth="1.5" />

      {/* Corner brackets - bottom right */}
      <line x1="27.25" y1="27.25" x2="22" y2="27.25" stroke="#f5f5f5" strokeWidth="1.5" />
      <line x1="27.25" y1="27.25" x2="27.25" y2="22" stroke="#f5f5f5" strokeWidth="1.5" />

      {/* SCA text */}
      <text
        x="14"
        y="18.5"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontWeight="900"
        fontSize="10"
        fill="#f5f5f5"
        letterSpacing="0.5"
      >
        SCA
      </text>
    </svg>
  )
}
