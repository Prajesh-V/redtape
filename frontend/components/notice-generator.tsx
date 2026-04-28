// FILE: frontend/components/notice-generator.tsx
"use client"

import { useState, useEffect } from "react"
import { Sparkles, Download, Loader2, RotateCcw, Copy, Check, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { LawyerRecommendation } from "./lawyer-recommendation"

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
  const [issue, setIssue] = useState("")
  const [notice, setNotice] = useState<NoticeData | null>(null)
  const [state, setState] = useState<GenerateState>("input")
  const [copied, setCopied] = useState(false)
  const [showLawyers, setShowLawyers] = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)

  // 1. THE AUTOMATION BRIDGE: Listen for redirect flags on mount
  useEffect(() => {
    const autoGenerate = localStorage.getItem("redtape_auto_generate")
    const savedContext = localStorage.getItem("redtape_notice_context")

    if (autoGenerate === "true" && savedContext) {
      // Clear the flags immediately so it doesn't loop on refresh
      localStorage.removeItem("redtape_auto_generate")
      localStorage.removeItem("redtape_notice_context")

      const defaultIssue = "Please draft a formal legal notice addressing the breaches and high-risk clauses identified in this document."
      setIssue(defaultIssue)
      
      // Auto-trigger generation
      triggerGeneration(defaultIssue, savedContext)
    }
  }, [])

  // 2. Extracted API call to handle both manual and automated triggers
  const triggerGeneration = async (issueText: string, contextData?: string) => {
    setState("generating")
    setShowLawyers(false)

    try {
      const payload: any = { issue: issueText }
      if (contextData) {
        payload.context_data = contextData
      }

      const res = await fetch("http://127.0.0.1:8000/notice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const responseJson = await res.json()

      if (responseJson.status === "error") {
        throw new Error(responseJson.error || "Failed to generate notice")
      }

      setNotice(responseJson.data.notice)
      setState("viewing")

    } catch (err) {
      console.error("ERROR:", err)
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
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
    setIssue("")
    setNotice(null)
    setState("input")
    setShowLawyers(false)
  }

  const handleCopy = async () => {
    if (!notice) return
    const text = `${notice.header || ""}\n\n${notice.to || ""}\n\n${notice.from || ""}\n\n${notice.date || ""}\n\nSUBJECT: ${notice.subject || ""}\n\n${notice.body || ""}\n\nLEGAL DEMAND:\n${notice.demand || ""}\n\n${notice.signature || ""}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async () => {
    if (!notice) return
    setDownloadingPdf(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/notice/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notice_data: notice }),
      })

      if (!res.ok) throw new Error("Failed to download")

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `legal_notice_${notice.issue_type || 'draft'}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error("DOWNLOAD ERROR:", error)
      alert("Error downloading PDF")
    } finally {
      setDownloadingPdf(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* INPUT STATE */}
      {state === "input" && (
        <Card className="border-border bg-card text-card-foreground">
          <CardContent className="p-6">
            <label className="mb-3 block text-sm font-medium text-foreground">
              Describe your issue
            </label>
            <Textarea
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="My employer is not paying my salary of Rs 50,000 for the month of March..."
              className="mb-4 min-h-[150px] bg-background text-foreground border-border"
            />
            <p className="text-xs text-muted-foreground mb-4">
              Be specific: mention amounts, dates, and what happened. 
            </p>
            <Button
              type="button"
              onClick={handleManualGenerate}
              disabled={!issue.trim() || issue.length < 10}
              className="w-full"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Legal Notice
            </Button>
          </CardContent>
        </Card>
      )}

      {/* GENERATING STATE */}
      {state === "generating" && (
        <Card className="border-border bg-card text-card-foreground">
          <CardContent className="flex flex-col items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
            <p className="text-lg font-medium text-foreground">Drafting your legal notice...</p>
            <p className="text-sm text-muted-foreground mt-2">Applying formal legal language and structure.</p>
          </CardContent>
        </Card>
      )}

      {/* VIEWING STATE */}
      {state === "viewing" && notice && (
        <div className="space-y-6 animate-in fade-in duration-500">
          
          {/* PREVIEW */}
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-foreground">Document Preview</h2>
              <div
                className="bg-background border border-border rounded p-8 shadow-sm max-w-4xl mx-auto text-foreground"
                style={{
                  fontFamily: "'Times New Roman', Times, serif",
                  minHeight: "600px",
                  lineHeight: "1.6",
                }}
              >
                <div>
                  <div className="text-center font-bold text-base mb-2 underline whitespace-pre-wrap">
                    {notice.header || "LEGAL NOTICE"}
                  </div>
                  <div className="text-center mb-8 font-bold">
                    SUBJECT: {notice.subject}
                  </div>
                  <div className="mb-4"><p className="font-semibold whitespace-pre-wrap">{notice.to}</p></div>
                  <div className="mb-4"><p className="font-semibold whitespace-pre-wrap">{notice.from}</p></div>
                  <div className="mb-8"><p className="font-semibold">{notice.date}</p></div>
                  <div className="mb-8 text-justify whitespace-pre-wrap text-sm leading-relaxed">
                    {notice.body}
                  </div>
                  <div className="mb-8">
                    <p className="font-bold underline mb-2">LEGAL DEMAND:</p>
                    <div className="text-justify whitespace-pre-wrap text-sm leading-relaxed">
                      {notice.demand}
                    </div>
                  </div>
                  <div className="mt-12 whitespace-pre-wrap text-sm font-semibold">
                    {notice.signature}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* EDITABLE SECTIONS */}
          <Card className="border-border bg-card text-card-foreground">
            <CardContent className="p-6">
              <h2 className="text-sm font-semibold mb-6 uppercase tracking-wider text-muted-foreground">Edit Sections</h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-foreground">To (Recipient):</label>
                    <Textarea value={notice.to} onChange={(e) => handleUpdateSection("to", e.target.value)} className="min-h-[80px] text-sm bg-background" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-foreground">From (Sender):</label>
                    <Textarea value={notice.from} onChange={(e) => handleUpdateSection("from", e.target.value)} className="min-h-[80px] text-sm bg-background" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-foreground">Date:</label>
                  <Input value={notice.date} onChange={(e) => handleUpdateSection("date", e.target.value)} className="text-sm bg-background" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-foreground">Subject:</label>
                  <Input value={notice.subject} onChange={(e) => handleUpdateSection("subject", e.target.value)} className="text-sm font-medium bg-background" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-foreground">Body (Main Content):</label>
                  <Textarea value={notice.body} onChange={(e) => handleUpdateSection("body", e.target.value)} className="min-h-[250px] text-sm leading-relaxed bg-background" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-foreground">Legal Demand:</label>
                  <Textarea value={notice.demand} onChange={(e) => handleUpdateSection("demand", e.target.value)} className="min-h-[120px] text-sm bg-background" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-foreground">Signature Block:</label>
                  <Textarea value={notice.signature} onChange={(e) => handleUpdateSection("signature", e.target.value)} className="min-h-[100px] text-sm bg-background" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleDownload} className="flex-1" disabled={downloadingPdf}>
              {downloadingPdf ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
              {downloadingPdf ? "Generating PDF..." : "Download Final PDF"}
            </Button>
            
            <Button onClick={() => setShowLawyers(!showLawyers)} variant="outline" className="flex-1 border-border">
              <Scale className="mr-2 h-4 w-4" />
              {showLawyers ? "Hide Lawyers" : "Consult a Lawyer"}
            </Button>

            <Button variant="outline" onClick={handleCopy} className="flex-1 border-border">
              {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4 text-muted-foreground" />}
              {copied ? "Copied to Clipboard" : "Copy Raw Text"}
            </Button>

            <Button variant="ghost" onClick={handleReset} className="px-4 text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* LAWYER RECOMMENDATIONS */}
          {showLawyers && (
            <div className="pt-6 border-t border-border animate-in fade-in slide-in-from-bottom-4 duration-500">
              <LawyerRecommendation 
                issueType={notice.issue_type || "general"} 
                location="Bengaluru" 
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}