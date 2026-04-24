"use client"

import { useState } from "react"
import { Sparkles, Download, Loader2, RotateCcw, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

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

  console.log("🎯 NoticeGenerator mounted. State:", state)

  // 🚀 GENERATE NOTICE
  const handleGenerate = async () => {
    console.log("🔴 BUTTON CLICKED! Issue:", issue)

    if (!issue.trim() || issue.length < 10) {
      alert("Please provide a detailed description (minimum 10 characters)")
      return
    }

    setState("generating")
    console.log("📡 Starting fetch to /notice/generate")

    try {
      const res = await fetch("http://127.0.0.1:8000/notice/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issue }),
      })

      console.log("✅ Response received:", res.status)

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      console.log("📦 JSON RESPONSE:", data)

      if (!data.success || !data.notice) {
        throw new Error(data.error || "Failed to generate notice")
      }

      setNotice(data.notice)
      setState("viewing")

    } catch (err) {
      console.error("❌ ERROR:", err)
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setState("input")
    }
  }

  // 🔄 UPDATE A SECTION
  const handleUpdateSection = (key: keyof NoticeData, value: string) => {
    if (!notice) return
    const updated = { ...notice, [key]: value }
    setNotice(updated)
  }

  // 🔄 RESET
  const handleReset = () => {
    setIssue("")
    setNotice(null)
    setState("input")
  }

  // 📋 COPY
  const handleCopy = async () => {
    if (!notice) return
    const text = formatNoticeForDisplay(notice)
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 📄 DOWNLOAD PDF
  const handleDownload = async () => {
    if (!notice) return

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
      a.download = `legal_notice_${notice.issue_type || 'general'}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error("DOWNLOAD ERROR:", error)
      alert("Error downloading PDF")
    }
  }

  // Format notice for display
  const formatNoticeForDisplay = (n: NoticeData): string => {
    return `${n.header || ""}

${"=".repeat(60)}

${n.to || ""}

${n.from || ""}

${n.date || ""}

${n.subject || ""}

${n.body || ""}

LEGAL DEMAND:
${n.demand || ""}

${n.signature || ""}`
  }

  return (
    <div className="space-y-6">

      {/* ========== INPUT STATE ========== */}
      {state === "input" && (
        <Card>
          <CardContent className="p-6">
            <label className="mb-3 block text-sm font-medium">
              Describe your issue
            </label>
            <Textarea
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="My landlord is not returning my deposit of ₹50,000. I vacated the property on 15th March 2026..."
              className="mb-4 min-h-[150px]"
            />
            <p className="text-xs text-gray-500 mb-4">
              Be specific: mention amounts, dates, and what happened
            </p>
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={!issue.trim() || issue.length < 10}
              className="w-full"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Legal Notice
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ========== LOADING STATE ========== */}
      {state === "generating" && (
        <Card>
          <CardContent className="flex flex-col items-center p-10">
            <Loader2 className="h-8 w-8 animate-spin mb-3" />
            <p>Generating your notice...</p>
          </CardContent>
        </Card>
      )}

      {/* ========== VIEWING/EDITING STATE ========== */}
      {state === "viewing" && notice && (
        <>
          {/* PREVIEW */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Preview</h2>

              <div
                className="bg-white border-2 border-gray-300 rounded-lg p-12 shadow-lg max-w-4xl mx-auto"
                style={{
                  fontFamily: "'Georgia', 'Garamond', serif",
                  backgroundColor: "#FAFAF8",
                  minHeight: "600px",
                  lineHeight: "1.8",
                }}
              >
                <div className="text-gray-900">
                  {/* Header */}
                  <div className="text-center font-bold text-base mb-2">
                    {notice.header || "LEGAL NOTICE"}
                  </div>
                  <div className="text-center mb-6 border-t-2 border-b-2 border-gray-400 py-2">
                    {notice.subject}
                  </div>

                  {/* TO/FROM */}
                  <div className="mb-4">
                    <p className="font-semibold">{notice.to}</p>
                  </div>
                  <div className="mb-4">
                    <p className="font-semibold">{notice.from}</p>
                  </div>

                  {/* Date */}
                  <div className="mb-6">
                    <p className="font-semibold">{notice.date}</p>
                  </div>

                  {/* Body */}
                  <div className="mb-6 text-justify whitespace-pre-wrap text-sm leading-7">
                    {notice.body}
                  </div>

                  {/* Demand */}
                  <div className="mb-6">
                    <p className="font-semibold mb-2">LEGAL DEMAND:</p>
                    <div className="text-justify whitespace-pre-wrap text-sm leading-7">
                      {notice.demand}
                    </div>
                  </div>

                  {/* Signature */}
                  <div className="mt-12 whitespace-pre-wrap text-sm">
                    {notice.signature}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* EDITABLE SECTIONS */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-sm font-semibold mb-6">Edit Sections</h2>

              <div className="space-y-6">
                {/* TO */}
                <div>
                  <label className="block text-xs font-medium mb-2">To:</label>
                  <Input
                    value={notice.to}
                    onChange={(e) => handleUpdateSection("to", e.target.value)}
                    placeholder="TO: [Recipient Name and Address]"
                    className="text-xs"
                  />
                </div>

                {/* FROM */}
                <div>
                  <label className="block text-xs font-medium mb-2">From:</label>
                  <Input
                    value={notice.from}
                    onChange={(e) => handleUpdateSection("from", e.target.value)}
                    placeholder="FROM: [Your Name and Address]"
                    className="text-xs"
                  />
                </div>

                {/* DATE */}
                <div>
                  <label className="block text-xs font-medium mb-2">Date:</label>
                  <Input
                    value={notice.date}
                    onChange={(e) => handleUpdateSection("date", e.target.value)}
                    placeholder="DD Month YYYY"
                    className="text-xs"
                  />
                </div>

                {/* SUBJECT */}
                <div>
                  <label className="block text-xs font-medium mb-2">Subject:</label>
                  <Input
                    value={notice.subject}
                    onChange={(e) => handleUpdateSection("subject", e.target.value)}
                    className="text-xs"
                  />
                </div>

                {/* BODY */}
                <div>
                  <label className="block text-xs font-medium mb-2">Body (Main Content):</label>
                  <Textarea
                    value={notice.body}
                    onChange={(e) => handleUpdateSection("body", e.target.value)}
                    className="min-h-[200px] text-xs"
                  />
                </div>

                {/* DEMAND */}
                <div>
                  <label className="block text-xs font-medium mb-2">Legal Demand:</label>
                  <Textarea
                    value={notice.demand}
                    onChange={(e) => handleUpdateSection("demand", e.target.value)}
                    className="min-h-[120px] text-xs"
                  />
                </div>

                {/* SIGNATURE */}
                <div>
                  <label className="block text-xs font-medium mb-2">Signature Block:</label>
                  <Textarea
                    value={notice.signature}
                    onChange={(e) => handleUpdateSection("signature", e.target.value)}
                    className="min-h-[100px] text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ACTIONS */}
          <div className="flex gap-3">
            <Button onClick={handleDownload} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>

            <Button variant="outline" onClick={handleCopy}>
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
              {copied ? "Copied" : "Copy Text"}
            </Button>

            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              New Notice
            </Button>
          </div>
        </>
      )}
    </div>
  )
}