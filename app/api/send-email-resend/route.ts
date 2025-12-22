import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, service, message } = await request.json()

    // Validate required fields
    if (!name || !email || !phone || !service) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Send email to company
    const companyEmail = await resend.emails.send({
      from: "Pirnad Website <onboarding@resend.dev>", // Will change after domain verification
      to: process.env.COMPANY_EMAIL || "info@pirnad.co.uk",
      subject: `New Quote Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
            New Quote Request
          </h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone}</p>
            <p style="margin: 10px 0;"><strong>Service:</strong> ${service}</p>
            ${message ? `<p style="margin: 10px 0;"><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>` : ""}
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This email was sent from the Pirnad website contact form.</p>
          </div>
        </div>
      `,
    })

    // Send confirmation email to customer
    const customerEmail = await resend.emails.send({
      from: "Pirnad <onboarding@resend.dev>", // Will change after domain verification
      to: email,
      subject: "Thank you for contacting Pirnad - We've received your request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
            Thank You for Contacting Pirnad
          </h2>
          
          <p style="font-size: 16px; color: #555;">Dear ${name},</p>
          
          <p style="font-size: 14px; color: #555; line-height: 1.6;">
            Thank you for your interest in our cleaning services. We've received your quote request and 
            our team will review it shortly. We aim to respond to all inquiries within 24 hours.
          </p>
          
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #4CAF50;">
            <h3 style="margin-top: 0; color: #333;">Your Request Details:</h3>
            <p style="margin: 5px 0;"><strong>Service:</strong> ${service}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${phone}</p>
            ${message ? `<p style="margin: 5px 0;"><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>` : ""}
          </div>
          
          <div style="margin: 30px 0;">
            <h3 style="color: #333;">Contact Information:</h3>
            <p style="margin: 5px 0;">📍 6 Regency Court, Bradford, BD8 9EY</p>
            <p style="margin: 5px 0;">📞 01274 123456</p>
            <p style="margin: 5px 0;">📧 info@pirnad.co.uk</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This is an automated confirmation email. Please do not reply to this email.</p>
            <p style="margin-top: 10px;">© ${new Date().getFullYear()} Pirnad. All rights reserved.</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ 
      message: "Emails sent successfully",
      companyEmailId: companyEmail.data?.id,
      customerEmailId: customerEmail.data?.id
    }, { status: 200 })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
