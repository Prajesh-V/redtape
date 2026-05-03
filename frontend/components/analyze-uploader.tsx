// FILE: frontend/components/analyze-uploader.tsx
"use client"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"

import { useState } from "react"
import { LawyerRecommendation } from "./lawyer-recommendation"
import { DocumentChatbot } from "./document-chatbot"

interface AnalysisResult {
  clause: string
  analysis: {
    risk_type: string
    severity: string
    explanation: string
    recommendation: string
  }
}

interface DocumentSummary {
  filename?: string
  document_type: string
  summary: string
  important_points?: string[]
  possible_risks?: { risk_type: string; description: string }[]
  analysis_results: AnalysisResult[]
}

// ─── Swiss severity helpers ───────────────────────────────────────────────────
function severityLabel(s: string) {
  if (s === "high")   return { label: "HIGH RISK",   border: "border-l-[#FF3000]", bg: "bg-[#FF3000]/5",  text: "text-[#FF3000]" }
  if (s === "medium") return { label: "MEDIUM RISK", border: "border-l-black",     bg: "bg-black/5",       text: "text-black" }
  return                     { label: "LOW RISK",    border: "border-l-black/30",  bg: "bg-[#F2F2F2]",    text: "text-black/50" }
}

export function AnalyzeUploader() {
  const [file, setFile]             = useState<File | null>(null)
  const [analyzing, setAnalyzing]   = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [progress, setProgress]     = useState(0)
  const [result, setResult]         = useState<DocumentSummary | null>(null)
  const [showLawyers, setShowLawyers]   = useState(false)
  const [showChatbot, setShowChatbot]   = useState(false)
  const [dragging, setDragging]     = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0])
      setResult(null); setShowLawyers(false); setShowChatbot(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
      setResult(null); setShowLawyers(false); setShowChatbot(false)
    }
  }

  const simulateProgress = () => {
    setProgress(0)
    const iv = setInterval(() => {
      setProgress(p => { if (p >= 90) { clearInterval(iv); return 90 } return p + 10 })
    }, 500)
    return iv
  }

  const handleAnalyze = async () => {
    if (!file) return
    setAnalyzing(true); setShowLawyers(false); setShowChatbot(false)
    const iv = simulateProgress()
    const fd = new FormData(); fd.append("file", file)
    try {
      const res  = await fetch(`${API_BASE}/contract/scan`, { method: "POST", body: fd })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      if (json.status === "error") throw new Error(json.error || "Analysis failed")
      setResult(json.data); setProgress(100)
    } catch (err) {
      console.error(err)
      alert("Failed to analyze document. Please ensure the backend is running.")
    } finally {
      clearInterval(iv)
      setTimeout(() => setAnalyzing(false), 500)
    }
  }

  const handleDownloadHighlightedPDF = async () => {
    if (!file) return
    setDownloadingPdf(true)
    const fd = new FormData(); fd.append("file", file)
    try {
      const res = await fetch(`${API_BASE}/contract/highlight`, { method: "POST", body: fd })
      if (!res.ok) throw new Error("Failed to download")
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement("a")
      a.href = url; a.download = `highlighted_${file.name}`; a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err); alert("Error generating highlighted PDF.")
    } finally {
      setDownloadingPdf(false)
    }
  }

  const handleTransitionToNotice = () => {
    if (!result) return
    const riskyClauses = result.analysis_results
      .filter(r => r.analysis.severity === "high" || r.analysis.severity === "medium")
      .map(r => `- ${r.clause}\n  Risk: ${r.analysis.explanation}`)
      .join("\n\n")
    const ctx = `Document Type: ${result.document_type}\n\nSummary: ${result.summary}\n\nKey Risky Clauses:\n${riskyClauses}`
    localStorage.setItem("redtape_notice_context", ctx)
    localStorage.setItem("redtape_auto_generate", "true")
    window.location.href = "/generate"
  }

  const getMappedIssueType = (docType: string) => {
    if (!docType) return "general"
    const t = docType.toLowerCase()
    if (t.includes("rental") || t.includes("lease")) return "deposit_refund"
    if (t.includes("employment") || t.includes("job")) return "unpaid_salary"
    if (t.includes("agreement") || t.includes("contract")) return "breach"
    return "general"
  }

  const documentChatContext = result
    ? `Document Type: ${result.document_type}\n\nSummary: ${result.summary}\n\nAnalyzed Clauses:\n${
        result.analysis_results.map(r => `Clause: "${r.clause}"\nRisk: ${r.analysis.risk_type} (${r.analysis.severity})`).join("\n\n")
      }`
    : ""

  // ─── UPLOAD STATE ──────────────────────────────────────────────────────────
  if (!result && !analyzing) {
    return (
      <div className="space-y-6">
        {/* Drop zone */}
        <div
          className={`border-2 border-dashed border-black transition-colors duration-150 ${dragging ? "bg-[#F2F2F2]" : "bg-white"}`}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
            {/* Upload icon — geometric */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center border-2 border-black">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>

            <p className="mb-2 text-sm font-black uppercase tracking-widest text-black">
              {file ? file.name : "Drop Document Here"}
            </p>
            <p className="mb-8 text-xs font-medium text-black/50">
              {file ? "Ready to analyze" : "PDF, PNG, JPG accepted — contract, lease, agreement"}
            </p>

            <label htmlFor="file-upload">
              <input id="file-upload" type="file" accept=".pdf,image/*" className="sr-only" onChange={handleFileChange} />
              <span className="swiss-btn-secondary cursor-pointer">
                {file ? "Change File" : "Browse Files"}
              </span>
            </label>
          </div>
        </div>

        {file && (
          <div className="border-2 border-black p-6 swiss-grid-pattern flex items-center justify-between gap-4">
            <div>
              <p className="swiss-label mb-1 text-[#FF3000]">Selected File</p>
              <p className="text-sm font-bold truncate max-w-xs">{file.name}</p>
              <p className="text-xs text-black/50 mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button className="swiss-btn-primary" onClick={handleAnalyze}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              Analyze Document
            </button>
          </div>
        )}
      </div>
    )
  }

  // ─── ANALYZING STATE ───────────────────────────────────────────────────────
  if (analyzing) {
    return (
      <div className="border-2 border-black p-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="swiss-section-number">Processing Document</p>
          <span className="swiss-label text-black/40">{progress}%</span>
        </div>
        <div className="swiss-progress mb-6">
          <div className="swiss-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs font-medium text-black/50 uppercase tracking-widest">
          Extracting clauses · Identifying risks · Scoring severity
        </p>
      </div>
    )
  }

  // ─── RESULTS STATE ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Summary card */}
      <div className="border-2 border-black">
        {/* Card header */}
        <div className="flex items-center justify-between border-b-2 border-black px-6 py-4 swiss-grid-pattern">
          <div>
            <p className="swiss-section-number mb-1">Analysis Complete</p>
            <p className="text-xs font-black uppercase tracking-widest text-black/60">
              {result!.document_type || "Legal Document"}
            </p>
          </div>
          <button
            className="swiss-btn-ghost text-xs"
            onClick={() => { setResult(null); setFile(null); setShowLawyers(false); setShowChatbot(false) }}
          >
            ← Scan Another
          </button>
        </div>

        {/* Summary body */}
        <div className="px-6 py-6 md:px-8">
          <p className="swiss-label mb-2 text-[#FF3000]">Document Summary</p>
          <p className="text-sm font-medium leading-relaxed text-black/80">{result!.summary}</p>
        </div>

        {/* Clause analysis */}
        <div className="border-t-2 border-black px-6 py-6 md:px-8">
          <p className="swiss-label mb-4 text-[#FF3000]">
            Key Clauses Identified ({result!.analysis_results?.length ?? 0})
          </p>
          <div className="space-y-3">
            {result!.analysis_results?.map((item, i) => {
              const sev = severityLabel(item.analysis.severity)
              return (
                <div key={i} className={`border-l-4 ${sev.border} ${sev.bg} p-4`}>
                  <div className="mb-2 flex items-center gap-3">
                    <span className={`swiss-label ${sev.text}`}>{sev.label}</span>
                    <span className="swiss-label text-black/40">{item.analysis.risk_type}</span>
                  </div>
                  <p className="mb-2 text-xs font-bold leading-snug text-black">
                    &ldquo;{item.clause}&rdquo;
                  </p>
                  <p className="text-xs font-medium text-black/70 leading-relaxed">
                    {item.analysis.explanation}
                  </p>
                  <p className="mt-1 text-xs text-black/50 leading-relaxed">
                    <span className="font-bold text-black/70">Recommended: </span>
                    {item.analysis.recommendation}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Action buttons — full Swiss style */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <button className="swiss-btn-primary justify-center" onClick={handleTransitionToNotice}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          Draft Notice
        </button>

        <button
          className="swiss-btn-secondary justify-center"
          onClick={handleDownloadHighlightedPDF}
          disabled={downloadingPdf}
          aria-busy={downloadingPdf}
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
      </div>

      {/* Chatbot panel */}
      {showChatbot && (
        <div className="border-t-2 border-black pt-6 animate-in fade-in duration-200">
          <DocumentChatbot
            documentContext={documentChatContext}
            documentName={result!.filename || "Uploaded Document"}
          />
        </div>
      )}

      {/* Lawyer panel */}
      {showLawyers && (
        <div className="border-t-2 border-black pt-6 animate-in fade-in duration-200">
          <LawyerRecommendation
            issueType={getMappedIssueType(result!.document_type)}
            location="Bengaluru"
          />
        </div>
      )}
    </div>
  )
}