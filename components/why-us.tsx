import { Card, CardContent } from "@/components/ui/card"
import { Leaf, MapPin, Shield, Calendar } from "lucide-react"

const reasons = [
  {
    icon: Leaf,
    title: "Eco-Friendly Products",
    description:
      "We use only environmentally responsible cleaning products that are safe for your staff and the planet.",
  },
  {
    icon: MapPin,
    title: "Local & Reliable",
    description: "Based in Bradford, we serve businesses across West Yorkshire with prompt, dependable service.",
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "Fully insured with comprehensive health and safety protocols. All staff are DBS checked and trained.",
  },
  {
    icon: Calendar,
    title: "Flexible Contracts",
    description:
      "No long-term commitments required. Choose daily, weekly, or monthly cleaning schedules that suit you.",
  },
]

export function WhyUs() {
  return (
    <section id="why-us" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4 text-balance">
            Why Choose PIRNAD Ltd?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We're committed to delivering exceptional cleaning services with integrity, reliability, and attention to
            detail
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <Card key={index} className="border-border text-center hover:border-primary transition-colors">
                <CardContent className="pt-8 pb-8">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-foreground">
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{reason.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{reason.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
