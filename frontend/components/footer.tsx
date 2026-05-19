// FILE: frontend/components/footer.tsx
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t-2 border-black">
      <div className="mx-auto max-w-7xl">

        {/* Main footer row - beautifully centered branding, no bypass navigation */}
        <div className="border-b-2 border-black px-6 py-12 md:px-12 flex flex-col items-center justify-center text-center swiss-diagonal">
          <div className="flex flex-col items-center justify-center">
            
            {/* Centered logo */}
            <div className="mb-4 flex items-center gap-3 justify-center group">
              <span className="flex h-8 w-8 items-center justify-center bg-black transition-colors duration-150 group-hover:bg-[#FF3000]" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                  <rect x="0" y="0" width="6" height="6"/>
                  <rect x="8" y="0" width="6" height="6"/>
                  <rect x="0" y="8" width="6" height="6"/>
                  <rect x="8" y="8" width="6" height="6"/>
                </svg>
              </span>
              <span className="text-sm font-black tracking-[0.2em] uppercase select-none">REDTAPE</span>
            </div>
            
            {/* Description */}
            <p className="text-xs font-medium leading-relaxed text-black/50 max-w-md">
              AI-powered legal document analysis and notice generation
              for Indian citizens. Cut through the red tape.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 px-6 py-6 md:flex-row md:px-12">
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
