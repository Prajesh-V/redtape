import { Shield, Zap, Clock, FileCheck } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    icon: Shield,
    title: "Risk Detection",
    description: "Automatically identify potentially risky clauses and terms in your legal documents."
  },
  {
    icon: Zap,
    title: "Instant Generation",
    description: "Create professional legal notices in seconds with AI-powered document generation."
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Reduce hours of legal document review to just minutes with intelligent analysis."
  },
  {
    icon: FileCheck,
    title: "Export Ready",
    description: "Download your analyzed or generated documents as professionally formatted PDFs."
  }
]

export function FeaturesSection() {
  return (
    <section className="px-4 py-20">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Why Choose REDTAPE?
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Powerful features designed to simplify your legal document workflow
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card 
              key={feature.title} 
              className="group border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
