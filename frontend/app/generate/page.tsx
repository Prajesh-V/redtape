import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { NoticeGenerator } from "@/components/notice-generator"

export default function GeneratePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex flex-1 flex-col px-4 py-12">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Generate Legal Notice
            </h1>
            <p className="text-muted-foreground">
              Describe your issue and let our AI craft a professional legal notice for you.
            </p>
          </div>
          <NoticeGenerator />
        </div>
      </main>
      <Footer />
    </div>
  )
}
