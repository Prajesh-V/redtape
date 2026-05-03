// FILE: frontend/components/analyze-uploader.tsx
"use client"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"
import { useState } from "react"
import { FileText, AlertTriangle, CheckCircle, Info, Loader2, Download, Scale, ArrowRight, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
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
  analysis_results: AnalysisResult[]
}

export function AnalyzeUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<DocumentSummary | null>(null)
  const [showLawyers, setShowLawyers] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
      setResult(null)
      setShowLawyers(false)
      setShowChatbot(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setResult(null)
      setShowLawyers(false)
      setShowChatbot(false)
    }
  }

  const simulateProgress = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
            clearInterval(interval)
            return 90
        }
        return prev + 10
      })
    }, 500)
    return interval
  }

  const handleAnalyze = async () => {
    if (!file) return

    setAnalyzing(true)
    setShowLawyers(false)
    setShowChatbot(false)
    const progressInterval = simulateProgress()

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`${API_BASE}/contract/scan`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const responseJson = await res.json()
      
      if (responseJson.status === "error") {
        throw new Error(responseJson.error || "Analysis failed")
      }

      setResult(responseJson.data)
      setProgress(100)
    } catch (error) {
      console.error("Analysis error:", error)
      alert("Failed to analyze document. Please ensure the backend is running.")
    } finally {
      clearInterval(progressInterval)
      setTimeout(() => setAnalyzing(false), 500)
    }
  }

  const handleDownloadHighlightedPDF = async () => {
    if (!file) return
    setDownloadingPdf(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`${API_BASE}/contract/highlight`, {
        method: "POST",
        body: formData,
      })

      if (!res.ok) throw new Error("Failed to download highlighted PDF")

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `highlighted_${file.name}`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Download error:", error)
      alert("Error generating the highlighted PDF.")
    } finally {
      setDownloadingPdf(false)
    }
  }

  const handleTransitionToNotice = () => {
    if (!result) return

    const riskyClauses = result.analysis_results
      .filter((r) => r.analysis.severity === "high" || r.analysis.severity === "medium")
      .map((r) => `- ${r.clause}\n  Risk: ${r.analysis.explanation}`)
      .join("\n\n")

    const contextString = `Document Type: ${result.document_type}\n\nSummary: ${result.summary}\n\nKey Risky Clauses:\n${riskyClauses}`
    
    localStorage.setItem("redtape_notice_context", contextString)
    localStorage.setItem("redtape_auto_generate", "true")
    
    // Redirects to your specific generator route
    window.location.href = "/generate" 
  }

  const getMappedIssueType = (docType: string) => {
    if (!docType) return "general"
    const type = docType.toLowerCase()
    if (type.includes("rental") || type.includes("lease")) return "deposit_refund"
    if (type.includes("employment") || type.includes("job")) return "unpaid_salary"
    if (type.includes("agreement") || type.includes("contract")) return "breach"
    return "general"
  }

  // Serialize the document context for the Chatbot
  const documentChatContext = result ? 
    `Document Type: ${result.document_type}\n\nSummary: ${result.summary}\n\nAnalyzed Clauses:\n${result.analysis_results.map(r => `Clause: "${r.clause}"\nRisk: ${r.analysis.risk_type} (${r.analysis.severity})`).join('\n\n')}` 
    : ""

  return (
    <div className="space-y-6">
      {/* UPLOAD SECTION */}
      {!result && (
        <Card className="border-border bg-card text-card-foreground">
          <CardContent className="p-6">
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                file ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2 text-foreground">
                {file ? file.name : "Upload Legal Document"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {file ? "Ready to analyze" : "Drag and drop your contract or lease agreement (PDF, PNG, JPG)"}
              </p>
              
              <div className="flex justify-center">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Browse Files</span>
                  </Button>
                </label>
              </div>
            </div>

            {file && !analyzing && (
              <Button onClick={handleAnalyze} className="w-full mt-4">
                Analyze Document
              </Button>
            )}

            {analyzing && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center text-primary font-medium">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Extracting clauses & checking legal risks...
                  </span>
                  <span className="text-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* RESULTS SECTION */}
      {result && !analyzing && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <Card className="border-border bg-card text-card-foreground">
            <CardHeader className="bg-muted/30 border-b border-border pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl mb-1 text-foreground">Analysis Complete</CardTitle>
                  <p className="text-sm font-medium text-primary uppercase tracking-wider">
                    {result.document_type || "Legal Document"}
                  </p>
                </div>
                <Button variant="ghost" onClick={() => { setResult(null); setFile(null); setShowLawyers(false); setShowChatbot(false); }}>
                  Scan Another
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Document Summary</h3>
                <p className="text-foreground leading-relaxed">{result.summary}</p>
              </div>

              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Key Clauses Identified</h3>
              <div className="space-y-4">
                {result.analysis_results && result.analysis_results.map((item, index) => (
                  <Card key={index} className={`border-l-4 overflow-hidden ${
                    item.analysis.severity === "high" ? "border-l-destructive bg-destructive/10" :
                    item.analysis.severity === "medium" ? "border-l-orange-500 bg-orange-500/10" :
                    "border-l-green-500 bg-green-500/10"
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex gap-3">
                        <div className="mt-1">
                          {item.analysis.severity === "high" && <AlertTriangle className="w-5 h-5 text-destructive" />}
                          {item.analysis.severity === "medium" && <Info className="w-5 h-5 text-orange-500" />}
                          {item.analysis.severity === "low" && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </div>
                        <div className="flex-1 space-y-2">
                          <p className="font-medium text-sm leading-snug text-foreground">"{item.clause}"</p>
                          <div className="text-sm space-y-1 text-foreground">
                            <p><span className="font-semibold opacity-80">Risk Level:</span> <span className="capitalize">{item.analysis.severity}</span> ({item.analysis.risk_type})</p>
                            <p><span className="font-semibold opacity-80">Explanation:</span> {item.analysis.explanation}</p>
                            <p className="text-muted-foreground"><span className="font-semibold opacity-80 text-foreground">Recommendation:</span> {item.analysis.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Button onClick={handleTransitionToNotice} className="flex-1 min-w-[200px]">
              <ArrowRight className="mr-2 h-4 w-4" /> Draft Notice
            </Button>

            <Button 
              onClick={handleDownloadHighlightedPDF} 
              variant="outline" 
              className="flex-1 min-w-[200px] border-border text-foreground"
              disabled={downloadingPdf}
            >
              {downloadingPdf ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              {downloadingPdf ? "Generating..." : "Download PDF"}
            </Button>
            
            <Button onClick={() => {
              setShowChatbot(!showChatbot);
              setShowLawyers(false);
            }} variant="secondary" className="flex-1 min-w-[200px]">
              <MessageSquare className="mr-2 h-4 w-4" />
              {showChatbot ? "Hide Chat" : "Ask AI About Document"}
            </Button>

            <Button onClick={() => {
              setShowLawyers(!showLawyers);
              setShowChatbot(false);
            }} variant="secondary" className="flex-1 min-w-[200px]">
              <Scale className="mr-2 h-4 w-4" />
              {showLawyers ? "Hide Lawyers" : "Find Lawyer"}
            </Button>
          </div>

          {/* DYNAMIC CHATBOT SECTION */}
          {showChatbot && (
            <div className="pt-4 border-t border-border animate-in fade-in duration-500">
              <DocumentChatbot 
                documentContext={documentChatContext} 
                documentName={result.filename || "Uploaded Document"} 
              />
            </div>
          )}

          {/* DYNAMIC LAWYER RECOMMENDATIONS */}
          {showLawyers && (
            <div className="pt-4 border-t border-border animate-in fade-in duration-500">
              <LawyerRecommendation 
                issueType={getMappedIssueType(result.document_type)} 
                location="Bengaluru" 
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}