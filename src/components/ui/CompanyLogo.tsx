'use client'
import { useState } from 'react'

interface CompanyLogoProps {
  name: string
  logoUrl?: string | null
  size?: number
  className?: string
}

export function CompanyLogo({ name, logoUrl, size = 36, className = '' }: CompanyLogoProps) {
  const [errored, setErrored] = useState(false)

  if (logoUrl && !errored) {
    return (
      <img
        src={logoUrl}
        alt={name}
        width={size}
        height={size}
        onError={() => setErrored(true)}
        style={{
          width: size,
          height: size,
          borderRadius: 8,
          objectFit: 'contain',
          background: '#fff',
          padding: Math.round(size * 0.08),
          flexShrink: 0,
        }}
        className={className}
      />
    )
  }

  return (
    <div
      style={{ width: size, height: size, borderRadius: 8, fontSize: size * 0.45, flexShrink: 0 }}
      className={`bg-[var(--bg4)] border border-[var(--b2)] flex items-center justify-center font-bold text-[var(--t2)] ${className}`}
    >
      {name[0]}
    </div>
  )
}
