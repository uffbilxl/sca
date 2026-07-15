'use client'
import { RefObject } from 'react'
import { CVData, CVEntry, SectionKey, SECTION_TITLES } from '@/lib/cv'

/* A4 at 96dpi */
export const PAGE_W = 794
export const PAGE_H = 1123

export type Density = 0 | 1 | 2

/* Spacing/type scale per density level — level rises only when content
   would overflow the page, mimicking "auto one-page optimisation". */
const D = [
  { font: 12.5, lh: 1.45, sectionGap: 18, entryGap: 11, bulletGap: 3, namePt: 30, padY: 54, padX: 62 },
  { font: 12,   lh: 1.34, sectionGap: 13, entryGap: 8,  bulletGap: 2, namePt: 28, padY: 46, padX: 58 },
  { font: 11.5, lh: 1.26, sectionGap: 10, entryGap: 6,  bulletGap: 1, namePt: 26, padY: 38, padX: 54 },
] as const

interface Props {
  data: CVData
  density: Density
  innerRef: RefObject<HTMLDivElement>
}

function hasEntries(entries: CVEntry[]) {
  return entries.some(e => e.org.trim() || e.role.trim() || e.bullets.some(b => b.trim()))
}

export function CVPreview({ data, density, innerRef }: Props) {
  const d = D[density]

  const contactParts = [data.email, data.phone, data.linkedin, data.github, data.portfolio]
    .map(s => s.trim())
    .filter(Boolean)

  const sectionVisible: Record<SectionKey, boolean> = {
    summary: data.summary.trim().length > 0,
    education: hasEntries(data.education),
    experience: hasEntries(data.experience),
    extracurricular: hasEntries(data.extracurricular),
    skills: data.skills.some(s => s.value.trim()),
  }

  const sectionTitle = (key: SectionKey) => (
    <h2
      style={{
        fontSize: d.font + 1,
        fontWeight: 700,
        textTransform: 'uppercase',
        textDecoration: 'underline',
        textUnderlineOffset: 2,
        marginTop: d.sectionGap,
        marginBottom: Math.max(4, d.entryGap - 3),
        letterSpacing: '0.02em',
      }}
    >
      {SECTION_TITLES[key]}
    </h2>
  )

  const entryBlock = (e: CVEntry, last: boolean) => (
    <div key={e.id} style={{ marginBottom: last ? 0 : d.entryGap }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontWeight: 700 }}>{e.org}</span>
        <span style={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{e.location}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontStyle: 'italic' }}>{e.role}</span>
        <span style={{ whiteSpace: 'nowrap' }}>{e.dates}</span>
      </div>
      <ul style={{ margin: `${d.bulletGap}px 0 0`, paddingLeft: 22, listStyleType: 'disc' }}>
        {e.bullets.filter(b => b.trim()).map((b, i) => (
          <li key={i} style={{ marginBottom: d.bulletGap }}>{b}</li>
        ))}
      </ul>
    </div>
  )

  const renderSection = (key: SectionKey) => {
    if (!sectionVisible[key]) return null
    switch (key) {
      case 'summary':
        return (
          <section key={key}>
            {sectionTitle(key)}
            <p>{data.summary}</p>
          </section>
        )
      case 'education':
      case 'experience':
      case 'extracurricular': {
        const entries = data[key].filter(e => e.org.trim() || e.role.trim() || e.bullets.some(b => b.trim()))
        return (
          <section key={key}>
            {sectionTitle(key)}
            {entries.map((e, i) => entryBlock(e, i === entries.length - 1))}
          </section>
        )
      }
      case 'skills':
        return (
          <section key={key}>
            {sectionTitle(key)}
            <table style={{ borderCollapse: 'collapse' }}>
              <tbody>
                {data.skills.filter(s => s.value.trim()).map(s => (
                  <tr key={s.id}>
                    <td style={{ fontStyle: 'italic', paddingRight: 18, verticalAlign: 'top', whiteSpace: 'nowrap' }}>
                      {s.label}:
                    </td>
                    <td>{s.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )
    }
  }

  return (
    <div
      id="cv-print-area"
      style={{
        width: PAGE_W,
        minHeight: PAGE_H,
        background: '#ffffff',
        color: '#000000',
        fontFamily: '"Times New Roman", Times, Georgia, serif',
        fontSize: d.font,
        lineHeight: d.lh,
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
      }}
    >
      <div ref={innerRef} style={{ padding: `${d.padY}px ${d.padX}px` }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: d.namePt, fontWeight: 400, letterSpacing: '0.04em', lineHeight: 1.15 }}>
            {data.name || 'YOUR NAME'}
          </h1>
          {contactParts.length > 0 && (
            <p style={{ marginTop: 2 }}>{contactParts.join(' | ')}</p>
          )}
        </div>

        {data.sectionOrder.map(renderSection)}
      </div>
    </div>
  )
}
