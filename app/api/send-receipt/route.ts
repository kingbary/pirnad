import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

type ServiceItem = {
  description: string
  quantity: number
  rate: number
}

type ReceiptData = {
  clientName: string
  clientEmail: string
  clientAddress?: string
  clientPhone?: string
  invoiceNumber: string
  invoiceDate: string
  dueDate?: string
  services: ServiceItem[]
  notes?: string
  paymentMethod: string
  subtotal: number
  vat: number
  total: number
}

export async function POST(request: NextRequest) {
  try {
    const data: ReceiptData = await request.json()

    // Validate required fields
    if (!data.clientName || !data.clientEmail || !data.invoiceNumber || !data.services?.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Format date
    const formatDate = (dateString: string) => {
      if (!dateString) return "N/A"
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    }

    // Email HTML
    const emailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Receipt - ${data.invoiceNumber}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f5f5f5;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f5f5f5;">
          <tr>
            <td align="center" style="padding: 20px;">
              <!-- Main Container -->
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #10b981; padding: 40px 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="60%" style="vertical-align: top;">
                          <h1 style="margin: 0; font-size: 14px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: #ffffff; opacity: 0.95;">CUSTOMER</h1>
                          <h2 style="margin: 4px 0 0 0; font-size: 28px; font-weight: 700; color: #ffffff; line-height: 1.2;">BILL PAYMENT</h2>
                        </td>
                        <td width="40%" style="text-align: right; vertical-align: top;">
                          <p style="margin: 0; font-size: 12px; color: #ffffff; opacity: 0.9;">Date</p>
                          <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 600; color: #ffffff;">${formatDate(data.invoiceDate)}</p>
                          <p style="margin: 12px 0 0 0; font-size: 12px; color: #ffffff; opacity: 0.9;">Invoice Number</p>
                          <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 600; color: #ffffff;">${data.invoiceNumber}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Client Information -->
                <tr>
                  <td style="padding: 30px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: #111827; letter-spacing: 1px; text-transform: uppercase;">CLIENT INFORMATION</h3>
                    
                    <table width="100%" cellpadding="12" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 6px;">
                      <tr>
                        <td width="50%" style="vertical-align: top;">
                          <p style="margin: 0 0 4px 0; font-size: 11px; color: #6b7280; font-weight: 500;">Full Name</p>
                          <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">${data.clientName}</p>
                        </td>
                        ${
                          data.clientPhone
                            ? `
                        <td width="50%" style="vertical-align: top;">
                          <p style="margin: 0 0 4px 0; font-size: 11px; color: #6b7280; font-weight: 500;">Phone Number</p>
                          <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">${data.clientPhone}</p>
                        </td>
                        `
                            : `<td width="50%"></td>`
                        }
                      </tr>
                      <tr>
                        ${
                          data.clientAddress
                            ? `
                        <td style="vertical-align: top; padding-top: 12px;">
                          <p style="margin: 0 0 4px 0; font-size: 11px; color: #6b7280; font-weight: 500;">Address</p>
                          <p style="margin: 0; font-size: 13px; color: #374151; line-height: 1.4;">${data.clientAddress}</p>
                        </td>
                        `
                            : `<td style="padding-top: 12px;"></td>`
                        }
                        <td style="vertical-align: top; padding-top: 12px;">
                          <p style="margin: 0 0 4px 0; font-size: 11px; color: #6b7280; font-weight: 500;">Email</p>
                          <p style="margin: 0; font-size: 13px; color: #374151;">${data.clientEmail}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Services -->
                <tr>
                  <td style="padding: 0 30px 30px 30px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: #111827; letter-spacing: 1px; text-transform: uppercase;">Services Rendered</h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 6px;">
                      ${data.services
                        .map(
                          (service, index) => `
                      <tr>
                        <td style="padding: 16px; ${index < data.services.length - 1 ? "border-bottom: 1px solid #e5e7eb;" : ""}">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="70%">
                                <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 600; color: #111827;">${service.description}</p>
                                <p style="margin: 0; font-size: 12px; color: #6b7280;">Qty: ${service.quantity} × £${service.rate.toFixed(2)}</p>
                              </td>
                              <td width="30%" style="text-align: right; vertical-align: top;">
                                <p style="margin: 0; font-size: 15px; font-weight: 700; color: #111827;">£${(service.quantity * service.rate).toFixed(2)}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      `
                        )
                        .join("")}
                    </table>
                  </td>
                </tr>

                <!-- Invoice Amount -->
                <tr>
                  <td style="padding: 0 30px 30px 30px;">
                    <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 6px;">
                      <tr>
                        <td>
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="70%">
                                <p style="margin: 0; font-size: 13px; color: #6b7280; font-weight: 500;">Invoice Amount</p>
                              </td>
                              <td width="30%" style="text-align: right;">
                                <p style="margin: 0; font-size: 22px; font-weight: 700; color: #111827;">£${data.subtotal.toFixed(2)}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Payer Information -->
                <tr>
                  <td style="padding: 0 30px 30px 30px;">
                    <h3 style="margin: 0 0 16px 0; font-size: 14px; font-weight: 700; color: #111827; letter-spacing: 1px; text-transform: uppercase;">PAYER INFORMATION</h3>
                    
                    <table width="100%" cellpadding="16" cellspacing="0" border="0" style="background-color: #f9fafb; border-radius: 6px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 4px 0; font-size: 11px; color: #6b7280; font-weight: 500;">Payer Details</p>
                          <p style="margin: 0 0 6px 0; font-size: 14px; font-weight: 600; color: #111827;">${data.clientName}</p>
                          <p style="margin: 0; font-size: 13px; color: #374151;">${data.clientEmail}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 16px; border-top: 1px solid #e5e7eb;">
                          <p style="margin: 0 0 12px 0; font-size: 13px; font-weight: 600; color: #111827;">Total Amount</p>
                          
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="70%">
                                <p style="margin: 0; font-size: 12px; color: #6b7280;">Amount:</p>
                              </td>
                              <td width="30%" style="text-align: right;">
                                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">£${data.subtotal.toFixed(2)} GBP</p>
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top: 6px;">
                                <p style="margin: 0; font-size: 12px; color: #6b7280;">VAT (20%):</p>
                              </td>
                              <td style="text-align: right; padding-top: 6px;">
                                <p style="margin: 0; font-size: 14px; font-weight: 600; color: #111827;">£${data.vat.toFixed(2)} GBP</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                ${
                  data.paymentMethod
                    ? `
                <!-- Payment Method -->
                <tr>
                  <td style="padding: 0 30px 20px 30px;">
                    <table width="100%" cellpadding="12" cellspacing="0" border="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                      <tr>
                        <td>
                          <p style="margin: 0; font-size: 12px; color: #92400e;"><strong>Payment Method:</strong> ${data.paymentMethod.replace("_", " ").toUpperCase()}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                `
                    : ""
                }
                
                ${
                  data.notes
                    ? `
                <!-- Notes -->
                <tr>
                  <td style="padding: 0 30px 30px 30px;">
                    <table width="100%" cellpadding="12" cellspacing="0" border="0" style="background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 600; color: #1e40af;">Notes:</p>
                          <p style="margin: 0; font-size: 13px; color: #1e3a8a; line-height: 1.5;">${data.notes}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                `
                    : ""
                }

                <!-- Total Footer -->
                <tr>
                  <td style="background-color: #10b981; padding: 24px 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="50%">
                          <p style="margin: 0; font-size: 16px; font-weight: 700; color: #ffffff; letter-spacing: 0.5px;">Total</p>
                        </td>
                        <td width="50%" style="text-align: right;">
                          <p style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff;">£${data.total.toFixed(2)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                  <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 4px 0; font-size: 14px; color: #111827; font-weight: 600;">Pirnad Ltd</p>
                    <p style="margin: 0 0 16px 0; font-size: 12px; color: #6b7280;">Professional Cleaning Services</p>
                    
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280;">6 Regency Court, Bradford, BD8 9EY, United Kingdom</p>
                    <p style="margin: 0 0 16px 0; font-size: 12px; color: #6b7280;">📞 01274 123456 | 📧 info@pirnad.co.uk</p>
                    
                    <p style="margin: 0 0 12px 0; font-size: 11px; color: #9ca3af;">Thank you for your business! If you have any questions, please contact us.</p>
                    
                    <p style="margin: 0; font-size: 10px; color: #9ca3af;">© ${new Date().getFullYear()} Pirnad Ltd. All rights reserved.</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `

    // Send email to client
    await resend.emails.send({
      from: "Pirnad Receipts <onboarding@resend.dev>",
      to: data.clientEmail,
      subject: `Receipt - ${data.invoiceNumber} - Pirnad Cleaning Services`,
      html: emailHTML,
    })

    // Send copy to company
    await resend.emails.send({
      from: "Pirnad Receipts <onboarding@resend.dev>",
      to: process.env.COMPANY_EMAIL || "info@pirnad.co.uk",
      subject: `[COPY] Receipt ${data.invoiceNumber} sent to ${data.clientName}`,
      html: emailHTML,
    })

    return NextResponse.json({ message: "Receipt sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error sending receipt:", error)
    return NextResponse.json({ error: "Failed to send receipt" }, { status: 500 })
  }
}
