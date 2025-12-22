# Receipt Generator - User Guide

## Overview

The Receipt Generator allows you to create and send professional receipts to clients for cleaning services rendered. Receipts are automatically emailed to the client with a copy sent to your company email.

## How to Access

Navigate to: `http://localhost:3000/admin/receipts` (in development)  
Or: `https://yourwebsite.com/admin/receipts` (in production)

## Features

✅ **Professional Receipt Design** - Clean, branded receipt template  
✅ **Automatic VAT Calculation** - 20% VAT calculated automatically  
✅ **Multiple Services** - Add multiple line items per receipt  
✅ **Email Delivery** - Automatically sent to client and company  
✅ **Payment Tracking** - Track payment method (Cash, Bank Transfer, Card, etc.)  
✅ **Custom Notes** - Add personalized notes to receipts  

## How to Use

### Step 1: Client Information

Fill in the client's details:
- **Client Name** (required)
- **Client Email** (required) - Receipt will be sent here
- **Client Phone** (optional)
- **Client Address** (optional)

### Step 2: Invoice Details

- **Invoice Number** (required) - e.g., INV-001, REC-2024-001
- **Invoice Date** (required) - Defaults to today
- **Due Date** (optional) - For pending payments

### Step 3: Add Services

For each service:
1. **Description** - What cleaning service was provided
2. **Quantity** - Number of units (hours, rooms, etc.)
3. **Rate** - Price per unit in GBP (£)
4. **Amount** - Calculated automatically

**Examples:**
- Description: "Office Deep Cleaning", Quantity: 1, Rate: 250.00
- Description: "Window Cleaning (per floor)", Quantity: 3, Rate: 45.00
- Description: "Carpet Steam Cleaning", Quantity: 2, Rate: 80.00

**Add More Services:**
- Click "Add Service" to add additional line items
- Click the trash icon to remove a service

### Step 4: Additional Information

- **Payment Method** - Select how payment was received:
  - Cash
  - Bank Transfer
  - Cheque
  - Card
  - Pending (for invoices not yet paid)

- **Additional Notes** (optional) - Add custom messages like:
  - "Thank you for your business"
  - "Payment received in full"
  - "Please retain for your records"

### Step 5: Send Receipt

Click "Send Receipt to Client" to:
1. Generate a professional PDF-style HTML receipt
2. Email it to the client
3. Send a copy to your company email
4. Show confirmation message

## Calculations

The system automatically calculates:
- **Subtotal** = Sum of all (Quantity × Rate)
- **VAT** = Subtotal × 20%
- **Total** = Subtotal + VAT

All amounts are displayed in GBP (£).

## Email Details

### Client Receives:
- Professional branded receipt
- All service details
- Payment status
- Company contact information
- Subject: "Receipt - [Invoice Number] - Pirnad Cleaning Services"

### You Receive:
- Copy of the same receipt
- Client's information
- Subject: "[COPY] Receipt [Invoice Number] sent to [Client Name]"

## Tips

1. **Invoice Numbering**: Use a consistent format like:
   - INV-001, INV-002, INV-003...
   - 2024-001, 2024-002...
   - REC-JAN-001, REC-FEB-001...

2. **Service Descriptions**: Be specific:
   - ✅ "Office Deep Cleaning (5 rooms)"
   - ✅ "Carpet Steam Cleaning - Ground Floor"
   - ❌ "Cleaning"

3. **Payment Status**: 
   - Mark as specific payment method when paid
   - Use "Pending" for unpaid invoices

4. **Clear Form**: Click "Clear Form" to reset all fields after sending

## Example Receipt

```
Client: ABC Company Ltd
Email: john@abc.com
Invoice: INV-001
Date: 22 December 2025

Services:
1. Office Deep Cleaning     × 1    £250.00    £250.00
2. Window Cleaning          × 3    £45.00     £135.00
3. Carpet Steam Cleaning    × 2    £80.00     £160.00

Subtotal:                                     £545.00
VAT (20%):                                    £109.00
Total:                                        £654.00

Payment: Paid - Bank Transfer
```

## Troubleshooting

### Receipt not sending?
- Check that RESEND_API_KEY is set in `.env.local`
- Verify client email is valid
- Check browser console for errors
- Ensure all required fields are filled

### Wrong company email?
- Update COMPANY_EMAIL in `.env.local`
- Default: info@pirnad.co.uk

### Email going to spam?
- This is common with development emails from resend.dev
- Ask client to check spam folder
- In production, set up custom domain in Resend

### Want to customize the receipt design?
- Edit `/app/api/send-receipt/route.ts`
- Modify the `emailHTML` template
- Update colors, fonts, layout as needed

## Security Note

⚠️ **Important**: This page should be password-protected in production! Consider:
- Adding authentication (NextAuth.js)
- Protecting the /admin route
- Using environment-specific access controls

Currently, anyone with the URL can access this page. This is fine for development but not for production.

## Future Enhancements

Possible additions:
- Save receipts to database
- Receipt history/search
- PDF download option
- Custom branding per client
- Recurring invoices
- Payment reminders
- Multi-currency support
