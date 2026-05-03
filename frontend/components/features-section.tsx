// FILE: frontend/components/features-section.tsx

const features = [
  {
    number: "01",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    title: "Risk Detection",
    description: "Automatically identifies financially dangerous clauses, unfair restrictions, and red-flag terms inside any legal document.",
  },
  {
    number: "02",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    title: "Instant Generation",
    description: "Describe your issue in plain language. Our AI drafts a formal, structured legal notice ready for professional delivery.",
  },
  {
    number: "03",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: "Minutes, Not Hours",
    description: "Reduce days of legal document review to under 60 seconds with intelligent, AI-driven clause-by-clause analysis.",
  },
  {
    number: "04",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="15" x2="15" y2="15"/>
      </svg>
    ),
    title: "PDF Ready",
    description: "Export your analyzed or generated documents as professionally typeset, court-ready PDFs with a single click.",
  },
]

export function FeaturesSection() {
  return (
    <section className="border-b-2 border-black">
      <div className="mx-auto max-w-7xl">

        {/* Section label row */}
        <div className="flex items-center justify-between border-b-2 border-black px-6 py-3 md:px-12">
          <span className="swiss-section-number">02. Method</span>
          <span className="swiss-label text-black/40">Four Pillars</span>
        </div>

        {/* Section header — asymmetric layout */}
        <div className="grid grid-cols-1 border-b-2 border-black md:grid-cols-12">
          <div className="col-span-7 px-6 py-12 md:border-r-2 md:border-black md:px-12">
            <h2 className="font-black text-5xl md:text-6xl lg:text-7xl tracking-tighter uppercase leading-none">
              Why<br />REDTAPE?
            </h2>
          </div>
          <div className="col-span-5 flex items-end px-6 py-12 md:px-10 swiss-diagonal">
            <p className="text-sm leading-relaxed font-medium text-black/60 max-w-xs">
              Powerful capabilities designed to simplify your legal document
              workflow — without a lawyer's hourly rate.
            </p>
          </div>
        </div>

        {/* Feature cards grid — 2 columns on tablet+, 4 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.number}
              className={`group relative p-8 transition-colors duration-150 hover:bg-black hover:text-white cursor-default
                ${i < features.length - 1 ? "border-b-2 md:border-b-0 border-black lg:border-r-2" : ""}
                ${i === 1 ? "md:border-r-2 border-black" : ""}
                ${i < 2 ? "md:border-b-2 lg:border-b-0 border-black" : ""}
              `}
            >
              {/* Number label */}
              <span className="swiss-section-number mb-6 block transition-colors duration-150 group-hover:text-[#FF3000]">
                {f.number}
              </span>

              {/* Icon in geometric frame */}
              <div className="mb-6 flex h-12 w-12 items-center justify-center border-2 border-current transition-colors duration-150">
                {f.icon}
              </div>

              <h3 className="mb-3 text-lg font-black uppercase tracking-tight">{f.title}</h3>
              <p className="text-sm leading-relaxed font-medium text-black/60 transition-colors duration-150 group-hover:text-white/70">
                {f.description}
              </p>

              {/* Arrow — appears on hover */}
              <div className="mt-6 flex items-center gap-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                <div className="h-px flex-1 bg-white/40" />
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
