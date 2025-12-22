# Email Setup with Resend (Recommended Solution)

Since Google App Passwords are not available for your account, we're using **Resend** - a modern email API that's much easier to set up and more reliable.

## Why Resend?

✅ **No complex authentication** - Just one API key
✅ **Free tier** - 100 emails/day, 3,000/month
✅ **Better deliverability** - Professional email infrastructure
✅ **Easy setup** - 5 minutes to get started
✅ **Great for developers** - Clean API, excellent docs

## Quick Setup (5 minutes)

### Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Click "Start Building" or "Sign Up"
3. Sign up with your email or GitHub account
4. Verify your email address

### Step 2: Get Your API Key

1. Once logged in, go to [API Keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Give it a name (e.g., "Pirnad Website")
4. Select permissions: **Full Access** (or just "Sending access")
5. Click "Create"
6. **Copy the API key** (starts with `re_...`)
   - ⚠️ You won't be able to see it again!

### Step 3: Update Your Environment Variables

Open `.env.local` and add your API key:

```env
RESEND_API_KEY=re_your_actual_api_key_here
COMPANY_EMAIL=info@pirnad.co.uk
```

### Step 4: Test It!

1. Start your dev server (if not already running):

   ```bash
   pnpm dev
   ```

2. Go to your contact form
3. Fill it out and submit
4. Check your email! 📧

## Important Notes

### Testing Phase (Free Tier)

- In development, emails will come from `onboarding@resend.dev`
- You can send to **any email address** you own
- Free tier: 100 emails/day, 3,000/month
- Perfect for testing and small sites!

### Production (Optional - Custom Domain)

To send emails from your own domain (e.g., `noreply@pirnad.co.uk`):

1. Go to [Resend Domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter `pirnad.co.uk`
4. Add the DNS records they provide to your domain
5. Wait for verification (usually 5-10 minutes)
6. Update the `from` field in the API route

## Email Flow

When someone submits the contact form:

1. **You receive**: Email with customer details at `info@pirnad.co.uk`
2. **Customer receives**: Confirmation email at their address

## Viewing Sent Emails

1. Go to [Resend Dashboard](https://resend.com/emails)
2. See all sent emails, delivery status, and any errors
3. View email previews and logs

## Troubleshooting

### "Invalid API key" error

- Make sure you copied the full API key (starts with `re_`)
- Check for extra spaces in `.env.local`
- Regenerate the API key if needed

### Emails not arriving

- Check spam/junk folder
- Verify the API key has sending permissions
- Check the Resend dashboard for delivery status
- Make sure `.env.local` is in the project root

### "Rate limit exceeded"

- Free tier: 100 emails/day
- Upgrade to paid plan if needed (very affordable)

## Pricing (If Needed Later)

- **Free**: 3,000 emails/month
- **Pro**: $20/month for 50,000 emails
- **Scale**: Custom pricing for higher volume

For a small business website, the free tier is usually more than enough!

## Alternative: If You Still Want Gmail

If you have a **Google Workspace** account (paid) instead of regular Gmail:

1. Ask your workspace admin to enable "Less secure app access"
2. Or use the original `/api/send-email` route with OAuth2

But honestly, **Resend is easier and better** for this use case! 🎉

## Support

- Resend Docs: https://resend.com/docs
- Resend Support: https://resend.com/support
- Check your Resend dashboard for email delivery logs
