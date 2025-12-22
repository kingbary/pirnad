# Pirnad - Professional Cleaning Services Website
A modern, full-featured website for Pirnad Ltd, a professional cleaning services company in Bradford, UK.

## 🌟 Features

### Customer-Facing
- ✨ Modern, responsive design
- 📱 Mobile-friendly interface
- 📧 Contact form with email notifications
- 🎨 Professional service showcase
- 💬 Customer testimonials
- 🌓 Dark mode support

### Admin Features
- 📄 **Receipt Generator** - Create and send professional receipts
- 📥 **PDF Download** - Client-side PDF generation (Vercel-compatible)
- 📧 **Email Delivery** - Send receipts directly to clients via Resend
- 💰 **Automatic Calculations** - VAT and totals calculated automatically
- 🎨 **Professional Templates** - Beautiful receipt email templates

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Email**: Resend API
- **PDF Generation**: jsPDF + html2canvas (client-side)
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## 📦 Installation

1. **Clone the repository**:
```bash
git clone <your-repo-url>
cd pirnad
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Set up environment variables**:
Create a `.env.local` file:
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
COMPANY_EMAIL=info@pirnad.co.uk
```

4. **Run development server**:
```bash
pnpm dev
```

5. **Open your browser**:
Visit `http://localhost:3000`

## 📚 Documentation

- [Email Setup Guide](./EMAIL_SETUP.md) - Email configuration
- [Resend Setup Guide](./RESEND_SETUP.md) - Resend API setup
- [Email Options](./EMAIL_OPTIONS.md) - Alternative email solutions
- [Receipt Generator Guide](./RECEIPT_GENERATOR_GUIDE.md) - How to use receipts
- [PDF Generation Guide](./PDF_GENERATION_GUIDE.md) - PDF setup and customization
- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md) - Deploy to production

## 🎯 Quick Start Guide

### Send a Receipt

1. Navigate to `/admin/receipts`
2. Fill in client information:
   - Client name (required)
   - Client email (required)
   - Invoice number (required)
3. Add services with quantities and rates
4. Choose payment method
5. Click **"Send Receipt to Client"** to email
6. Or **"Download as PDF"** to save locally

### Contact Form

1. Customers fill out the form on the homepage
2. Form submissions are sent to `COMPANY_EMAIL`
3. Customer receives a confirmation email

## 🏗️ Project Structure

```
pirnad/
├── app/
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── admin/
│   │   ├── receipts/
│   │   │   └── page.tsx      # Receipt generator
│   │   └── layout.tsx        # Admin layout
│   └── api/
│       ├── send-email-resend/
│       │   └── route.ts      # Contact form API
│       └── send-receipt/
│           └── route.ts      # Receipt email API
├── components/
│   ├── header.tsx            # Navigation
│   ├── hero.tsx              # Hero section
│   ├── services.tsx          # Services showcase
│   ├── contact.tsx           # Contact form
│   ├── footer.tsx            # Footer
│   └── ui/                   # shadcn/ui components
├── lib/
│   └── utils.ts              # Utility functions
└── public/                   # Static assets
```

## 🎨 Customization

### Colors
Edit `app/globals.css` to change the color scheme:
```css
:root {
  --primary: 142.1 76.2% 36.3%; /* Emerald green */
  /* ... other colors */
}
```

### Company Information
Update company details in:
- `/app/admin/receipts/page.tsx` (PDF template)
- `/app/api/send-receipt/route.ts` (Email template)
- `/components/footer.tsx` (Footer)
- `/components/header.tsx` (Logo/branding)

### Services
Modify `/components/services.tsx` to add/edit services.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
```bash
git push origin main
```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Add environment variables
   - Deploy!

3. **Set Environment Variables** in Vercel:
   - `RESEND_API_KEY`
   - `COMPANY_EMAIL`

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

## 🔒 Security

- ✅ Environment variables for sensitive data
- ✅ Server-side API routes
- ✅ Form validation
- ✅ HTTPS enforced by Vercel
- ⚠️ **TODO**: Add authentication for `/admin` routes

## 📧 Email Configuration

This app uses **Resend** for email delivery:
- Contact form notifications
- Receipt delivery to clients
- Professional HTML templates

See [RESEND_SETUP.md](./RESEND_SETUP.md) for setup instructions.

## 🧪 Testing

### Local Testing
```bash
# Run development server
pnpm dev

# Test build
pnpm build
pnpm start
```

### Test Checklist
- [ ] Contact form submits successfully
- [ ] Contact emails are received
- [ ] Receipt generator loads
- [ ] PDF downloads work
- [ ] Receipt emails are sent
- [ ] All form validations work
- [ ] Mobile responsive design

## 🐛 Troubleshooting

### PDF Not Downloading
- Check browser console for errors
- Ensure all required fields are filled
- Try a different browser

### Emails Not Sending
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for errors
- Ensure email addresses are valid

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `pnpm install`
- Check for TypeScript errors

## 📝 License

© 2025 Pirnad Ltd. All rights reserved.

## 🤝 Support

For issues or questions:
- 📧 Email: info@pirnad.co.uk
- 📞 Phone: 01274 123456
- 🏢 Address: 6 Regency Court, Bradford, BD8 9EY, UK

---

**Built with ❤️ for Pirnad Ltd**
