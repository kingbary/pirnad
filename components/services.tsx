"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Sparkles, Factory, Briefcase } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const services = [
  {
    icon: Building2,
    title: "General Building Cleaning",
    description:
      "Comprehensive cleaning services for offices, retail spaces, and commercial buildings. Daily, weekly, or monthly schedules available.",
    features: ["Office cleaning", "Retail spaces", "Common areas", "Washroom services"],
  },
  {
    icon: Sparkles,
    title: "Specialized Cleaning",
    description:
      "Expert deep cleaning, carpet care, and window cleaning services using professional-grade equipment and eco-friendly products.",
    features: ["Deep cleaning", "Carpet cleaning", "Window cleaning", "Floor maintenance"],
  },
  {
    icon: Factory,
    title: "Industrial Cleaning",
    description:
      "Heavy-duty cleaning solutions for warehouses, factories, and industrial facilities with strict safety protocols.",
    features: ["Warehouse cleaning", "Factory floors", "Equipment cleaning", "Waste management"],
  },
  {
    icon: Briefcase,
    title: "Business Support Services",
    description:
      "Additional services to keep your business running smoothly, from waste management to hygiene supplies.",
    features: ["Waste disposal", "Hygiene supplies", "Maintenance", "Emergency cleaning"],
  },
]

export function Services() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(services.length).fill(false))
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers = cardRefs.current.map((ref, index) => {
      if (!ref) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              const newState = [...prev]
              newState[index] = true
              return newState
            })
          }
        },
        { threshold: 0.1 },
      )

      observer.observe(ref)
      return observer
    })

    return () => {
      observers.forEach((observer) => observer?.disconnect())
    }
  }, [])

  return (
    <section id="services" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4 text-balance">
            Our Cleaning Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Comprehensive cleaning solutions tailored to meet the unique needs of your business across West Yorkshire
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                className={`transition-all duration-700 ${
                  visibleCards[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card className="border-border h-full hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <CardHeader>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground mb-4 transition-transform duration-500 ${
                        visibleCards[index] ? "scale-100 rotate-0" : "scale-0 rotate-45"
                      }`}
                      style={{ transitionDelay: `${index * 100 + 200}ms` }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="leading-relaxed">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
