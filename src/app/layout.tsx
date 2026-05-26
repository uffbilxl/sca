import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Toaster } from '@/components/ui/Toaster'
import { AnimatedBackground } from '@/components/layout/AnimatedBackground'
import { PageTransition } from '@/components/layout/PageTransition'

export const metadata: Metadata = {
  title: 'SCA Opportunities Tracker | BCU Student Computing Association',
  description: 'Internships, placements, graduate roles, spring weeks and events — curated for computing students at Birmingham City University.',
  keywords: ['internship', 'placement', 'graduate', 'BCU', 'computing', 'tech', 'SCA'],
  openGraph: {
    title: 'SCA Opportunities Tracker',
    description: 'Find your next tech opportunity — built for BCU computing students.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[var(--bg)] text-[var(--t1)] antialiased">
        <AnimatedBackground />
        <Navbar />
        <main><PageTransition>{children}</PageTransition></main>
        <Toaster />
      </body>
    </html>
  )
}
