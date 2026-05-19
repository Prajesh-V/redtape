"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyze" },
  { href: "/generate", label: "Generate" },
  { href: "/courses", label: "Courses" },
  { href: "/ask", label: "Ask AI" },
  { href: "/lawyers", label: "Find Lawyer" },
  { href: "/pricing", label: "Pricing" },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"user" | "lawyer" | null>(null)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const role = localStorage.getItem("redtape_role")
    const name = localStorage.getItem("redtape_username")
    if (role && name) {
      setIsLoggedIn(true)
      setUserRole(role as "user" | "lawyer")
      setUserName(name)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("redtape_role")
    localStorage.removeItem("redtape_username")
    setIsLoggedIn(false)
    setUserRole(null)
    setUserName("")
    router.push("/")
    // Small timeout to allow Next router to navigate before a hard reload to reset state cleanly
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  // Inject "Manage Cases" link for logged-in lawyers, and update "Home" link
  const dynamicLinks = navLinks.map(link => 
    link.label === "Home" ? { ...link, href: isLoggedIn ? "/home" : "/" } : link
  )
  
  if (isLoggedIn && userRole === "lawyer") {
    // Find index of "Find Lawyer" or put it after "Home"
    dynamicLinks.splice(1, 0, { href: "/lawyers/dashboard", label: "Manage Cases" })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-black bg-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 md:px-12">

        {/* Wordmark */}
        <Link href={isLoggedIn ? "/home" : "/"} className="flex items-center gap-3 group" aria-label="REDTAPE Home">
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
          {dynamicLinks.map(({ href, label }) => {
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

        {/* CTA / Auth Actions */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link
                href="/"
                className="text-xs font-bold tracking-[0.15em] uppercase text-black hover:text-[#FF3000] transition-colors duration-150"
              >
                Login
              </Link>
              <Link href="/analyze" className="swiss-btn-primary h-10 px-6 text-[0.65rem] flex items-center justify-center">
                Get Started
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </>
          ) : (
            <>
              <span className="text-[9px] md:text-[10px] font-bold tracking-wider uppercase text-white bg-black border-2 border-black px-2 py-1 select-none">
                {userRole === "lawyer" ? "⚖️ LAWYER" : "👤 USER"}: {userName}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-bold tracking-[0.15em] uppercase text-[#FF3000] hover:text-black transition-colors duration-150 cursor-pointer border-b-2 border-transparent hover:border-black py-1"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
