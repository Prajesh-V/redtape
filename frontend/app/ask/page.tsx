import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AskAssistant } from "@/components/ask-assistant"

export const metadata = {
  title: "Ask Legal AI — REDTAPE",
  description: "Describe your legal issue, get AI advice, and match with the right lawyers.",
}

export default function AskPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Page header */}
        <div className="border-b-2 border-black">
          <div className="mx-auto max-w-7xl">
            <div className="border-b-2 border-black px-6 py-3 md:px-12">
              <span className="swiss-section-number">05. Ask AI</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="col-span-8 px-6 py-10 md:border-r-2 md:border-black md:px-12 animate-reveal">
                <h1 className="font-black text-5xl md:text-6xl tracking-tighter uppercase leading-none">
                  Ask Your<br />
                  <span className="text-[#FF3000]">Legal</span><br />
                  Questions.
                </h1>
              </div>
              <div className="col-span-4 flex items-end px-6 py-10 md:px-10 swiss-diagonal animate-reveal [animation-delay:150ms]">
                <p className="text-sm font-medium leading-relaxed text-black/60 max-w-xs">
                  Tell us about your legal situation in plain English.
                  Our AI will analyze your issue, provide immediate guidance,
                  and connect you with relevant legal professionals.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ask AI content */}
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
          <AskAssistant />
        </div>
      </main>
      <Footer />
    </div>
  )
}
