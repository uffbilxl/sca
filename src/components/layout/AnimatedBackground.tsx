export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
      {/* Base dark gradient — gives every page depth vs flat black */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(160deg, #05050d 0%, #000000 40%, #050510 100%)',
        }}
      />
      {/* Persistent top indigo bloom — visible on every page */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.05) 40%, transparent 65%)',
        }}
      />
      {/* Subtle purple accent — bottom right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 92% 85%, rgba(168,85,247,0.1) 0%, transparent 55%)',
        }}
      />
      {/* Blue-teal — bottom left */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 45% 35% at 5% 90%, rgba(59,130,246,0.07) 0%, transparent 55%)',
        }}
      />
    </div>
  )
}
