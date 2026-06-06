import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { OpportunityType, WorkMode, Status } from '@prisma/client'

// ─── CSV parsing ─────────────────────────────────────────────────────────────

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
  // Normalise headers: lowercase, strip non-alphanumeric so we can match flexibly
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

// Looks up a field by trying multiple normalised key variants
function field(row: Record<string, string>, ...keys: string[]): string {
  for (const k of keys) {
    const norm = k.toLowerCase().replace(/[^a-z0-9]+/g, '')
    if (row[norm] !== undefined && row[norm] !== '') return row[norm]
  }
  return ''
}

// ─── Type inference from descriptive string ──────────────────────────────────

function inferType(raw: string): OpportunityType {
  const t = raw.toLowerCase()
  if (t.includes('spring week') || t.includes('spring insight')) return 'SPRING_WEEK'
  if (t.includes('insight week')) return 'INSIGHT'
  // "placement" before "internship" so "industrial placement" wins over generic intern
  if (t.includes('placement') || t.includes('industrial placement') || t.includes('year in industry')) return 'PLACEMENT'
  if (
    t.includes('graduate') || t.includes('grad ') || t.includes('new grad') ||
    t.includes('graduate scheme') || t.includes('apprenticeship') || t.includes('new analyst')
  ) return 'GRADUATE'
  // Fall back to internship for anything with intern / internship / summer / phd intern etc.
  return 'INTERNSHIP'
}

function normalizeWorkMode(raw: string): WorkMode {
  const t = raw.trim().toUpperCase().replace(/[\s-]+/g, '_')
  if (t === 'REMOTE') return 'REMOTE'
  if (['ONSITE', 'ON_SITE', 'IN_PERSON', 'IN_OFFICE', 'OFFICE'].includes(t)) return 'ONSITE'
  return 'HYBRID'
}

function normalizeStatus(raw: string): Status {
  const t = raw.trim().toUpperCase()
  if (t === 'CLOSED' || t === 'CLOSE' || t === 'EXPIRED') return 'CLOSED'
  if (t === 'CLOSING_SOON' || t === 'CLOSING SOON' || t === 'CLOSING') return 'CLOSING_SOON'
  return 'OPEN'
}

function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 60)
}

function getDomain(url: string): string {
  try { return new URL(url).hostname.replace('www.', '') } catch { return '' }
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

    const results = {
      added: 0,
      updated: 0,
      closed: 0,
      skipped: 0,
      errors: [] as string[],
    }

    const seenUrls = new Set<string>()

    for (const row of rows) {
      // ── Field extraction ─────────────────────────────────────────────────
      // Supports both the SCA CSV headings AND generic alternatives
      const title = field(row,
        'opportunity name',       // SCA CSV
        'title', 'role', 'job title', 'position', 'job'
      )
      const companyName = field(row,
        'company name',           // SCA CSV
        'company', 'employer', 'organization', 'organisation'
      )
      const rawType = field(row,
        'opportunity type',       // SCA CSV
        'type', 'category', 'kind'
      )
      const location = field(row,
        'location',               // SCA CSV (same)
        'city', 'place', 'region'
      ) || 'United Kingdom'
      const applyUrl = field(row,
        'direct apply link',      // SCA CSV
        'apply url', 'apply link', 'url', 'link', 'applyurl', 'applicationurl', 'apply'
      )
      const startDate = field(row,
        'estimated start date',   // SCA CSV
        'start date', 'startdate', 'start', 'start year'
      )
      const deadlineRaw = field(row,
        'application deadline',   // SCA CSV
        'deadline', 'closing date', 'closes', 'close date'
      )
      const logoUrl = field(row,
        'company logo png url',   // SCA CSV
        'logo', 'logo url', 'company logo'
      )
      const companyWebsite = field(row,
        'company website',        // SCA CSV
        'website', 'company url'
      )
      const rawWorkMode = field(row,
        'work mode', 'workmode', 'mode', 'remote', 'remote/hybrid/onsite'
      )
      const rawStatus = field(row,
        'status', 'open/closed', 'state'
      )
      const rawFeatured = field(row, 'featured')
      const rawSponsored = field(row, 'sponsored')

      // ── Validation ───────────────────────────────────────────────────────
      if (!title || !companyName) {
        results.errors.push(`Skipped: missing title or company`)
        results.skipped++
        continue
      }

      // Dedupe within this import by URL
      if (applyUrl) {
        if (seenUrls.has(applyUrl)) { results.skipped++; continue }
        seenUrls.add(applyUrl)
      }

      const type = inferType(rawType)
      const workMode = normalizeWorkMode(rawWorkMode)
      const status = normalizeStatus(rawStatus)
      const featured = ['true', '1', 'yes'].includes(rawFeatured.toLowerCase())
      const sponsored = ['true', '1', 'yes'].includes(rawSponsored.toLowerCase())

      // "Rolling" deadline → null; otherwise try to parse a real date
      let deadline: Date | null = null
      if (deadlineRaw && deadlineRaw.toLowerCase() !== 'rolling') {
        const d = new Date(deadlineRaw)
        if (!isNaN(d.getTime())) deadline = d
      }

      const description = `${title} at ${companyName}. Based in ${location}.`

      try {
        // ── Upsert company ───────────────────────────────────────────────
        const companySlug = toSlug(companyName)
        const domain = applyUrl ? getDomain(applyUrl) : companyWebsite ? getDomain(companyWebsite) : ''
        const logo = logoUrl || (domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=256` : null)

        const company = await prisma.company.upsert({
          where: { slug: companySlug },
          update: { logo: logo ?? undefined, website: companyWebsite || undefined },
          create: {
            name: companyName,
            slug: companySlug,
            logo,
            website: companyWebsite || (domain ? `https://${domain}` : null),
          },
        })

        // ── Check for existing entry ─────────────────────────────────────
        const existing = applyUrl
          ? await prisma.opportunity.findFirst({ where: { applyUrl } })
          : await prisma.opportunity.findFirst({ where: { title, companyId: company.id } })

        if (existing) {
          if (status === 'CLOSED' && existing.status !== 'CLOSED') {
            await prisma.opportunity.update({ where: { id: existing.id }, data: { status: 'CLOSED' } })
            results.closed++
          } else if (status !== 'CLOSED' && existing.status !== status) {
            await prisma.opportunity.update({ where: { id: existing.id }, data: { status } })
            results.updated++
          } else {
            results.skipped++
          }
          continue
        }

        // ── Generate unique slug ─────────────────────────────────────────
        const baseSlug = toSlug(`${companySlug}-${toSlug(title)}`)
        let slug = baseSlug
        let n = 0
        while (await prisma.opportunity.findFirst({ where: { slug } })) {
          n++
          slug = `${baseSlug.substring(0, 55)}-${n}`
        }

        await prisma.opportunity.create({
          data: {
            title,
            slug,
            description,
            type,
            location,
            workMode,
            status,
            featured,
            sponsored,
            applyUrl: applyUrl || null,
            startDate: startDate || null,
            deadline,
            companyId: company.id,
          },
        })
        results.added++
      } catch (err) {
        results.errors.push(`Error on "${title}": ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    return NextResponse.json(results)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
