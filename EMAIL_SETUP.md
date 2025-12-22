# Email Setup Guide - Google SMTP

This guide will help you set up email functionality for the contact form using Gmail's SMTP server.

## Prerequisites

- A Gmail account
- 2-Step Verification enabled on your Google account

## Setup Instructions

### Step 1: Enable 2-Step Verification

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Find "2-Step Verification" section
3. If not enabled, click to enable it and follow the prompts

### Step 2: Generate App Password

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Or navigate manually: Google Account → Security → 2-Step Verification → App passwords
2. Select "Mail" as the app type
3. Select "Other (custom name)" as the device type
4. Enter a name like "Pirnad Website"
5. Click "Generate"
6. Copy the 16-character password (you won't be able to see it again)

### Step 3: Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Update the following variables:

```env
GMAIL_USER=your-actual-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password-here
COMPANY_EMAIL=info@pirnad.co.uk
```

**Important Notes:**
- `GMAIL_USER`: Your Gmail address that will send the emails
- `GMAIL_APP_PASSWORD`: The 16-character app password you generated (no spaces)
- `COMPANY_EMAIL`: The email address where you want to receive contact form submissions

### Step 4: Test the Setup

1. Make sure your development server is running:
   ```bash
   pnpm dev
   ```

2. Navigate to your website's contact form
3. Fill out and submit the form
4. Check both:
   - The `COMPANY_EMAIL` inbox for the contact form submission
   - The customer's email for the confirmation message

## Email Flow

When a customer submits the contact form:

1. **Company receives**: An email with all the customer's details and message
2. **Customer receives**: An automated confirmation email acknowledging their request

## Troubleshooting

### "Invalid login" error
- Make sure you're using the App Password, not your regular Gmail password
- Verify that 2-Step Verification is enabled
- Regenerate the App Password if needed

### Emails not sending
- Check that all environment variables are set correctly
- Verify there are no extra spaces in the App Password
- Check the browser console and server logs for error messages

### Emails going to spam
- Consider using a custom domain email with proper SPF/DKIM records
- Ask recipients to mark your emails as "Not Spam"

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add the same environment variables in your hosting platform's settings
2. Make sure to use production-ready email addresses
3. Consider using a dedicated email service like SendGrid or AWS SES for better deliverability

## Security Notes

- Never commit `.env.local` to version control (it's in `.gitignore`)
- Keep your App Password secure
- Rotate your App Password periodically
- Use a dedicated Gmail account for sending emails if possible

## Alternative Email Services

If you need more robust email delivery, consider:

- **SendGrid**: Free tier available, better deliverability
- **AWS SES**: Pay-as-you-go pricing, highly scalable
- **Resend**: Developer-friendly, modern API
- **Postmark**: Excellent for transactional emails

To switch to these services, you'll need to update the `app/api/send-email/route.ts` file with the appropriate SDK.
