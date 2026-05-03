// FILE: frontend/components/footer.tsx
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t-2 border-black">
      <div className="mx-auto max-w-7xl">

        {/* Main footer row */}
        <div className="grid grid-cols-1 md:grid-cols-12 border-b-2 border-black">

          {/* Brand block */}
          <div className="col-span-5 px-6 py-10 md:border-r-2 md:border-black md:px-12">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center bg-black" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                  <rect x="0" y="0" width="6" height="6"/>
                  <rect x="8" y="0" width="6" height="6"/>
                  <rect x="0" y="8" width="6" height="6"/>
                  <rect x="8" y="8" width="6" height="6"/>
                </svg>
              </span>
              <span className="text-sm font-black tracking-[0.2em] uppercase">REDTAPE</span>
            </div>
            <p className="text-xs font-medium leading-relaxed text-black/50 max-w-xs">
              AI-powered legal document analysis and notice generation
              for Indian citizens. Cut through the red tape.
            </p>
          </div>

          {/* Navigation */}
          <div className="col-span-3 px-6 py-10 md:border-r-2 md:border-black md:px-10">
            <p className="swiss-label mb-4 text-[#FF3000]">Navigate</p>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              {[
                { href: "/", label: "Home" },
                { href: "/analyze", label: "Analyze Document" },
                { href: "/generate", label: "Generate Notice" },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-xs font-bold uppercase tracking-wider text-black transition-colors duration-150 hover:text-[#FF3000]"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="col-span-4 px-6 py-10 md:px-10 swiss-dots">
            <p className="swiss-label mb-4 text-[#FF3000]">Disclaimer</p>
            <p className="text-xs font-medium leading-relaxed text-black/50">
              REDTAPE provides AI-assisted legal information for educational
              purposes only. It does not constitute legal advice. Always consult
              a qualified legal professional for matters affecting your rights.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-start justify-between gap-3 px-6 py-4 md:flex-row md:items-center md:px-12">
          <p className="swiss-label text-black/40">
            © {new Date().getFullYear()} REDTAPE. All rights reserved.
          </p>
          <p className="swiss-label text-black/30">
            Built for Indian Citizens
          </p>
        </div>

      </div>
    </footer>
  )
}
