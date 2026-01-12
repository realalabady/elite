# Email Confirmation Setup Guide

This guide will help you set up automated email confirmations for appointments using Resend.

## 📧 What You Get

- ✅ **Automatic confirmation emails** sent immediately after booking
- 📋 **Professional HTML templates** with all appointment details
- 💳 **Payment status** included (Paid/Pending)
- 🏥 **Clinic and doctor information**
- 📍 **Location details**
- ⚠️ **Important reminders** for patients

## 🚀 Quick Setup (5 minutes)

### Step 1: Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Click "Sign Up" (it's free!)
3. Verify your email address
4. Log in to your dashboard

### Step 2: Get Your API Key

1. In the Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Give it a name (e.g., "Elite Medical Production")
4. Copy the API key (starts with `re_...`)

### Step 3: Configure Environment Variables

1. Create a `.env` file in your project root (if not exists)
2. Add these lines:

```env
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL="Elite Medical <onboarding@resend.dev>"
```

3. Replace `re_your_api_key_here` with your actual API key from Step 2

### Step 4: Domain Setup (Optional - For Production)

**For Testing:**

- Use `onboarding@resend.dev` (included in free tier)
- All emails will be sent from this address
- Perfect for development and testing

**For Production:**

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `elitemedical.com`)
4. Add the provided DNS records to your domain provider
5. Wait for verification (usually 5-10 minutes)
6. Update `.env`:
   ```env
   RESEND_FROM_EMAIL="Elite Medical <noreply@yourdomain.com>"
   ```

### Step 5: Test It!

1. Start your json-server:

   ```bash
   npm run json-server
   ```

2. Make sure `.env` is loaded (json-server should read it automatically)

3. Book an appointment through your website

4. Check your email inbox! 📬

## 📊 Free Tier Limits

- ✅ **3,000 emails per month**
- ✅ **100 emails per day**
- ✅ Perfect for small to medium clinics
- ✅ No credit card required

**Example Usage:**

- 100 bookings/month = **100% FREE**
- 500 bookings/month = **100% FREE**
- 3,000 bookings/month = **100% FREE**

## 🎨 Email Features

The confirmation email includes:

1. **Header Section**

   - Eye-catching gradient design
   - "Appointment Confirmed" heading
   - Professional look and feel

2. **Appointment Details Card**

   - Appointment ID
   - Date (formatted: "Monday, January 15, 2026")
   - Time
   - Doctor name
   - Service name
   - Clinic name
   - Clinic address

3. **Payment Information** (if applicable)

   - Amount paid
   - Payment method (Visa, Apple Pay, Cash, etc.)
   - Payment status badge (Green "Paid" or Amber "Pending")

4. **Important Reminders**

   - Arrive 10-15 minutes early
   - Bring ID and insurance
   - Payment instructions for cash bookings
   - Cancellation policy

5. **Contact Information**
   - Support email
   - Support phone
   - Professional footer

## 🔧 Troubleshooting

### Emails Not Sending?

**Check 1: API Key**

```bash
# Print your API key (first 10 chars only for security)
echo $RESEND_API_KEY | cut -c1-10
```

Should output: `re_...`

**Check 2: Server Logs**
Look for these messages in your terminal:

- ✅ `Confirmation email sent to: patient@email.com` (Success)
- ❌ `Failed to send email:` (Error)
- ⚠️ `RESEND_API_KEY not configured` (Missing API key)

**Check 3: Test API Key**

```bash
# Test API key directly
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "onboarding@resend.dev",
    "to": "your@email.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

### Email Goes to Spam?

**Using Test Domain (`onboarding@resend.dev`):**

- This is normal for test emails
- Check your spam folder
- Mark as "Not Spam" to train your email client

**Using Custom Domain:**

- Verify all DNS records are added correctly
- Add SPF, DKIM, and DMARC records (Resend provides these)
- Wait 24-48 hours for DNS propagation

### Rate Limits?

Free tier limits:

- **Daily:** 100 emails
- **Monthly:** 3,000 emails

If you exceed:

- Upgrade to paid plan ($20/month for 50,000 emails)
- Or implement email queuing for large clinics

## 📈 Upgrade Options

Need more emails?

| Plan      | Price  | Emails/Month | Daily Limit |
| --------- | ------ | ------------ | ----------- |
| **Free**  | $0     | 3,000        | 100         |
| **Pro**   | $20    | 50,000       | Unlimited   |
| **Scale** | Custom | Unlimited    | Unlimited   |

## 🎯 Next Steps

Once email confirmations are working:

1. **Add Email Reminders** (24 hours before appointment)
2. **Send Cancellation Emails** (already implemented in `email.service.ts`)
3. **Add "Resend Email" Button** in admin panel
4. **Track Email Delivery** (Resend provides analytics)

## 📞 Support

- **Resend Docs:** [docs.resend.com](https://resend.com/docs)
- **Status Page:** [status.resend.com](https://status.resend.com)
- **Email Issues:** Check spam folder first, then verify API key

## ✨ Tips

1. **Test First:** Use `onboarding@resend.dev` for development
2. **Custom Domain:** Add for production to avoid spam
3. **Monitor Usage:** Check Resend dashboard regularly
4. **Personalize:** Update `RESEND_FROM_EMAIL` with your clinic name
5. **Track Analytics:** Resend provides open rates and delivery status

---

**Ready to Send Emails?** 🚀

Just add your API key to `.env` and restart json-server!
