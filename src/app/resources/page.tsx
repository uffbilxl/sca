import Link from 'next/link'

interface Resource {
  title: string
  description: string
  fileUrl?: string
  pages?: string
}

interface Category {
  id: string
  label: string
  color: string
  icon: string
  resources: Resource[]
}

const CATEGORIES: Category[] = [
  {
    id: 'cv',
    label: 'CV Templates',
    color: '#5b8df5',
    icon: '📄',
    resources: [
      {
        title: '1-Page CV Template',
        description: 'Clean, concise single-page CV — ideal for internships and graduate roles.',
        pages: '1 page',
      },
      {
        title: '2-Page CV Template',
        description: 'Extended format for candidates with more experience or academic projects.',
        pages: '2 pages',
      },
    ],
  },
  {
    id: 'cover-letter',
    label: 'Cover Letters',
    color: '#22c55e',
    icon: '✉️',
    resources: [
      {
        title: 'Cover Letter Template',
        description: 'Professional cover letter structure with guidance on what to include for tech roles.',
      },
    ],
  },
  {
    id: 'guides',
    label: 'Guides',
    color: '#a855f7',
    icon: '📚',
    resources: [
      {
        title: 'More guides coming soon',
        description: 'Interview prep, LinkedIn tips, application strategies and more.',
      },
    ],
  },
]

function PDFIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10,9 9,9 8,9" />
    </svg>
  )
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

export default function ResourcesPage() {
  return (
    <div className="max-w-[900px] mx-auto px-4 sm:px-8 py-7 sm:py-10">
      {/* Header */}
      <div className="mb-10">
        <p className="text-[10px] text-accent uppercase tracking-[0.14em] mb-2">Student Computing Association</p>
        <h1 className="text-[26px] font-black tracking-[-0.6px] text-[var(--t1)] mb-2">Resources</h1>
        <p className="text-[13px] text-[var(--t3)] max-w-lg leading-relaxed">
          Templates and guides to help you land your next opportunity — CVs, cover letters, and more.
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-10">
        {CATEGORIES.map(cat => (
          <section key={cat.id}>
            {/* Section header */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[10px] font-semibold text-[var(--t4)] uppercase tracking-widest">{cat.label}</span>
              <div className="flex-1 h-px bg-[var(--b1)]" />
              <span className="text-[10px] text-[var(--t4)]">{cat.resources.length} {cat.resources.length === 1 ? 'item' : 'items'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cat.resources.map(resource => (
                <div
                  key={resource.title}
                  className="flex flex-col gap-3 p-4 rounded-xl border bg-[var(--bg2)] border-[var(--b1)]"
                >
                  {/* Top row */}
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${cat.color}15`, color: cat.color, border: `1px solid ${cat.color}30` }}
                    >
                      <PDFIcon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-[13px] font-semibold text-[var(--t1)] leading-tight">{resource.title}</p>
                        {resource.pages && (
                          <span className="badge-gray">{resource.pages}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-[var(--t3)] leading-relaxed">{resource.description}</p>
                    </div>
                  </div>

                  {/* Action */}
                  {resource.fileUrl ? (
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium text-white w-fit transition-opacity hover:opacity-90"
                      style={{ background: cat.color }}
                    >
                      <DownloadIcon />
                      Download PDF
                    </a>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-medium text-white w-fit opacity-30 cursor-not-allowed"
                      style={{ background: cat.color }}
                    >
                      <DownloadIcon />
                      Download PDF
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-12 pt-6 border-t border-[var(--b1)]">
        <p className="text-[12px] text-[var(--t4)]">
          Have a resource to contribute?{' '}
          <Link href="https://tally.so/r/681g7e" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            Get in touch →
          </Link>
        </p>
      </div>
    </div>
  )
}
