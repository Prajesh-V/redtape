// FILE: frontend/components/notice-generator.tsx
"use client"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

import { useState, useEffect } from "react"
import { LawyerRecommendation } from "./lawyer-recommendation"
import { DocumentChatbot } from "./document-chatbot"

type GenerateState = "input" | "generating" | "viewing"

interface NoticeData {
  issue_type?: string
  header?: string
  to?: string
  from?: string
  date?: string
  subject?: string
  body?: string
  demand?: string
  signature?: string
}

export function NoticeGenerator() {
  const [issue, setIssue]               = useState("")
  const [notice, setNotice]             = useState<NoticeData | null>(null)
  const [state, setState]               = useState<GenerateState>("input")
  const [copied, setCopied]             = useState(false)
  const [showLawyers, setShowLawyers]   = useState(false)
  const [showChatbot, setShowChatbot]   = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)

  // Automation bridge — reads localStorage context from analyze → generate flow
  useEffect(() => {
    const autoGen   = localStorage.getItem("redtape_auto_generate")
    const savedCtx  = localStorage.getItem("redtape_notice_context")
    if (autoGen === "true" && savedCtx) {
      localStorage.removeItem("redtape_auto_generate")
      localStorage.removeItem("redtape_notice_context")
      const defaultIssue = "Please draft a formal legal notice addressing the breaches and high-risk clauses identified in this document."
      setIssue(defaultIssue)
      triggerGeneration(defaultIssue, savedCtx)
    }
  }, [])

  const triggerGeneration = async (issueText: string, contextData?: string) => {
    setState("generating"); setShowLawyers(false); setShowChatbot(false)
    try {
      const payload: any = { issue: issueText }
      if (contextData) payload.context_data = contextData
      const res = await fetch(`${API_BASE}/notice/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (json.status === "error") throw new Error(json.error || "Failed to generate notice")
      setNotice(json.data.notice)
      setState("viewing")
    } catch (err) {
      console.error(err)
      alert(`Error: ${err instanceof Error ? err.message : "Unknown error"}`)
      setState("input")
    }
  }

  const handleManualGenerate = () => {
    if (!issue.trim() || issue.length < 10) {
      alert("Please provide a detailed description (minimum 10 characters)")
      return
    }
    triggerGeneration(issue)
  }

  const handleUpdateSection = (key: keyof NoticeData, value: string) => {
    if (!notice) return
    setNotice({ ...notice, [key]: value })
  }

  const handleReset = () => {
    setIssue(""); setNotice(null); setState("input")
    setShowLawyers(false); setShowChatbot(false)
  }

  const handleCopy = async () => {
    if (!notice) return
    const text = [
      notice.header, "", notice.to, "", notice.from, "",
      notice.date, "", `SUBJECT: ${notice.subject}`, "",
      notice.body, "", "LEGAL DEMAND:", notice.demand, "", notice.signature
    ].join("\n")
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async () => {
    if (!notice) return
    setDownloadingPdf(true)
    try {
      const res = await fetch(`${API_BASE}/notice/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notice_data: notice }),
      })
      if (!res.ok) throw new Error("Failed to download")
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement("a")
      a.href = url; a.download = `legal_notice_${notice.issue_type || "draft"}.pdf`; a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err); alert("Error downloading PDF")
    } finally {
      setDownloadingPdf(false)
    }
  }

  const noticeChatContext = notice
    ? `Generated Legal Notice:\nSubject: ${notice.subject}\nBody: ${notice.body}\nDemand: ${notice.demand}`
    : ""

  // ─── INPUT STATE ───────────────────────────────────────────────────────────
  if (state === "input") {
    return (
      <div className="space-y-6">
        <div className="border-2 border-black">
          <div className="border-b-2 border-black px-6 py-4 swiss-grid-pattern">
            <p className="swiss-section-number">Describe Your Issue</p>
          </div>
          <div className="p-6 md:p-8">
            <label htmlFor="issue-input" className="swiss-label mb-3 block text-black/60">
              Your complaint in plain language
            </label>
            <textarea
              id="issue-input"
              className="swiss-textarea"
              rows={6}
              value={issue}
              onChange={e => setIssue(e.target.value)}
              placeholder="E.g. My employer is not paying my salary of Rs 50,000 for the month of March and April. I have sent multiple reminders..."
            />
            <p className="mt-2 text-xs text-black/40 font-medium">
              Be specific: mention amounts, dates, and what happened. Min 10 characters.
            </p>
          </div>
          <div className="border-t-2 border-black px-6 py-4 flex justify-end">
            <button
              className="swiss-btn-primary"
              onClick={handleManualGenerate}
              disabled={!issue.trim() || issue.length < 10}
              aria-disabled={!issue.trim() || issue.length < 10}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              Generate Legal Notice
            </button>
          </div>
        </div>

        {/* Quick issue type guide */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {[
            { label: "Deposit Refund",  hint: "Landlord not returning deposit" },
            { label: "Rent Dispute",    hint: "Illegal rent hike" },
            { label: "Unpaid Salary",   hint: "Employer not paying wages" },
            { label: "Eviction",        hint: "Unlawful eviction notice" },
            { label: "Breach",          hint: "Contract terms violated" },
            { label: "General",         hint: "Any other legal matter" },
          ].map(item => (
            <button
              key={item.label}
              className="border-2 border-black p-4 text-left transition-colors duration-150 hover:bg-[#F2F2F2] hover:border-[#FF3000] group"
              onClick={() => setIssue(prev => prev ? prev : `Issue regarding: ${item.label}. `)}
            >
              <p className="swiss-label text-[#FF3000] mb-1">{item.label}</p>
              <p className="text-xs text-black/50 font-medium">{item.hint}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ─── GENERATING STATE ──────────────────────────────────────────────────────
  if (state === "generating") {
    return (
      <div className="border-2 border-black">
        <div className="border-b-2 border-black px-6 py-4 swiss-grid-pattern">
          <p className="swiss-section-number">Drafting Your Notice</p>
        </div>
        <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
          {/* Animated Swiss loading — rotating square */}
          <div className="mb-8 relative h-16 w-16">
            <div className="absolute inset-0 border-2 border-black animate-spin" style={{ animationDuration: "2s" }} />
            <div className="absolute inset-3 bg-[#FF3000]" />
          </div>
          <p className="font-black text-xl uppercase tracking-tighter mb-2">Applying Legal Language</p>
          <p className="text-xs font-medium text-black/50 uppercase tracking-widest">
            Structuring · Formalizing · Optimizing
          </p>
        </div>
      </div>
    )
  }

  // ─── VIEWING STATE ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Document preview — formal legal paper style */}
      <div className="border-2 border-black">
        <div className="flex items-center justify-between border-b-2 border-black px-6 py-4 swiss-grid-pattern">
          <p className="swiss-section-number">Document Preview</p>
          <span className="swiss-label text-black/40 uppercase">
            {notice?.issue_type?.replace("_", " ") || "Legal Notice"}
          </span>
        </div>
        <div
          className="p-8 md:p-12"
          style={{ fontFamily: "'Times New Roman', Times, serif", lineHeight: 1.7 }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <p className="font-bold text-base uppercase tracking-widest underline mb-2">
              {notice?.header || "LEGAL NOTICE"}
            </p>
            <p className="font-bold text-sm uppercase tracking-wider">
              SUBJECT: {notice?.subject}
            </p>
          </div>
          <div className="mb-4 text-sm"><p className="font-semibold whitespace-pre-wrap">{notice?.to}</p></div>
          <div className="mb-4 text-sm"><p className="font-semibold whitespace-pre-wrap">{notice?.from}</p></div>
          <div className="mb-8 text-sm"><p className="font-semibold">{notice?.date}</p></div>
          <div className="mb-8 text-sm text-justify whitespace-pre-wrap leading-relaxed">{notice?.body}</div>
          <div className="mb-8 text-sm">
            <p className="font-bold underline mb-2">LEGAL DEMAND:</p>
            <div className="text-justify whitespace-pre-wrap leading-relaxed">{notice?.demand}</div>
          </div>
          <div className="mt-12 text-sm font-semibold whitespace-pre-wrap">{notice?.signature}</div>
        </div>
      </div>

      {/* Editable sections */}
      <div className="border-2 border-black">
        <div className="border-b-2 border-black px-6 py-4 swiss-grid-pattern">
          <p className="swiss-section-number">Edit Sections</p>
        </div>
        <div className="p-6 md:p-8 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="swiss-label mb-2 block text-black/60">To (Recipient)</label>
              <textarea
                className="swiss-textarea"
                rows={3}
                value={notice?.to ?? ""}
                onChange={e => handleUpdateSection("to", e.target.value)}
              />
            </div>
            <div>
              <label className="swiss-label mb-2 block text-black/60">From (Sender)</label>
              <textarea
                className="swiss-textarea"
                rows={3}
                value={notice?.from ?? ""}
                onChange={e => handleUpdateSection("from", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="swiss-label mb-2 block text-black/60">Date</label>
              <input
                type="text"
                className="swiss-input"
                value={notice?.date ?? ""}
                onChange={e => handleUpdateSection("date", e.target.value)}
              />
            </div>
            <div>
              <label className="swiss-label mb-2 block text-black/60">Subject</label>
              <input
                type="text"
                className="swiss-input"
                value={notice?.subject ?? ""}
                onChange={e => handleUpdateSection("subject", e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="swiss-label mb-2 block text-black/60">Body (Main Content)</label>
            <textarea
              className="swiss-textarea"
              rows={10}
              value={notice?.body ?? ""}
              onChange={e => handleUpdateSection("body", e.target.value)}
            />
          </div>

          <div>
            <label className="swiss-label mb-2 block text-black/60">Legal Demand</label>
            <textarea
              className="swiss-textarea"
              rows={4}
              value={notice?.demand ?? ""}
              onChange={e => handleUpdateSection("demand", e.target.value)}
            />
          </div>

          <div>
            <label className="swiss-label mb-2 block text-black/60">Signature Block</label>
            <textarea
              className="swiss-textarea"
              rows={4}
              value={notice?.signature ?? ""}
              onChange={e => handleUpdateSection("signature", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <button
          className="swiss-btn-primary justify-center col-span-2 md:col-span-1"
          onClick={handleDownload}
          disabled={downloadingPdf}
        >
          {downloadingPdf ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin" aria-hidden="true">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Generating…
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </>
          )}
        </button>

        <button
          className={`swiss-btn-secondary justify-center ${showChatbot ? "bg-black text-white" : ""}`}
          onClick={() => { setShowChatbot(v => !v); setShowLawyers(false) }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {showChatbot ? "Hide Chat" : "Ask AI"}
        </button>

        <button
          className={`swiss-btn-secondary justify-center ${showLawyers ? "bg-black text-white" : ""}`}
          onClick={() => { setShowLawyers(v => !v); setShowChatbot(false) }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          {showLawyers ? "Hide Lawyers" : "Find Lawyer"}
        </button>

        <button className="swiss-btn-secondary justify-center" onClick={handleCopy}>
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy Text
            </>
          )}
        </button>

        <button className="swiss-btn-ghost justify-center border border-black" onClick={handleReset}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3"/>
          </svg>
          Reset
        </button>
      </div>

      {/* Chat panel */}
      {showChatbot && (
        <div className="border-t-2 border-black pt-6 animate-in fade-in duration-200">
          <DocumentChatbot documentContext={noticeChatContext} documentName="Generated Legal Notice" />
        </div>
      )}

      {/* Lawyer panel */}
      {showLawyers && (
        <div className="border-t-2 border-black pt-6 animate-in fade-in duration-200">
          <LawyerRecommendation issueType={notice?.issue_type || "general"} location="Bengaluru" />
        </div>
      )}
    </div>
  )
}