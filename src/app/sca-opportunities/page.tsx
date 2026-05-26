export default function SCAOpportunitiesPage() {
  return (
    <div className="max-w-[860px] mx-auto px-8 py-7">
      <div className="mb-7">
        <h1 className="text-[20px] font-black tracking-[-0.4px] text-[var(--t1)]">SCA Opportunities</h1>
        <p className="text-[12px] text-[var(--t3)] mt-1">
          Internal opportunities within the Student Computing Association — committee roles, volunteering, and more.
        </p>
      </div>

      <div className="border border-[var(--b1)] rounded-2xl bg-[var(--bg2)] py-20 px-10 text-center">
        <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-[28px] mx-auto mb-5">
          ◈
        </div>
        <div className="text-[16px] font-semibold text-[var(--t1)] mb-2">Coming soon</div>
        <div className="text-[13px] text-[var(--t3)] max-w-sm mx-auto leading-relaxed">
          The SCA is putting together a list of internal opportunities — from committee positions to
          event roles and volunteering.
          <span className="block mt-2 text-[var(--t2)] font-medium">
            Announcements dropping very soon.
          </span>
        </div>

        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 border border-[var(--b2)] rounded-full text-[11px] text-[var(--t4)] tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
          To be announced by the SCA
        </div>

        <div className="mt-8 pt-8 border-t border-[var(--b1)]">
          <p className="text-[12px] text-[var(--t4)] mb-4">
            Interested in joining the committee in the meantime?
          </p>
          <a
            href="https://tally.so/r/681g7e"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-white text-[13px] font-semibold rounded-xl hover:bg-[var(--acc2)] transition-colors"
          >
            Apply to join the committee →
          </a>
        </div>
      </div>
    </div>
  )
}
