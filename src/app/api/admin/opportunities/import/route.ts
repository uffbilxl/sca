import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { OpportunityType, WorkMode, Status } from '@prisma/client'

// ─── Defence company blocklist ───────────────────────────────────────────────
const DEFENCE_BLOCKLIST = new Set([
  'bae systems', 'leonardo', 'ultra', 'ultra electronics',
  'lockheed martin', 'raytheon', 'rtx', 'northrop grumman',
  'general dynamics', 'l3harris', 'qinetiq', 'dstl', 'mbda',
  'thales', 'saab', 'rheinmetall', 'elbit systems',
  'rafael', 'airbus defence', 'airbus defence and space',
  'serco', 'leidos', 'saic', 'dyncorp', 'mantech',
  'rolls-royce defence', 'cobham', 'ultra intelligence',
  'chemring', 'meggitt', 'avon protection',
])

function isDefenceCompany(name: string): boolean {
  return DEFENCE_BLOCKLIST.has(name.trim().toLowerCase())
}

// ─── URL normalisation ───────────────────────────────────────────────────────
function normalizeUrl(url: string): string {
  return url.trim().toLowerCase().replace(/\/+$/, '')
}

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

function field(row: Record<string, string>, ...keys: string[]): string {
  for (const k of keys) {
    const norm = k.toLowerCase().replace(/[^a-z0-9]+/g, '')
    if (row[norm] !== undefined && row[norm] !== '') return row[norm]
  }
  return ''
}

// ─── Type inference ───────────────────────────────────────────────────────────
function inferType(raw: string): OpportunityType {
  const t = raw.toLowerCase()
  if (t.includes('spring week') || t.includes('spring insight')) return 'SPRING_WEEK'
  if (t.includes('insight week')) return 'INSIGHT'
  if (t.includes('placement') || t.includes('industrial placement') || t.includes('year in industry')) return 'PLACEMENT'
  if (t.includes('graduate') || t.includes('grad ') || t.includes('new grad') || t.includes('new analyst') || t.includes('apprenticeship')) return 'GRADUATE'
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
      blocked: 0,
      errors: [] as string[],
    }

    // Collect all normalised URLs from the CSV for the "close unlisted" pass at the end
    const csvUrls = new Set<string>()
    const seenUrls = new Set<string>()

    for (const row of rows) {
      const title = field(row, 'opportunity name', 'title', 'role', 'job title', 'position', 'job')
      const companyName = field(row, 'company name', 'company', 'employer', 'organization', 'organisation')
      const rawType = field(row, 'opportunity type', 'type', 'category', 'kind')
      const location = field(row, 'location', 'city', 'place', 'region') || 'United Kingdom'
      const applyUrl = field(row, 'direct apply link', 'apply url', 'apply link', 'url', 'link', 'applyurl', 'applicationurl', 'apply')
      const startDate = field(row, 'estimated start date', 'start date', 'startdate', 'start')
      const deadlineRaw = field(row, 'application deadline', 'deadline', 'closing date', 'closes')
      const logoUrl = field(row, 'company logo png url', 'logo', 'logo url', 'company logo')
      const companyWebsite = field(row, 'company website', 'website', 'company url')
      const rawWorkMode = field(row, 'work mode', 'workmode', 'mode', 'remote')
      const rawStatus = field(row, 'status', 'open/closed', 'state')
      const rawFeatured = field(row, 'featured')
      const rawSponsored = field(row, 'sponsored')

      if (!title || !companyName) { results.skipped++; continue }

      // Block defence companies
      if (isDefenceCompany(companyName)) {
        results.blocked++
        continue
      }

      // Normalise URL and dedupe within this import
      const normUrl = applyUrl ? normalizeUrl(applyUrl) : ''
      if (normUrl) {
        csvUrls.add(normUrl)
        if (seenUrls.has(normUrl)) { results.skipped++; continue }
        seenUrls.add(normUrl)
      }

      const type = inferType(rawType)
      const workMode = normalizeWorkMode(rawWorkMode)
      const status = normalizeStatus(rawStatus)
      const featured = ['true', '1', 'yes'].includes(rawFeatured.toLowerCase())
      const sponsored = ['true', '1', 'yes'].includes(rawSponsored.toLowerCase())

      let deadline: Date | null = null
      if (deadlineRaw && deadlineRaw.toLowerCase() !== 'rolling') {
        const d = new Date(deadlineRaw)
        if (!isNaN(d.getTime())) deadline = d
      }

      const description = `${title} at ${companyName}. Based in ${location}.`

      try {
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

        // Find existing by normalised URL or title+company
        const existing = normUrl
          ? await prisma.opportunity.findFirst({ where: { applyUrl: { equals: applyUrl, mode: 'insensitive' } } })
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

        // Generate unique slug
        const baseSlug = toSlug(`${companySlug}-${toSlug(title)}`)
        let slug = baseSlug
        let n = 0
        while (await prisma.opportunity.findFirst({ where: { slug } })) {
          n++
          slug = `${baseSlug.substring(0, 55)}-${n}`
        }

        await prisma.opportunity.create({
          data: {
            title, slug, description, type, location, workMode, status,
            featured, sponsored,
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

    // ── Close anything currently OPEN that wasn't in this CSV ────────────────
    // Only applies to entries that have an applyUrl (so we can match them)
    if (csvUrls.size > 0) {
      const openWithUrl = await prisma.opportunity.findMany({
        where: { status: { not: 'CLOSED' }, applyUrl: { not: null } },
        select: { id: true, applyUrl: true },
      })

      for (const entry of openWithUrl) {
        if (!entry.applyUrl) continue
        if (!csvUrls.has(normalizeUrl(entry.applyUrl))) {
          await prisma.opportunity.update({ where: { id: entry.id }, data: { status: 'CLOSED' } })
          results.closed++
        }
      }
    }

    return NextResponse.json(results)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
