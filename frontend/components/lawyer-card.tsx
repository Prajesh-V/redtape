// FILE: frontend/components/lawyer-card.tsx
import { User, MapPin, Award, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface LawyerProps {
  lawyer: {
    id: string
    name: string
    experience: string
    location: string
    rating: number
    contact: string
  }
}

export function LawyerCard({ lawyer }: LawyerProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{lawyer.name}</h3>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                {lawyer.location}
              </div>
            </div>
          </div>
          <div className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded">
            {lawyer.rating} / 5.0
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <Award className="h-3 w-3 mr-2" />
            {lawyer.experience} Experience
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Mail className="h-3 w-3 mr-2" />
            {lawyer.contact}
          </div>
        </div>

        <Button 
          className="w-full mt-5 text-xs h-8" 
          variant="outline"
          onClick={() => window.location.href = `mailto:${lawyer.contact}`}
        >
          Consult Professional
        </Button>
      </CardContent>
    </Card>
  )
}