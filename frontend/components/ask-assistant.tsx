"use client"

import { useState } from "react"
import { DocumentChatbot } from "./document-chatbot"
import { LawyerRecommendation } from "./lawyer-recommendation"

export function AskAssistant() {
  const [prompt, setPrompt] = useState("")
  const [submittedPrompt, setSubmittedPrompt] = useState("")
  const [showResults, setShowResults] = useState(false)

  const handleSubmit = () => {
    if (!prompt.trim() || prompt.length < 10) return
    setSubmittedPrompt(prompt)
    setShowResults(true)
  }

  const handleReset = () => {
    setPrompt("")
    setSubmittedPrompt("")
    setShowResults(false)
  }

  return (
    <div className="space-y-6">
      {/* Input Section */}
      {!showResults ? (
        <div className="border-2 border-black animate-in fade-in duration-200">
          <div className="border-b-2 border-black px-6 py-4 swiss-grid-pattern">
            <p className="swiss-section-number">Describe Your Situation</p>
          </div>
          <div className="p-6 md:p-8">
            <label htmlFor="prompt-input" className="swiss-label mb-3 block text-black/60">
              Tell us what happened in plain language
            </label>
            <textarea
              id="prompt-input"
              className="swiss-textarea"
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., I signed a rental agreement last month, but now the landlord is refusing to return my security deposit even though I gave proper notice..."
            />
            <p className="mt-2 text-xs text-black/40 font-medium">
              Provide as much detail as possible to get the best advice and lawyer recommendations. (Min 10 characters)
            </p>
          </div>
          <div className="border-t-2 border-black px-6 py-4 flex justify-end">
            <button
              className="swiss-btn-primary"
              onClick={handleSubmit}
              disabled={!prompt.trim() || prompt.length < 10}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Ask Legal AI
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Summary Card */}
          <div className="border-2 border-black">
            <div className="flex items-center justify-between border-b-2 border-black px-6 py-4 swiss-grid-pattern">
              <p className="swiss-section-number">Your Situation</p>
              <button
                className="swiss-btn-ghost text-xs"
                onClick={handleReset}
              >
                ← Ask Another Question
              </button>
            </div>
            <div className="px-6 py-6 md:px-8">
              <p className="text-sm font-medium leading-relaxed text-black/80 whitespace-pre-wrap">
                {submittedPrompt}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Chatbot section */}
            <div className="flex flex-col gap-4">
              <p className="swiss-label text-[#FF3000]">Ask Follow-Up Questions</p>
              <DocumentChatbot
                documentContext={`The user has described the following legal situation:\n\n"${submittedPrompt}"\n\nProvide helpful, legally sound advice based on this situation.`}
                documentName="Your Legal Situation"
              />
            </div>

            {/* Lawyer recommendation section */}
            <div className="flex flex-col gap-4">
              <p className="swiss-label text-[#FF3000]">Recommended Lawyers</p>
              <LawyerRecommendation issueType={submittedPrompt} location="Bengaluru" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
