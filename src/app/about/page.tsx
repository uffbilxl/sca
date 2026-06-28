import Link from 'next/link'

const values = [
  {
    title: 'Inclusive by design',
    text: 'The SCA is open to every BCU computing student, regardless of year, background, or experience level. Whether you are just starting out or finishing your final year, there is a place for you here.',
  },
  {
    title: 'Student-led, student-first',
    text: 'We are run entirely by students who have been in your position. Every decision we make is driven by what is genuinely useful to you, not what looks good on paper.',
  },
  {
    title: 'Community over competition',
    text: 'We believe the tech industry is better when people support each other. We share opportunities openly, celebrate each other\'s wins, and build a network that lasts beyond graduation.',
  },
]

const whatWeDo = [
  {
    label: 'Opportunities',
    desc: 'We curate internships, placements, graduate schemes, spring weeks, and insight programmes from across the UK tech industry, keeping everything in one place so you never miss a role.',
    href: '/opportunities',
  },
  {
    label: 'Events',
    desc: 'From industry panels and workshops to networking nights and hackathons, we run events throughout the year to help you build skills and connections that matter.',
    href: '/events',
  },
  {
    label: 'Career resources',
    desc: 'CV templates, cover letter guides, and practical career advice created specifically for computing students. Everything you need to put your best foot forward.',
    href: '/resources',
  },
  {
    label: 'A real community',
    desc: 'Join a network of like-minded students at BCU. Share experiences, ask questions, find collaborators for projects, and support each other through the highs and lows of university life.',
    href: '/committee',
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-[860px] mx-auto px-4 sm:px-8 py-7 sm:py-12">

      {/* Header */}
      <div className="mb-12">
        <p className="text-[10px] font-mono text-[var(--t4)] uppercase tracking-[0.14em] mb-2">// Birmingham City University</p>
        <h1 className="font-display text-[30px] sm:text-[38px] font-black tracking-[-0.8px] text-[var(--t1)] mb-4 leading-tight">
          Who We Are
        </h1>
        <p className="text-[15px] text-[var(--t2)] leading-relaxed max-w-[600px]">
          The Student Computing Association (SCA) is the computing society at Birmingham City University. We exist to support, connect, and empower every student in the computing faculty.
        </p>
      </div>

      {/* Mission */}
      <section className="mb-12 p-6 sm:p-8 border border-[var(--b1)] border-l-2 border-l-[var(--t1)]">
        <p className="text-[10px] font-mono text-[var(--t4)] uppercase tracking-[0.14em] mb-3">// our mission</p>
        <p className="font-display text-[16px] sm:text-[18px] font-semibold text-[var(--t1)] leading-relaxed">
          To make the path from BCU student to tech professional as clear, supported, and accessible as possible — for everyone.
        </p>
      </section>

      {/* What we do */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] font-mono font-medium text-[var(--t4)] uppercase tracking-widest">// what we do</span>
          <div className="flex-1 h-px bg-[var(--b1)]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {whatWeDo.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex flex-col gap-2 p-5 border border-[var(--b1)] bg-[var(--bg)] hover:border-[var(--t1)] hover:bg-[var(--bg2)] transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-[13px] font-semibold text-[var(--t1)]">{item.label}</span>
                <span className="text-[var(--t4)] group-hover:text-[var(--t1)] transition-colors">→</span>
              </div>
              <p className="text-[12px] text-[var(--t3)] leading-relaxed">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] font-mono font-medium text-[var(--t4)] uppercase tracking-widest">// our values</span>
          <div className="flex-1 h-px bg-[var(--b1)]" />
        </div>
        <div className="flex flex-col gap-3">
          {values.map((v, i) => (
            <div key={v.title} className="flex gap-5 p-5 border border-[var(--b1)] bg-[var(--bg)]">
              <div className="text-[10px] font-mono text-[var(--t4)] uppercase tracking-[0.14em] pt-0.5 flex-shrink-0 w-6">0{i + 1}</div>
              <div>
                <div className="font-display text-[13px] font-semibold text-[var(--t1)] mb-1.5">{v.title}</div>
                <div className="text-[12px] text-[var(--t3)] leading-relaxed">{v.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* A note on opportunities */}
      <section className="mb-12 p-5 border border-[var(--b1)] border-l-2 border-l-amber-700/60">
        <p className="text-[10px] font-mono text-amber-700/80 uppercase tracking-[0.14em] mb-2">// our position</p>
        <p className="text-[13px] text-[var(--t2)] leading-relaxed">
          We aim to share as many opportunities as possible, but we are selective about what we promote. We will not list roles from defence companies. We believe every student deserves access to opportunity, and we take seriously our responsibility in shaping what that looks like.
        </p>
      </section>

      {/* Get involved */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] font-mono font-medium text-[var(--t4)] uppercase tracking-widest">// get involved</span>
          <div className="flex-1 h-px bg-[var(--b1)]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-5 border border-[var(--b1)] bg-[var(--bg)]">
            <div className="font-display text-[13px] font-semibold text-[var(--t1)] mb-1.5">Join the SCA</div>
            <p className="text-[12px] text-[var(--t3)] leading-relaxed mb-4">
              Open to all BCU computing students. Follow us on LinkedIn and stay up to date with everything we are doing.
            </p>
            <Link
              href="https://www.linkedin.com/company/bcu-student-computing-association/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--t1)] hover:underline"
            >
              Follow on LinkedIn →
            </Link>
          </div>
          <div className="p-5 border border-[var(--b1)] bg-[var(--bg)]">
            <div className="font-display text-[13px] font-semibold text-[var(--t1)] mb-1.5">Join the committee</div>
            <p className="text-[12px] text-[var(--t3)] leading-relaxed mb-4">
              Want to help shape the SCA? We are always looking for students to join the committee and contribute to what we build.
            </p>
            <Link
              href="https://tally.so/r/681g7e"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--t1)] hover:underline"
            >
              Apply here →
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
