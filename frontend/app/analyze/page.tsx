import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AnalyzeUploader } from "@/components/analyze-uploader"

export default function AnalyzePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 flex-col px-4 py-12">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Analyze Legal Notice
            </h1>
            <p className="text-muted-foreground">
              Upload your legal document and our AI will identify risky clauses and highlight them for you.
            </p>
          </div>
          <AnalyzeUploader />
        </div>
      </main>
      <Footer />
    </div>
  )
}
