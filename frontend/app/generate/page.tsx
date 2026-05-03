// FILE: frontend/app/generate/page.tsx
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { NoticeGenerator } from "@/components/notice-generator"

export const metadata = {
  title: "Generate Notice — REDTAPE",
  description: "Describe your legal issue and let AI craft a professional legal notice for you.",
}

export default function GeneratePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Page header — Swiss style */}
        <div className="border-b-2 border-black">
          <div className="mx-auto max-w-7xl">
            <div className="border-b-2 border-black px-6 py-3 md:px-12">
              <span className="swiss-section-number">04. Generate</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="col-span-8 px-6 py-10 md:border-r-2 md:border-black md:px-12">
                <h1 className="font-black text-5xl md:text-6xl tracking-tighter uppercase leading-none">
                  Generate<br />
                  <span className="text-[#FF3000]">Legal</span><br />
                  Notice.
                </h1>
              </div>
              <div className="col-span-4 flex items-end px-6 py-10 md:px-10 swiss-dots">
                <p className="text-sm font-medium leading-relaxed text-black/60 max-w-xs">
                  Describe your issue in plain language — landlord disputes,
                  unpaid salary, contract breaches. Our AI drafts a formal,
                  court-ready legal notice in seconds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Generator content */}
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
          <NoticeGenerator />
        </div>
      </main>
      <Footer />
    </div>
  )
}
