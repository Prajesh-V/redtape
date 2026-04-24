"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, FileText, X, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type UploadState = "idle" | "processing" | "success"

export function AnalyzeUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [state, setState] = useState<UploadState>("idle")
  const [result, setResult] = useState<any>(null)
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setState("idle")
      setResult(null)
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
  })

  const handleAnalyze = async () => {
    if (!file) return

    setState("processing")

    try {
      const formData = new FormData()
      formData.append("file", file)

      // ✅ 1. GET ANALYSIS JSON
      const res = await fetch("http://127.0.0.1:8000/contracts/scan-contract", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      
      // Check if API returned an error
      if (data.status === "error") {
        throw new Error(data.error || "Unknown error from API")
      }

      setResult(data)

      // ✅ 2. GET HIGHLIGHTED PDF
      const formData2 = new FormData()
      formData2.append("file", file)
      
      const pdfRes = await fetch("http://127.0.0.1:8000/contracts/highlight-contract", {
        method: "POST",
        body: formData2,
      })

      if (pdfRes.ok && pdfRes.headers.get("content-type")?.includes("application/pdf")) {
        const blob = await pdfRes.blob()
        setPdfBlob(blob)
      }

      setState("success")

    } catch (err) {
      console.error("Analysis error:", err)
      alert(`Error analyzing document: ${err instanceof Error ? err.message : "Unknown error"}`)
      setState("idle")
    }
  }

  const handleDownload = () => {
    if (!pdfBlob) return

    const url = URL.createObjectURL(pdfBlob)
    const a = document.createElement("a")
    a.href = url
    a.download = "highlighted.pdf"
    a.click()
  }

  const getSeverityColor = (severity: string) => {
    if (severity === "high") return "text-red-600"
    if (severity === "medium") return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="space-y-6">

      {/* Upload */}
      {!file && (
        <Card>
          <CardContent {...getRootProps()} className="p-10 text-center cursor-pointer">
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-3" />
            <p>Upload your document</p>
          </CardContent>
        </Card>
      )}

      {/* File */}
      {file && state === "idle" && (
        <>
          <Card>
            <CardContent className="flex justify-between p-4">
              <p>{file.name}</p>
              <Button variant="ghost" onClick={() => setFile(null)}>
                <X />
              </Button>
            </CardContent>
          </Card>

          <Button onClick={handleAnalyze} className="w-full">
            Analyze
          </Button>
        </>
      )}

      {/* Processing */}
      {state === "processing" && (
        <Card>
          <CardContent className="p-10 text-center">
            <Loader2 className="animate-spin mx-auto mb-3" />
            <p>Analyzing...</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {state === "success" && result && (
        <div className="space-y-6">

          {/* Summary */}
          <Card>
            <CardContent className="p-4">
              <h2 className="font-bold mb-2">Summary</h2>
              <p className="text-sm">{result.summary || "No summary available"}</p>
            </CardContent>
          </Card>

          {/* Clauses */}
          {result.analysis_results && result.analysis_results.length > 0 ? (
            result.analysis_results.map((item: any, index: number) => (
              <Card key={index}>
                <CardContent className="p-4 space-y-2">
                  <p className="text-sm font-medium">{item.clause}</p>
                  <p className={`text-sm ${getSeverityColor(item.analysis.severity)}`}>
                    {item.analysis.severity.toUpperCase()} RISK
                  </p>
                  <p className="text-xs text-gray-600">
                    {item.analysis.explanation}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">No risky clauses detected or analysis unavailable</p>
              </CardContent>
            </Card>
          )}

          {/* Download */}
          {pdfBlob && (
            <Button onClick={handleDownload} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Highlighted PDF
            </Button>
          )}

        </div>
      )}

    </div>
  )
}