// FILE: frontend/components/hero-section.tsx
import Link from "next/link"
import { FeaturesSection } from "./features-section"

export function HeroSection() {
  return (
    <>
      {/* =====================================================
          HERO — asymmetric 8:4 grid, massive typography
          ===================================================== */}
      <section className="relative border-b-2 border-black overflow-hidden">

        {/* Grid texture on hero background */}
        <div className="absolute inset-0 swiss-grid-pattern pointer-events-none" aria-hidden="true" />

        <div className="mx-auto max-w-7xl">

          {/* Section label */}
          <div className="border-b-2 border-black px-6 py-3 md:px-12">
            <span className="swiss-section-number">01. System</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12">

            {/* LEFT — massive headline (8 cols) */}
            <div className="col-span-8 border-b-2 border-black px-6 py-16 md:border-b-0 md:border-r-2 md:px-12 md:py-24">
              <h1 className="font-black leading-none tracking-tighter text-black uppercase">
                <span className="block text-6xl md:text-8xl lg:text-[7rem] xl:text-[9rem]">Cut</span>
                <span className="block text-6xl md:text-8xl lg:text-[7rem] xl:text-[9rem] text-[#FF3000]">Through</span>
                <span className="block text-6xl md:text-8xl lg:text-[7rem] xl:text-[9rem]">The</span>
                <span className="block text-6xl md:text-8xl lg:text-[7rem] xl:text-[9rem]">Red Tape.</span>
              </h1>
            </div>

            {/* RIGHT — body copy + CTAs (4 cols) */}
            <div className="col-span-4 flex flex-col justify-between px-6 py-16 md:px-10 md:py-24">

              {/* Geometric composition — Bauhaus-style abstract */}
              <div className="relative mb-10 h-40 w-full swiss-dots overflow-hidden border-2 border-black" aria-hidden="true">
                <div className="absolute top-4 left-4 h-20 w-20 border-4 border-black" />
                <div className="absolute bottom-4 right-4 h-16 w-16 bg-[#FF3000]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-px w-full bg-black" />
                <div className="absolute top-4 right-4 h-8 w-8 bg-black" />
              </div>

              <p className="mb-10 text-sm leading-relaxed text-black/70 font-medium">
                AI-powered legal analysis for Indian citizens.
                Upload contracts, identify risky clauses, and generate
                professional legal notices — instantly.
              </p>

              <div className="flex flex-col gap-3">
                <Link href="/analyze" className="swiss-btn-primary justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M1 7a6 6 0 1 0 12 0A6 6 0 0 0 1 7zm4-2h4M7 5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Analyze Document
                </Link>
                <Link href="/generate" className="swiss-btn-secondary justify-center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 2h10v2H2zM2 6h6v2H2zM2 10h8v2H2z" fill="currentColor"/>
                  </svg>
                  Generate Notice
                </Link>
              </div>
            </div>

          </div>

          {/* Stat bar */}
          <div className="grid grid-cols-3 border-t-2 border-black">
            {[
              { value: "10s", label: "Analysis time" },
              { value: "6+", label: "Notice types" },
              { value: "100%", label: "Free to use" },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center py-6 ${i < 2 ? "border-r-2 border-black" : ""}`}
              >
                <span className="text-3xl font-black tracking-tighter md:text-4xl">{stat.value}</span>
                <span className="swiss-label text-[#FF3000] mt-1">{stat.label}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Features section is part of home page flow */}
      <FeaturesSection />
    </>
  )
}