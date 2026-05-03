// FILE: frontend/components/lawyer-recommendation.tsx
"use client"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

import { useState, useEffect } from "react"
import { LawyerCard } from "./lawyer-card"

interface LawyerRecommendationProps {
  issueType: string
  location?: string
}

export function LawyerRecommendation({ issueType, location }: LawyerRecommendationProps) {
  const [lawyers, setLawyers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLawyers() {
      try {
        const res = await fetch(`${API_BASE}/lawyers/recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ issue_type: issueType, location: location || "Bengaluru" }),
        })
        const json = await res.json()
        if (json.status === "success") setLawyers(json.data)
      } catch (err) {
        console.error("Failed to load lawyer recommendations", err)
      } finally {
        setLoading(false)
      }
    }
    if (issueType) fetchLawyers()
  }, [issueType, location])

  if (loading) {
    return (
      <div className="border-2 border-black">
        <div className="border-b-2 border-black px-6 py-4 swiss-grid-pattern">
          <p className="swiss-section-number">Matched Professionals</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-10">
          <div className="h-4 w-4 border-2 border-black animate-spin" />
          <p className="text-xs font-bold uppercase tracking-widest text-black/50">Loading professionals…</p>
        </div>
      </div>
    )
  }

  if (lawyers.length === 0) return null

  return (
    <div className="border-2 border-black">
      {/* Header */}
      <div className="flex items-center justify-between border-b-2 border-black px-6 py-4 swiss-grid-pattern">
        <p className="swiss-section-number">Verified Legal Professionals</p>
        <span className="swiss-label text-black/40">{lawyers.length} Matched</span>
      </div>

      {/* Info bar */}
      <div className="border-b-2 border-black px-6 py-3 bg-[#F2F2F2]">
        <p className="text-xs font-medium text-black/60">
          Based on your document analysis. Always verify credentials before engaging a lawyer.
        </p>
      </div>

      {/* Cards grid */}
      <div className={`grid grid-cols-1 md:grid-cols-${Math.min(lawyers.length, 3)}`}>
        {lawyers.map((lawyer, i) => (
          <div key={lawyer.id} className={i < lawyers.length - 1 ? "border-b-2 md:border-b-0 md:border-r-2 border-black" : ""}>
            <LawyerCard lawyer={lawyer} />
          </div>
        ))}
      </div>
    </div>
  )
}