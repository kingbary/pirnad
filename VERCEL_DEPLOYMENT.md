# Deployment Guide for Vercel

## ✅ Ready for Production

Your receipt system is now **100% Vercel-compatible** with client-side PDF generation!

## Pre-Deployment Checklist

### 1. Environment Variables
Ensure these are set in your `.env.local` (for local) and Vercel dashboard (for production):

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
COMPANY_EMAIL=info@pirnad.co.uk
```

### 2. Vercel Configuration
No special configuration needed! The app will work out of the box.

### 3. Build Test
Test your build locally:

```bash
pnpm build
pnpm start
```

Visit `http://localhost:3000` and test:
- Contact form (/contact)
- Receipt generation (/admin/receipts)
- PDF download functionality

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed):
```bash
npm i -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Deploy to Production**:
```bash
vercel --prod
```

### Option 2: Deploy via GitHub

1. **Push to GitHub**:
```bash
git add .
git commit -m "Add client-side PDF generation"
git push origin main
```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables
   - Click "Deploy"

## Environment Variables Setup on Vercel

1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `RESEND_API_KEY` | Your Resend API key | Production, Preview, Development |
| `COMPANY_EMAIL` | info@pirnad.co.uk | Production, Preview, Development |

## Post-Deployment Verification

After deployment, test these features:

### 1. Contact Form
- Visit: `https://your-domain.vercel.app`
- Fill out and submit the contact form
- Verify email delivery

### 2. Receipt Generation
- Visit: `https://your-domain.vercel.app/admin/receipts`
- Fill out a receipt
- Click "Send Receipt to Client" - verify email
- Click "Download as PDF" - verify PDF download

### 3. PDF Quality Check
- Open downloaded PDF
- Check formatting and styling
- Verify all data is present

## Domain Configuration

### Custom Domain Setup
1. In Vercel dashboard → **Settings** → **Domains**
2. Add your custom domain (e.g., `pirnad.co.uk`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

### Recommended DNS Records
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Performance Optimization

### Already Optimized
✅ Static page generation where possible
✅ Client-side PDF generation (no server load)
✅ Optimized images and assets
✅ Modern Next.js 16 with Turbopack

### Additional Optimizations
- Enable Vercel Analytics (optional)
- Configure caching headers if needed
- Add monitoring (Vercel Analytics or Sentry)

## Security Considerations

### Production Recommendations

1. **Protect Admin Routes**
   Add authentication to `/admin` routes:
   ```typescript
   // app/admin/layout.tsx
   // Add auth middleware
   ```

2. **Rate Limiting**
   Consider adding rate limiting for contact form and receipt endpoints

3. **HTTPS Only**
   Vercel enforces HTTPS by default ✅

4. **Environment Variables**
   Never commit `.env.local` to git ✅

## Monitoring & Maintenance

### Vercel Analytics
Enable in Vercel dashboard:
- Settings → Analytics → Enable

### Error Tracking
Recommended: Add Sentry or similar:
```bash
pnpm add @sentry/nextjs
```

### Logging
Check Vercel logs:
- Project → Deployments → [Your deployment] → Logs

## Troubleshooting

### PDF Not Downloading
- Check browser console for errors
- Verify jsPDF and html2canvas are installed
- Test on different browsers

### Email Not Sending
- Verify `RESEND_API_KEY` is set correctly
- Check Resend dashboard for errors
- Verify email addresses are valid

### Build Failures
- Check build logs in Vercel
- Ensure all dependencies are in `package.json`
- Test build locally first

## Rollback Procedure

If something goes wrong:

1. Go to Vercel Dashboard
2. Navigate to **Deployments**
3. Find a working deployment
4. Click **⋯** → **Promote to Production**

## Cost Estimation

### Vercel Pricing (as of 2025)
- **Hobby Plan**: FREE
  - 100 GB bandwidth
  - Serverless function executions: 100 GB-Hrs
  - Perfect for small-medium businesses

- **Pro Plan**: $20/month
  - Unlimited bandwidth
  - Higher function limits
  - Team collaboration

### Resend Pricing
- **Free Tier**: 3,000 emails/month
- **Growth Plan**: $20/month for 50,000 emails

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Resend Docs**: https://resend.com/docs

## Backup & Recovery

### Database (Future)
If you add a database later, set up automatic backups:
- Vercel Postgres includes automatic backups
- Export data regularly

### Code Backup
✅ Git repository serves as backup
✅ Consider GitHub Actions for automated backups

---

## Quick Deploy Commands

```bash
# Test build locally
pnpm build && pnpm start

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

---

**You're ready to deploy! 🚀**

Questions? Check the documentation or contact support.

**Last Updated:** December 22, 2025
