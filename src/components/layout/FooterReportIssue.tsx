'use client'
import { useState } from 'react'
import { ReportIssueModal } from '@/components/layout/ReportIssueModal'

export function FooterReportIssue() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors text-left focus-ring rounded"
      >
        Report an Issue
      </button>
      {open && <ReportIssueModal onClose={() => setOpen(false)} />}
    </>
  )
}
