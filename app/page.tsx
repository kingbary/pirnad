import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { WhyUs } from "@/components/why-us"
import { Testimonials } from "@/components/testimonials"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "PIRNAD Ltd - Professional Cleaning Services | West Yorkshire",
  description:
    "Professional commercial cleaning services across West Yorkshire. General building, specialized, and industrial cleaning solutions. Based in Bradford. Get your free quote today.",
  keywords: "cleaning services, commercial cleaning, Bradford, West Yorkshire, office cleaning, industrial cleaning",
  openGraph: {
    title: "PIRNAD Ltd - Professional Cleaning Services | West Yorkshire",
    description:
      "PIRNAD Ltd delivers exceptional commercial cleaning solutions tailored to your business needs. From offices to industrial facilities, we ensure spotless results every time.",
    url: "https://www.pirnad.co.uk",
    siteName: "PIRNAD Ltd",
    images: [
      {
        url: "https://www.pirnad.co.uk/professional-cleaning-team-in-modern-office-buildi.jpg",
        width: 1200,
        height: 630,
        alt: "PIRNAD Ltd - Professional Cleaning Services",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PIRNAD Ltd",
    description:
      "PIRNAD Ltd delivers exceptional commercial cleaning solutions tailored to your business needs. From offices to industrial facilities, we ensure spotless results every time.",
    images: ["https://www.pirnad.co.uk/professional-cleaning-team-in-modern-office-buildi.jpg"],
    site: "@pirnadltd",
  },
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Services />
      <WhyUs />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
