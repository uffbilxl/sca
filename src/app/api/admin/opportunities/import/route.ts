import { NextRequest, NextResponse } from 'next/server'
import { importOpportunityRows } from '@/lib/importOpportunities'

// ─── CSV parsing (upload-specific; the core import logic lives in
//     src/lib/importOpportunities.ts and is shared with the scrape pipeline) ─
function parseCSVRow(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (c === ',' && !inQuotes) {
      result.push(current); current = ''
    } else {
      current += c
    }
  }
  result.push(current)
  return result
}

function parseCSV(text: string): Record<string, string>[] {
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim())
  if (lines.length < 2) return []
  const rawHeaders = parseCSVRow(lines[0])
  const headers = rawHeaders.map(h => h.trim().toLowerCase().replace(/[^a-z0-9]+/g, ''))
  const rows: Record<string, string>[] = []
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVRow(lines[i])
    if (values.every(v => !v.trim())) continue
    const row: Record<string, string> = {}
    headers.forEach((h, j) => { row[h] = (values[j] ?? '').trim() })
    rows.push(row)
  }
  return rows
}

// ─── Handler ─────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })

    const text = await file.text()
    const rows = parseCSV(text)
    if (rows.length === 0) return NextResponse.json({ error: 'Empty or invalid CSV' }, { status: 400 })

    const results = await importOpportunityRows(rows)
    return NextResponse.json(results)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
