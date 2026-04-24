// FILE: frontend/components/lawyer-recommendation.tsx
"use client"

import { useState, useEffect } from "react"
import { LawyerCard } from "./lawyer-card"
import { Loader2, Scale } from "lucide-react"

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
        const res = await fetch("https://redtape.onrender.com/lawyers/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            issue_type: issueType,
            location: location || "Bengaluru" // Default to Bengaluru for now
          }),
        })

        const responseJson = await res.json()
        if (responseJson.status === "success") {
          setLawyers(responseJson.data)
        }
      } catch (error) {
        console.error("Failed to load lawyer recommendations", error)
      } finally {
        setLoading(false)
      }
    }

    if (issueType) fetchLawyers()
  }, [issueType, location])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (lawyers.length === 0) return null

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-2 px-1">
        <Scale className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-lg">Verified Legal Professionals</h2>
      </div>
      <p className="text-xs text-muted-foreground px-1 mb-2">
        Based on your document analysis, we recommend consulting these specialized lawyers.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lawyers.map((lawyer) => (
          <LawyerCard key={lawyer.id} lawyer={lawyer} />
        ))}
      </div>
    </div>
  )
}