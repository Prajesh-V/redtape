"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyze" },
  { href: "/generate", label: "Generate" },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 md:px-12">

        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-3 group" aria-label="REDTAPE Home">
          {/* Swiss: red square logo mark */}
          <span
            className="flex h-8 w-8 items-center justify-center bg-black text-white transition-colors duration-150 group-hover:bg-[#FF3000]"
            aria-hidden="true"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="0" y="0" width="6" height="6" fill="currentColor"/>
              <rect x="8" y="0" width="6" height="6" fill="currentColor"/>
              <rect x="0" y="8" width="6" height="6" fill="currentColor"/>
              <rect x="8" y="8" width="6" height="6" fill="currentColor"/>
            </svg>
          </span>
          <span className="text-sm font-black tracking-[0.2em] uppercase text-black">
            REDTAPE
          </span>
        </Link>

        {/* Nav links — vertical slide animation on hover */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`relative overflow-hidden text-xs font-bold tracking-[0.15em] uppercase transition-colors duration-150 ${
                  active ? "text-[#FF3000]" : "text-black hover:text-[#FF3000]"
                }`}
              >
                {label}
                {/* Active underline */}
                {active && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#FF3000]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* CTA — primary Swiss button */}
        <Link href="/analyze" className="swiss-btn-primary h-10 px-6 text-[0.65rem]">
          Get Started
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </header>
  )
}
