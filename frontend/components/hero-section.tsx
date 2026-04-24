"use client"

import Link from "next/link"
import { FileSearch, FileText, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-24 md:pb-32 md:pt-32">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>AI-Powered Legal Assistance</span>
        </div>
        
        <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Your Intelligent
          <span className="relative mx-2 inline-block text-primary">
            Legal
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
              <path d="M2 10C50 4 150 4 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/40"/>
            </svg>
          </span>
          Assistant
        </h1>
        
        <p className="mx-auto mb-12 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
          Analyze legal notices for risky clauses or generate professional legal documents in seconds. 
          Powered by advanced AI to save you time and protect your interests.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/analyze">
            <Button size="lg" className="group h-14 gap-3 rounded-2xl px-8 text-base shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30">
              <FileSearch className="h-5 w-5" />
              Analyze Legal Notice
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          
          <Link href="/generate">
            <Button variant="outline" size="lg" className="group h-14 gap-3 rounded-2xl px-8 text-base transition-all hover:bg-secondary">
              <FileText className="h-5 w-5" />
              Generate Legal Notice
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
