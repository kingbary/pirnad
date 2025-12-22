"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, AlertCircle, Plus, Trash2, Send, Download } from "lucide-react"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

type ServiceItem = {
    description: string
    quantity: number
    rate: number
}

type ReceiptFormData = {
    clientName: string
    clientEmail: string
    clientAddress: string
    clientPhone: string
    invoiceNumber: string
    invoiceDate: string
    dueDate: string
    services: ServiceItem[]
    notes: string
    paymentMethod: string
}

export default function ReceiptsPage() {
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error" | "loading">("idle")
    const [pdfStatus, setPdfStatus] = useState<"idle" | "loading">("idle")

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
        control,
    } = useForm<ReceiptFormData>({
        defaultValues: {
            invoiceDate: new Date().toISOString().split('T')[0],
            services: [{ description: "", quantity: 1, rate: 0 }],
            paymentMethod: "cash",
        },
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "services",
    })

    const watchedServices = watch("services")

    // Calculate totals
    const subtotal = watchedServices?.reduce((sum, service) => {
        return sum + (service.quantity || 0) * (service.rate || 0)
    }, 0) || 0

    const vatRate = 0.20 // 20% VAT
    const vat = subtotal * vatRate
    const total = subtotal + vat

    const onSubmit = async (data: ReceiptFormData) => {
        setSubmitStatus("loading")
        try {
            const response = await fetch("/api/send-receipt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    subtotal,
                    vat,
                    total,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to send receipt")
            }

            setSubmitStatus("success")
            reset()
            setTimeout(() => setSubmitStatus("idle"), 5000)
        } catch (error) {
            console.error("Error sending receipt:", error)
            setSubmitStatus("error")
            setTimeout(() => setSubmitStatus("idle"), 5000)
        }
    }

    const downloadPDF = async () => {
        const formData = watch()

        // Validate required fields
        if (!formData.clientName || !formData.clientEmail || !formData.invoiceNumber) {
            alert("Please fill in required fields: Client Name, Email, and Invoice Number")
            return
        }

        // Check if at least one service is added with description
        if (!formData.services || formData.services.length === 0 || !formData.services[0].description) {
            alert("Please add at least one service")
            return
        }

        setPdfStatus("loading")
        try {
            // Create a hidden container for the receipt
            const container = document.createElement('div')
            container.style.position = 'absolute'
            container.style.left = '-9999px'
            container.style.width = '800px'
            container.style.background = '#ffffff'
            container.style.color = '#000000'
            container.style.isolation = 'isolate'
            document.body.appendChild(container)

            // Format date
            const formatDate = (dateString: string) => {
                if (!dateString) return "N/A"
                return new Date(dateString).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                })
            }

            // Create receipt HTML
            container.innerHTML = `
        <style>
          * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box;
            color: inherit;
            background: transparent;
          }
        </style>
        <div style="padding: 40px; font-family: Arial, Helvetica, sans-serif; background: #ffffff; color: #000000;">
          <!-- Header -->
          <div style="background-color: #10b981; color: #ffffff; padding: 30px; border-radius: 8px 8px 0 0; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between;">
              <div>
                <div style="font-size: 12px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; opacity: 0.95; margin-bottom: 4px; color: #ffffff;">CUSTOMER</div>
                <div style="font-size: 24px; font-weight: 700; color: #ffffff;">BILL PAYMENT</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 11px; opacity: 0.9; margin-bottom: 2px; color: #ffffff;">Date</div>
                <div style="font-size: 13px; font-weight: 600; margin-bottom: 10px; color: #ffffff;">${formatDate(formData.invoiceDate)}</div>
                <div style="font-size: 11px; opacity: 0.9; margin-bottom: 2px; color: #ffffff;">Invoice Number</div>
                <div style="font-size: 13px; font-weight: 600; color: #ffffff;">${formData.invoiceNumber}</div>
              </div>
            </div>
          </div>

          <!-- Client Information -->
          <div style="margin-bottom: 30px;">
            <h3 style="font-size: 13px; font-weight: 700; color: #111827; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">CLIENT INFORMATION</h3>
            <div style="background-color: #f9fafb; border-radius: 6px; padding: 16px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                  <div style="font-size: 10px; color: #6b7280; font-weight: 500; margin-bottom: 4px;">Full Name</div>
                  <div style="font-size: 13px; font-weight: 600; color: #111827;">${formData.clientName}</div>
                </div>
                <div>
                  <div style="font-size: 10px; color: #6b7280; font-weight: 500; margin-bottom: 4px;">Phone Number</div>
                  <div style="font-size: 13px; font-weight: 600; color: #111827;">${formData.clientPhone || 'N/A'}</div>
                </div>
                <div>
                  <div style="font-size: 10px; color: #6b7280; font-weight: 500; margin-bottom: 4px;">Address</div>
                  <div style="font-size: 12px; color: #374151;">${formData.clientAddress || 'N/A'}</div>
                </div>
                <div>
                  <div style="font-size: 10px; color: #6b7280; font-weight: 500; margin-bottom: 4px;">Email</div>
                  <div style="font-size: 12px; color: #374151;">${formData.clientEmail}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Services -->
          <div style="margin-bottom: 30px;">
            <h3 style="font-size: 13px; font-weight: 700; color: #111827; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">SERVICES RENDERED</h3>
            <div style="background-color: #f9fafb; border-radius: 6px; overflow: hidden;">
              ${formData.services.map((service, index) => `
                <div style="padding: 14px; ${index < formData.services.length - 1 ? 'border-bottom: 1px solid #e5e7eb;' : ''}">
                  <div style="display: flex; justify-content: space-between;">
                    <div>
                      <div style="font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 4px;">${service.description}</div>
                      <div style="font-size: 11px; color: #6b7280;">Qty: ${service.quantity} × £${service.rate.toFixed(2)}</div>
                    </div>
                    <div style="font-size: 14px; font-weight: 700; color: #111827;">£${(service.quantity * service.rate).toFixed(2)}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Totals -->
          <div style="background-color: #f9fafb; border-radius: 6px; padding: 16px; margin-bottom: 30px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 12px; color: #6b7280;">Subtotal:</span>
              <span style="font-size: 13px; font-weight: 600; color: #111827;">£${subtotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-bottom: 12px; border-bottom: 2px solid #e5e7eb;">
              <span style="font-size: 12px; color: #6b7280;">VAT (20%):</span>
              <span style="font-size: 13px; font-weight: 600; color: #111827;">£${vat.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 12px;">
              <span style="font-size: 14px; font-weight: 700; color: #10b981;">Total:</span>
              <span style="font-size: 20px; font-weight: 700; color: #10b981;">£${total.toFixed(2)}</span>
            </div>
          </div>

          ${formData.paymentMethod ? `
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 12px; margin-bottom: 20px;">
            <span style="font-size: 11px; color: #92400e;"><strong>Payment Method:</strong> ${formData.paymentMethod.toUpperCase().replace('_', ' ')}</span>
          </div>
          ` : ''}

          ${formData.notes ? `
          <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px; padding: 12px; margin-bottom: 20px;">
            <div style="font-size: 11px; color: #1e40af; margin-bottom: 6px;"><strong>Notes:</strong></div>
            <div style="font-size: 11px; color: #1e3a8a;">${formData.notes}</div>
          </div>
          ` : ''}

          <!-- Footer -->
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; margin-top: 30px;">
            <div style="font-size: 13px; color: #111827; font-weight: 600; margin-bottom: 4px;">Pirnad Ltd</div>
            <div style="font-size: 11px; color: #6b7280; margin-bottom: 12px;">Professional Cleaning Services</div>
            <div style="font-size: 10px; color: #6b7280; margin-bottom: 2px;">6 Regency Court, Bradford, BD8 9EY, United Kingdom</div>
            <div style="font-size: 10px; color: #6b7280; margin-bottom: 12px;">📞 01274 123456 | 📧 info@pirnad.co.uk</div>
            <div style="font-size: 9px; color: #9ca3af;">© ${new Date().getFullYear()} Pirnad Ltd. All rights reserved.</div>
          </div>
        </div>
      `

            // Generate canvas from HTML
            const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                foreignObjectRendering: false,
                ignoreElements: (element) => {
                    // Ignore elements with unsupported styles
                    const style = window.getComputedStyle(element)
                    return style.color?.includes('lab(') || style.backgroundColor?.includes('lab(')
                },
                onclone: (clonedDoc) => {
                    // Remove all stylesheets to prevent CSS variable inheritance
                    const styleSheets = clonedDoc.querySelectorAll('style, link[rel="stylesheet"]')
                    styleSheets.forEach((sheet) => sheet.remove())

                    // Ensure all elements use only inline styles
                    const clonedElements = clonedDoc.querySelectorAll('*')
                    clonedElements.forEach((el: any) => {
                        if (el.style) {
                            // Force explicit colors, removing any CSS variables or lab() functions
                            const computedColor = el.style.color
                            const computedBg = el.style.backgroundColor

                            if (!computedColor || computedColor.includes('lab') || computedColor.includes('var(')) {
                                el.style.color = '#000000'
                            }
                            if (!computedBg || computedBg.includes('lab') || computedBg.includes('var(')) {
                                el.style.backgroundColor = 'transparent'
                            }
                        }
                    })
                }
            })

            // Remove the temporary container
            document.body.removeChild(container)

            // Create PDF
            const imgData = canvas.toDataURL('image/png')
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            })

            const imgWidth = 210 // A4 width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

            // Save PDF
            pdf.save(`receipt-${formData.invoiceNumber}.pdf`)

            setPdfStatus("idle")
        } catch (error) {
            console.error("Error generating PDF:", error)
            setPdfStatus("idle")
            alert(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mb-8">
                    <div className="inline-block px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                        Admin Panel
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-2">
                        Send Receipt to Client
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Create and send professional receipts for cleaning services rendered
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Client Information */}
                    <Card className="border border-emerald-100 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader className="bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                        <circle cx="12" cy="7" r="4"></circle>
                                    </svg>
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Client Information</CardTitle>
                                    <CardDescription>Enter the client's details</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="clientName">Client Name *</Label>
                                    <Input
                                        id="clientName"
                                        placeholder="John Smith"
                                        {...register("clientName", { required: "Client name is required" })}
                                    />
                                    {errors.clientName && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.clientName.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="clientEmail">Client Email *</Label>
                                    <Input
                                        id="clientEmail"
                                        type="email"
                                        placeholder="john@company.com"
                                        {...register("clientEmail", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Invalid email address",
                                            },
                                        })}
                                    />
                                    {errors.clientEmail && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.clientEmail.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="clientPhone">Client Phone</Label>
                                    <Input
                                        id="clientPhone"
                                        type="tel"
                                        placeholder="01274 123456"
                                        {...register("clientPhone")}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="clientAddress">Client Address</Label>
                                    <Input
                                        id="clientAddress"
                                        placeholder="123 Main Street, Bradford"
                                        {...register("clientAddress")}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Invoice Details */}
                    <Card className="border border-emerald-100 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader className="bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Invoice Details</CardTitle>
                                    <CardDescription>Receipt number and dates</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                                    <Input
                                        id="invoiceNumber"
                                        placeholder="INV-001"
                                        {...register("invoiceNumber", { required: "Invoice number is required" })}
                                    />
                                    {errors.invoiceNumber && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.invoiceNumber.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="invoiceDate">Invoice Date *</Label>
                                    <Input
                                        id="invoiceDate"
                                        type="date"
                                        {...register("invoiceDate", { required: "Date is required" })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dueDate">Due Date</Label>
                                    <Input
                                        id="dueDate"
                                        type="date"
                                        {...register("dueDate")}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Services */}
                    <Card className="border border-emerald-100 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader className="bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-600">
                                        <path d="M9 11l3 3L22 4"></path>
                                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                    </svg>
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Services Rendered</CardTitle>
                                    <CardDescription>Add the cleaning services provided</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid gap-4 md:grid-cols-12 items-start p-4 bg-muted/30 rounded-lg">
                                        <div className="md:col-span-5 space-y-2">
                                            <Label htmlFor={`services.${index}.description`}>Service Description *</Label>
                                            <Input
                                                id={`services.${index}.description`}
                                                placeholder="e.g., Office Deep Cleaning"
                                                {...register(`services.${index}.description`, {
                                                    required: "Description is required",
                                                })}
                                            />
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <Label htmlFor={`services.${index}.quantity`}>Quantity *</Label>
                                            <Input
                                                id={`services.${index}.quantity`}
                                                type="number"
                                                min="1"
                                                {...register(`services.${index}.quantity`, {
                                                    required: true,
                                                    valueAsNumber: true,
                                                })}
                                            />
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <Label htmlFor={`services.${index}.rate`}>Rate (£) *</Label>
                                            <Input
                                                id={`services.${index}.rate`}
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                {...register(`services.${index}.rate`, {
                                                    required: true,
                                                    valueAsNumber: true,
                                                })}
                                            />
                                        </div>

                                        <div className="md:col-span-2 space-y-2">
                                            <Label>Amount</Label>
                                            <div className="h-10 flex items-center font-semibold text-lg">
                                                £{((watchedServices?.[index]?.quantity || 0) * (watchedServices?.[index]?.rate || 0)).toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="md:col-span-1 space-y-2">
                                            <Label>&nbsp;</Label>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                disabled={fields.length === 1}
                                                className="w-full md:w-auto"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => append({ description: "", quantity: 1, rate: 0 })}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Service
                                </Button>
                            </div>

                            {/* Totals */}
                            <div className="mt-6 pt-6 border-t border-emerald-100">
                                <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-lg border border-emerald-100">
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-base">
                                            <span className="text-muted-foreground">Subtotal:</span>
                                            <span className="font-semibold">£{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-base">
                                            <span className="text-muted-foreground">VAT (20%):</span>
                                            <span className="font-semibold">£{vat.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-2xl font-bold pt-3 border-t border-emerald-200">
                                            <span className="text-emerald-700">Total:</span>
                                            <span className="text-emerald-600">£{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment & Notes */}
                    <Card className="border border-emerald-100 shadow-lg hover:shadow-xl transition-shadow">
                        <CardHeader className="bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100">
                            <CardTitle className="text-lg">Additional Information</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="paymentMethod">Payment Method</Label>
                                    <Select
                                        value={watch("paymentMethod")}
                                        onValueChange={(value) => setValue("paymentMethod", value)}
                                    >
                                        <SelectTrigger id="paymentMethod">
                                            <SelectValue placeholder="Select payment method" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                            <SelectItem value="cheque">Cheque</SelectItem>
                                            <SelectItem value="card">Card</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="notes">Additional Notes</Label>
                                    <Textarea
                                        id="notes"
                                        placeholder="Thank you for your business..."
                                        rows={3}
                                        {...register("notes")}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Messages */}
                    {submitStatus === "success" && (
                        <div className="flex items-center gap-3 rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-emerald-700 animate-in fade-in shadow-sm">
                            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                            <p className="text-sm font-medium">Receipt sent successfully to {watch("clientEmail")}!</p>
                        </div>
                    )}

                    {submitStatus === "error" && (
                        <div className="flex items-center gap-3 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 animate-in fade-in shadow-sm">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <p className="text-sm font-medium">Failed to send receipt. Please try again.</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={submitStatus === "loading"}
                            className="flex-1 md:flex-none py-3 bg-emerald-600 hover:bg-emerald-700 hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            <Send className="h-4 w-4 mr-2" />
                            {submitStatus === "loading" ? "Sending..." : "Send Receipt to Client"}
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            size="lg"
                            onClick={downloadPDF}
                            disabled={pdfStatus === "loading"}
                            className="flex-1 md:flex-none py-3 bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            {pdfStatus === "loading" ? "Generating..." : "Download as PDF"}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() => reset()}
                            disabled={submitStatus === "loading"}
                            className="border-emerald-200 py-3 hover:bg-emerald-50"
                        >
                            Clear Form
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
