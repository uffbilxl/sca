import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Toaster } from '@/components/ui/Toaster'
import { AnimatedBackground } from '@/components/layout/AnimatedBackground'
import { PageTransition } from '@/components/layout/PageTransition'

export const metadata: Metadata = {
  title: 'BCUSCA - Student Computing Association',
  description: 'From your first lecture to your first offer.',
  keywords: ['internship', 'placement', 'graduate', 'BCU', 'computing', 'tech', 'SCA'],
  icons: {
    icon: '/sca-logo.png',
    apple: '/sca-logo.png',
  },
  openGraph: {
    title: 'BCUSCA - Student Computing Association: From your first lecture to your first offer.',
    description: 'From your first lecture to your first offer.',
    type: 'website',
    images: [
      {
        url: '/sca-logo.png',
        width: 1080,
        height: 1080,
        alt: 'BCU Student Computing Association',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'BCUSCA - Student Computing Association: From your first lecture to your first offer.',
    description: 'From your first lecture to your first offer.',
    images: ['/sca-logo.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[var(--bg)] text-[var(--t1)] antialiased">
        <AnimatedBackground />
        <Navbar />
        <main><PageTransition>{children}</PageTransition></main>
        <footer className="py-4 text-center border-t border-[var(--b1)]">
          <span className="text-[11px] text-[var(--t4)]">Made by </span>
          <a
            href="https://keystonedigitalstrategy.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[var(--t3)] hover:text-accent transition-colors"
          >
            Keystone
          </a>
        </footer>
        <Toaster />
      </body>
    </html>
  )
}
