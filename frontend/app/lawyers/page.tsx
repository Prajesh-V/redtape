"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { LawyerRecommendation } from "@/components/lawyer-recommendation"

export default function LawyersPage() {
  const [issue, setIssue] = useState("")
  const [submittedIssue, setSubmittedIssue] = useState("")

  const handleSearch = () => {
    if (!issue.trim() || issue.length < 5) return
    setSubmittedIssue(issue)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Page header */}
        <div className="border-b-2 border-black">
          <div className="mx-auto max-w-7xl">
            <div className="border-b-2 border-black px-6 py-3 md:px-12">
              <span className="swiss-section-number">06. Find Lawyer</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="col-span-8 px-6 py-10 md:border-r-2 md:border-black md:px-12 animate-reveal">
                <h1 className="font-black text-5xl md:text-6xl tracking-tighter uppercase leading-none">
                  Find Your<br />
                  <span className="text-[#FF3000]">Legal</span><br />
                  Professional.
                </h1>
              </div>
              <div className="col-span-4 flex items-end px-6 py-10 md:px-10 swiss-diagonal animate-reveal [animation-delay:150ms]">
                <p className="text-sm font-medium leading-relaxed text-black/60 max-w-xs">
                  Describe your legal issue, and we will match you with
                  verified legal professionals who specialize in that area.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-12 space-y-6">
          <div className="border-2 border-black animate-in fade-in duration-200">
            <div className="border-b-2 border-black px-6 py-4 swiss-grid-pattern">
              <p className="swiss-section-number">Describe Your Need</p>
            </div>
            <div className="p-6 md:p-8">
              <label htmlFor="issue-input" className="swiss-label mb-3 block text-black/60">
                What do you need help with?
              </label>
              <input
                id="issue-input"
                className="swiss-input"
                type="text"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSearch() }}
                placeholder="E.g., Rental dispute, Unpaid salary, Contract breach..."
              />
            </div>
            <div className="border-t-2 border-black px-6 py-4 flex justify-end">
              <button
                className="swiss-btn-primary"
                onClick={handleSearch}
                disabled={!issue.trim() || issue.length < 5}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Find Lawyer
              </button>
            </div>
          </div>

          {submittedIssue && (
            <div className="animate-in fade-in duration-200 pt-6">
              <p className="swiss-label mb-4 text-[#FF3000]">Matches for: {submittedIssue}</p>
              <LawyerRecommendation issueType={submittedIssue} location="Bengaluru" />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
