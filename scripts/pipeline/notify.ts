import type { ImportResults } from '../../src/lib/importOpportunities'

/* Sends a run summary email via Resend's REST API — no SDK dependency,
 * just a plain fetch. Silently no-ops (with a console warning) if the
 * required env vars aren't set, so a missing key never crashes the run. */

interface RunSummary {
  results: ImportResults
  perSource: { name: string; scraped: number; structured: number }[]
  startedAt: Date
  finishedAt: Date
  /* Non-fatal scrape problems (bot challenge, nav timeout, partial capture).
   * A run can succeed and still have silently collected half a source, so
   * these need to be visible even when the import itself reports no errors. */
  warnings?: string[]
  fatalError?: string
}

export async function sendRunSummaryEmail(summary: RunSummary): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.NOTIFY_EMAIL
  const from = process.env.NOTIFY_FROM_EMAIL

  if (!apiKey || !to || !from) {
    console.warn('Skipping email notification: RESEND_API_KEY, NOTIFY_EMAIL, or NOTIFY_FROM_EMAIL not set')
    return
  }

  const durationMin = ((summary.finishedAt.getTime() - summary.startedAt.getTime()) / 60000).toFixed(1)
  const { results } = summary

  const subject = summary.fatalError
    ? `SCA opportunities sync FAILED — ${summary.startedAt.toLocaleDateString('en-GB')}`
    : `SCA opportunities updated: +${results.added} added, ${results.closed} closed`

  const sourceRows = summary.perSource
    .map(s => `<tr><td>${s.name}</td><td>${s.scraped}</td><td>${s.structured}</td></tr>`)
    .join('')

  const html = `
    <h2>SCA opportunity sync — ${summary.startedAt.toLocaleString('en-GB')}</h2>
    ${summary.fatalError ? `<p style="color:#b91c1c"><strong>Run failed:</strong> ${escapeHtml(summary.fatalError)}</p>` : ''}
    <p>Duration: ${durationMin} minutes</p>
    <table cellpadding="6" style="border-collapse:collapse;border:1px solid #ddd">
      <tr style="background:#f4f4f5"><th align="left">Source</th><th align="left">Scraped</th><th align="left">Passed to import</th></tr>
      ${sourceRows}
    </table>
    <h3>Database changes</h3>
    <ul>
      <li>Added: ${results.added}</li>
      <li>Updated (status change): ${results.updated}</li>
      <li>Closed (no longer listed): ${results.closed}</li>
      <li>Skipped (duplicate/incomplete): ${results.skipped}</li>
      <li>Blocked (defence-sector filter): ${results.blocked}</li>
    </ul>
    ${summary.warnings && summary.warnings.length > 0 ? `<h3>Scrape warnings (${summary.warnings.length})</h3><ul>${summary.warnings.slice(0, 20).map(w => `<li>${escapeHtml(w)}</li>`).join('')}</ul>` : ''}
    ${results.errors.length > 0 ? `<h3>Row errors (${results.errors.length})</h3><ul>${results.errors.slice(0, 20).map(e => `<li>${escapeHtml(e)}</li>`).join('')}</ul>` : ''}
  `

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html }),
  })

  if (!res.ok) {
    console.error('Failed to send notification email:', res.status, await res.text())
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
