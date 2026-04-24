import { Scale } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50 px-4 py-8">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Scale className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">REDTAPE</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} REDTAPE. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
