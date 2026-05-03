// FILE: frontend/app/analyze/page.tsx
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnalyzeUploader } from "@/components/analyze-uploader"

export const metadata = {
  title: "Analyze Document — REDTAPE",
  description: "Upload your legal document and AI will identify risky clauses and highlight them for you.",
}

export default function AnalyzePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Page header — Swiss style */}
        <div className="border-b-2 border-black">
          <div className="mx-auto max-w-7xl">
            <div className="border-b-2 border-black px-6 py-3 md:px-12">
              <span className="swiss-section-number">03. Analyze</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="col-span-8 px-6 py-10 md:border-r-2 md:border-black md:px-12">
                <h1 className="font-black text-5xl md:text-6xl tracking-tighter uppercase leading-none">
                  Analyze<br />
                  <span className="text-[#FF3000]">Legal</span><br />
                  Document.
                </h1>
              </div>
              <div className="col-span-4 flex items-end px-6 py-10 md:px-10 swiss-diagonal">
                <p className="text-sm font-medium leading-relaxed text-black/60 max-w-xs">
                  Upload any PDF or image of a legal document.
                  Our AI extracts clauses, identifies financial and legal risks,
                  and highlights the most dangerous terms.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Uploader content */}
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
          <AnalyzeUploader />
        </div>
      </main>
      <Footer />
    </div>
  )
}
