"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Phone, Mail, CheckCircle2, AlertCircle } from "lucide-react"

type FormData = {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

export function Contact() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "loading">("idle")
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    mode: "all",
  })

  const watchedFields = watch()

  const onSubmit = async (data: FormData) => {
    setSubmitStatus("loading")
    try {
      const response = await fetch("/api/send-email-resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to send email")
      }

      setSubmitStatus("success")
      reset()
      setTimeout(() => setSubmitStatus("idle"), 5000)
    } catch (error) {
      console.error("Error sending email:", error)
      setSubmitStatus("error")
      setTimeout(() => setSubmitStatus("idle"), 5000)
    }
  }

  return (
    <section id="contact" className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl mb-4 text-balance">
            Get Your Free Quote Today
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Contact us to discuss your cleaning requirements. We'll provide a tailored quote within 24 hours.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="border-2 border-primary/20 shadow-xl bg-card">
              <CardHeader className="bg-primary/5">
                <CardTitle className="text-2xl">Request a Quote</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you shortly</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Smith"
                        {...register("name", { required: "Name is required" })}
                        aria-invalid={errors.name ? "true" : "false"}
                        className={`transition-all duration-300 ${errors.name && touchedFields.name
                          ? "border-destructive focus:ring-destructive"
                          : watchedFields.name && !errors.name
                            ? "border-accent focus:ring-accent"
                            : ""
                          }`}
                      />
                      {errors.name && touchedFields.name && (
                        <p className="text-sm text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.name.message}
                        </p>
                      )}
                      {!errors.name && watchedFields.name && touchedFields.name && (
                        <p className="text-sm text-green-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Looks good!
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@company.com"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        aria-invalid={errors.email ? "true" : "false"}
                        className={`transition-all duration-300 ${errors.email && touchedFields.email
                          ? "border-destructive focus:ring-destructive"
                          : watchedFields.email && !errors.email && touchedFields.email
                            ? "border-accent focus:ring-accent"
                            : ""
                          }`}
                      />
                      {errors.email && touchedFields.email && (
                        <p className="text-sm text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.email.message}
                        </p>
                      )}
                      {!errors.email && watchedFields.email && touchedFields.email && (
                        <p className="text-sm text-green-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Valid email!
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="01274 123456"
                        {...register("phone", { required: "Phone number is required" })}
                        aria-invalid={errors.phone ? "true" : "false"}
                        className={`transition-all duration-300 ${errors.phone && touchedFields.phone
                          ? "border-destructive focus:ring-destructive"
                          : watchedFields.phone && !errors.phone && touchedFields.phone
                            ? "border-accent focus:ring-accent"
                            : ""
                          }`}
                      />
                      {errors.phone && touchedFields.phone && (
                        <p className="text-sm text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.phone.message}
                        </p>
                      )}
                      {!errors.phone && watchedFields.phone && touchedFields.phone && (
                        <p className="text-sm text-green-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Looks good!
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="service">Service Required *</Label>
                      <Select
                        value={watchedFields.service}
                        onValueChange={(value) => setValue("service", value, { shouldValidate: true, shouldDirty: true, shouldTouch: true })}
                      >
                        <SelectTrigger
                          id="service"
                          aria-invalid={errors.service ? "true" : "false"}
                          className={`transition-all duration-300 ${errors.service && touchedFields.service
                            ? "border-destructive focus:ring-destructive"
                            : watchedFields.service && !errors.service
                              ? "border-accent focus:ring-accent"
                              : ""
                            }`}
                        >
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Building Cleaning">General Building Cleaning</SelectItem>
                          <SelectItem value="Specialized Cleaning">Specialized Cleaning</SelectItem>
                          <SelectItem value="Industrial Cleaning">Industrial Cleaning</SelectItem>
                          <SelectItem value="Business Support Services">Business Support Services</SelectItem>
                        </SelectContent>
                      </Select>
                      <input type="hidden" {...register("service", { required: "Please select a service" })} />
                      {errors.service && touchedFields.service && (
                        <p className="text-sm text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.service.message}
                        </p>
                      )}
                      {!errors.service && watchedFields.service && (
                        <p className="text-sm text-green-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Service selected!
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your cleaning requirements..."
                      rows={5}
                      {...register("message")}
                      className="transition-all duration-300 focus:ring-2"
                    />
                  </div>

                  {submitStatus === "success" && (
                    <div className="flex items-center gap-2 rounded-lg bg-accent/10 p-4 text-green-500 animate-in fade-in slide-in-from-top-2">
                      <CheckCircle2 className="h-5 w-5" />
                      <p className="text-sm font-medium">Thank you! We'll contact you within 24 hours.</p>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-4 text-destructive animate-in fade-in slide-in-from-top-2">
                      <AlertCircle className="h-5 w-5" />
                      <p className="text-sm font-medium">Something went wrong. Please try again.</p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitStatus === "loading"}
                    className="w-full md:w-auto hover:scale-105 transition-transform duration-300"
                  >
                    {submitStatus === "loading" ? "Sending..." : "Send Enquiry"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Address</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      6 Regency Court
                      <br />
                      Bradford
                      <br />
                      BD8 9EY
                      <br />
                      United Kingdom
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <a
                      href="tel:01274123456"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      01274 123456
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <a
                      href="mailto:info@pirnad.co.uk"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      info@pirnad.co.uk
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-primary text-primary-foreground">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-2">Business Hours</h3>
                <div className="space-y-1 text-sm">
                  <p>Monday - Friday: 7:00 AM - 6:00 PM</p>
                  <p>Saturday: 8:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                  <p className="pt-2 text-primary-foreground/90">Emergency services available 24/7</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
