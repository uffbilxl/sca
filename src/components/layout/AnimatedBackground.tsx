/* Sitewide fixed wallpaper, mounted once in the root layout and visible
   behind every page. This is distinct from the homepage hero's own art
   (HeroContent.tsx), which stays dark regardless of theme — this layer
   is theme-aware so pages without their own opaque background don't get
   dark bleed-through in light mode. */
export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      {/* Base gradient — gives every page depth vs a flat fill */}
      <div className="absolute inset-0" style={{ background: 'var(--wash-base)' }} />
      {/* Persistent top indigo bloom — visible on every page */}
      <div className="absolute inset-0" style={{ background: 'var(--wash-top)' }} />
      {/* Subtle purple accent — bottom right */}
      <div className="absolute inset-0" style={{ background: 'var(--wash-purple)' }} />
      {/* Blue-teal — bottom left */}
      <div className="absolute inset-0" style={{ background: 'var(--wash-blue)' }} />
    </div>
  )
}
