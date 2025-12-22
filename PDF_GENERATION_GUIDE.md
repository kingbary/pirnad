# PDF Generation Guide

## Overview
This application uses **client-side PDF generation** with jsPDF and html2canvas. This approach is:

✅ **Vercel Compatible** - No server-side dependencies or large binaries
✅ **Fast** - Generates PDFs instantly in the browser
✅ **Reliable** - No external API dependencies
✅ **Cost-Free** - No additional services required
✅ **Works Offline** - Generates PDFs even without internet

## How It Works

### Technology Stack
- **jsPDF** - PDF generation library
- **html2canvas** - Converts HTML to canvas/image for PDF

### Process Flow
1. User fills out the receipt form
2. Clicks "Download as PDF" button
3. System validates required fields
4. Creates a temporary HTML container with receipt data
5. Converts HTML to canvas using html2canvas
6. Generates PDF from canvas using jsPDF
7. Downloads PDF to user's device
8. Cleans up temporary elements

## Installation

The required packages are already installed:

```bash
pnpm add jspdf html2canvas
```

## Usage

### From Admin Panel
1. Navigate to `/admin/receipts`
2. Fill in:
   - Client Name (required)
   - Client Email (required)
   - Invoice Number (required)
   - At least one service
3. Click **"Download as PDF"** button
4. PDF will be automatically downloaded as `receipt-{invoiceNumber}.pdf`

### PDF Features
The generated PDF includes:
- Professional header with company branding
- Client information (name, email, address, phone)
- List of services with quantities and prices
- Subtotal, VAT (20%), and total
- Payment method
- Additional notes (if provided)
- Company footer with contact information

## Deployment

### Vercel Deployment
This solution works perfectly on Vercel with **no additional configuration** required.

```bash
# Deploy to Vercel
vercel deploy
```

### Environment Variables
Make sure these are set in your Vercel project:
- `RESEND_API_KEY` - For sending email receipts
- `COMPANY_EMAIL` - Your company email address

## Advantages Over Server-Side PDF Generation

| Feature | Client-Side (jsPDF) | Server-Side (Puppeteer) |
|---------|---------------------|-------------------------|
| Vercel Compatible | ✅ Yes | ❌ No (exceeds size limits) |
| Deployment Size | Small (~500KB) | Large (~170MB Chrome) |
| Generation Speed | Instant | 2-5 seconds |
| Cost | Free | Free (but limited) |
| Server Resources | None | High CPU/Memory |
| Works Offline | ✅ Yes | ❌ No |

## Customization

### Styling the PDF
Edit the HTML template in `/app/admin/receipts/page.tsx` in the `downloadPDF` function:

```typescript
container.innerHTML = `
  <div style="...">
    <!-- Your custom HTML here -->
  </div>
`
```

### PDF Settings
Modify PDF settings in the `jsPDF` initialization:

```typescript
const pdf = new jsPDF({
  orientation: 'portrait', // or 'landscape'
  unit: 'mm',
  format: 'a4', // or 'letter', 'legal', etc.
})
```

## Troubleshooting

### PDF is Blank
- Check browser console for errors
- Ensure all required fields are filled
- Verify HTML2Canvas can access the content

### PDF Quality is Poor
Increase the scale in html2canvas:

```typescript
const canvas = await html2canvas(container, {
  scale: 3, // Higher = better quality (default is 2)
  ...
})
```

### PDF File Size is Large
- Reduce the canvas scale
- Optimize images if you add any
- Use simpler styling

## Future Enhancements

Possible improvements:
- Add company logo to PDF
- Multiple currency support
- Custom PDF templates
- Batch PDF generation
- PDF preview before download

## Support

For issues or questions:
- Check browser console for errors
- Review this guide
- Contact: info@pirnad.co.uk

---

**Last Updated:** December 22, 2025
**Version:** 1.0
