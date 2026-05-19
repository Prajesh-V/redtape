"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"

type Role = "user" | "lawyer"

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>("user")
  const [userId, setUserId] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Redirect instantly if already logged in
  useEffect(() => {
    const savedRole = localStorage.getItem("redtape_role")
    const savedName = localStorage.getItem("redtape_username")
    if (savedRole && savedName) {
      if (savedRole === "user") {
        router.push("/home")
      } else if (savedRole === "lawyer") {
        router.push("/lawyers/dashboard")
      }
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!userId.trim()) {
      setError("ID / Username cannot be empty.")
      return
    }
    if (!password.trim()) {
      setError("Password cannot be empty.")
      return
    }

    setLoading(true)

    // Simulate short network delay for premium feel
    setTimeout(() => {
      // Store in localStorage for auth state
      localStorage.setItem("redtape_role", role)
      localStorage.setItem("redtape_username", userId.trim())

      if (role === "user") {
        router.push("/home")
        // Small delay followed by force reload to let navbar update
        setTimeout(() => window.location.reload(), 150)
      } else {
        router.push("/lawyers/dashboard")
        setTimeout(() => window.location.reload(), 150)
      }
    }, 800)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex-1 flex flex-col justify-center items-center py-16 px-6 relative swiss-grid-pattern">
        {/* Subtle decorative dot/lines representing Swiss structural elements */}
        <div className="absolute top-6 left-12 text-[10px] font-mono opacity-25 hidden md:block">
          RT_SECURE_AUTH_v1.0.2 // SECURE_SHELL
        </div>
        
        <div className="w-full max-w-md bg-white border-2 border-black animate-reveal relative z-10">
          
          {/* Header block with diagonal background */}
          <div className="border-b-2 border-black p-6 swiss-diagonal flex justify-between items-center">
            <div>
              <span className="swiss-section-number">SECURE PORTAL</span>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black mt-1">
                Sign In
              </h2>
            </div>
            <span className="h-10 w-10 flex items-center justify-center bg-black text-white text-xs font-bold">
              🔑
            </span>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            
            {/* Role selection tabs */}
            <div className="space-y-2">
              <label className="swiss-label text-black/60">Choose Profile</label>
              <div className="grid grid-cols-2 border-2 border-black">
                <button
                  type="button"
                  onClick={() => {
                    setRole("user")
                    setError("")
                  }}
                  className={`py-3 text-xs font-bold tracking-[0.15em] uppercase transition-all duration-150 cursor-pointer ${
                    role === "user"
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-neutral-100"
                  }`}
                >
                  👤 User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRole("lawyer")
                    setError("")
                  }}
                  className={`py-3 text-xs font-bold tracking-[0.15em] uppercase transition-all duration-150 cursor-pointer ${
                    role === "lawyer"
                      ? "bg-black text-white"
                      : "bg-white text-black hover:bg-neutral-100"
                  }`}
                >
                  ⚖️ Lawyer
                </button>
              </div>
            </div>

            {/* Input fields */}
            <div className="space-y-4">
              <div>
                <label htmlFor="userId" className="swiss-label text-black/60 block mb-1">
                  ID or Username
                </label>
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value)
                    setError("")
                  }}
                  placeholder={role === "lawyer" ? "E.g., BAR_99201" : "E.g., citizen_sharma"}
                  className="swiss-input"
                />
              </div>

              <div>
                <label htmlFor="password" className="swiss-label text-black/60 block mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  placeholder="••••••••••••"
                  className="swiss-input"
                />
              </div>
            </div>

            {/* Error messaging */}
            {error && (
              <div className="border-2 border-[#FF3000] p-3 text-xs font-bold text-[#FF3000] uppercase bg-[#FF3000]/5 tracking-wider animate-in fade-in duration-150">
                ⚠️ Error: {error}
              </div>
            )}

            {/* Action button */}
            <button
              type="submit"
              disabled={loading}
              className="swiss-btn-primary w-full justify-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              )}
            </button>

          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}