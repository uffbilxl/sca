export default function SCAOpportunitiesPage() {
  return (
    <div className="max-w-[860px] mx-auto px-8 py-7">
      <div className="mb-7">
        <h1 className="text-[20px] font-black tracking-[-0.4px] text-[var(--t1)]">SCA Opportunities</h1>
        <p className="text-[12px] text-[var(--t3)] mt-1">
          Internal opportunities within the Student Computing Association: committee roles, volunteering, and more.
        </p>
      </div>

      {/* Sports Analytics Card */}
      <div className="border border-[var(--b1)] rounded-2xl bg-[var(--bg2)] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[var(--b1)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-semibold text-accent tracking-wide uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
                  Now open
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[var(--bg3)] border border-[var(--b2)] text-[10px] text-[var(--t3)] tracking-wide">
                  AI Division
                </span>
              </div>
              <h2 className="text-[17px] font-bold text-[var(--t1)] tracking-tight">
                SCA Sports Analytics Department
              </h2>
              <p className="text-[12px] text-[var(--t3)] mt-0.5">
                BCU Student Computing Association · BCU Basketball
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Description */}
          <p className="text-[13px] text-[var(--t2)] leading-relaxed">
            A student-led initiative under the AI Division supporting the BCU Basketball team ahead of the 2026/27 BUCS season.
            Successful applicants will take part in a summer pilot programme before the official launch in September.
            Best suited to those with an interest in data and AI.
          </p>

          {/* Roles */}
          <div>
            <p className="text-[11px] font-semibold text-[var(--t4)] uppercase tracking-wider mb-2">Roles available</p>
            <div className="flex flex-wrap gap-2">
              {['Performance Analyst', 'Video Analyst', 'Data Collector'].map(role => (
                <span
                  key={role}
                  className="px-3 py-1 rounded-lg bg-[var(--bg3)] border border-[var(--b2)] text-[12px] text-[var(--t2)] font-medium"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* What you'll do */}
          <div>
            <p className="text-[11px] font-semibold text-[var(--t4)] uppercase tracking-wider mb-2">What you&apos;ll do</p>
            <ul className="space-y-1.5">
              {[
                'Attend fixtures and collect live data',
                'Process and analyse performance data',
                'Contribute to match and opposition reports',
                'Support video analysis and scouting',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-[12px] text-[var(--t2)]">
                  <span className="text-accent mt-0.5 flex-shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Skills & Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-semibold text-[var(--t4)] uppercase tracking-wider mb-2">Expected skills</p>
              <div className="flex flex-wrap gap-1.5">
                {['Python', 'Excel', 'PowerPoint'].map(skill => (
                  <span
                    key={skill}
                    className="px-2.5 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-[11px] text-accent font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-[var(--t4)] mt-1.5">Basic proficiency required</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-[var(--t4)] uppercase tracking-wider mb-2">Experience</p>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-[var(--t3)]">No prior experience required</span>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="rounded-xl bg-[var(--bg3)] border border-[var(--b1)] px-4 py-3">
            <p className="text-[11px] font-semibold text-[var(--t4)] uppercase tracking-wider mb-2">Why apply</p>
            <div className="flex flex-wrap gap-x-5 gap-y-1">
              {[
                'Hands-on real-world experience',
                'Strengthen your CV',
                'Build skills for internships & placements',
              ].map(benefit => (
                <span key={benefit} className="text-[12px] text-[var(--t2)] flex items-center gap-1.5">
                  <span className="text-accent text-[10px]">✦</span>
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer / CTA */}
        <div className="px-6 py-4 border-t border-[var(--b1)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <p className="text-[11px] text-[var(--t4)]">Summer pilot · Official launch September 2026</p>
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--t4)]">
              <span>Organiser:</span>
              <a
                href="mailto:Mohamed.Dahir@mail.bcu.ac.uk"
                className="text-accent hover:underline font-medium"
              >
                Mohamed Dahir
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="mailto:Mohamed.Dahir@mail.bcu.ac.uk"
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-[var(--b2)] rounded-xl text-[12px] text-[var(--t2)] font-medium hover:bg-[var(--bg3)] transition-colors"
            >
              Contact organiser
            </a>
            <a
              href="https://forms.microsoft.com/Pages/ResponsePage.aspx?id=VeArfoqCI0W15bd62ZOXhXzJrZmCHBlEj4k_jYn1UyZUNjFMRjc3OVRDRk1XQkVBVUdRUVlXTzdYNi4u"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 bg-accent text-white text-[13px] font-semibold rounded-xl hover:bg-accent-hover transition-colors"
            >
              Apply now →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
