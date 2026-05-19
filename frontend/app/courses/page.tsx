import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CoursesViewer } from "@/components/courses-viewer"

export const metadata = {
  title: "Legal Courses — REDTAPE",
  description: "Learn about your legal rights through interactive AI-led courses.",
}

export default function CoursesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Page header */}
        <div className="border-b-2 border-black">
          <div className="mx-auto max-w-7xl">
            <div className="border-b-2 border-black px-6 py-3 md:px-12">
              <span className="swiss-section-number">04. Courses</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12">
              <div className="col-span-8 px-6 py-10 md:border-r-2 md:border-black md:px-12 animate-reveal">
                <h1 className="font-black text-5xl md:text-6xl tracking-tighter uppercase leading-none">
                  Learn Your<br />
                  <span className="text-[#FF3000]">Legal</span><br />
                  Rights.
                </h1>
              </div>
              <div className="col-span-4 flex items-end px-6 py-10 md:px-10 swiss-diagonal animate-reveal [animation-delay:150ms]">
                <p className="text-sm font-medium leading-relaxed text-black/60 max-w-xs">
                  Take interactive courses taught by our AI.
                  Understand basic contract law, consumer rights,
                  and labor laws in simple language.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Courses content */}
        <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">
          <CoursesViewer />
        </div>
      </main>
      <Footer />
    </div>
  )
}
