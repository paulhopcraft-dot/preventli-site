# 🚀 Preventli — Deployment Instructions

**Estimated time to go live: 20–30 minutes**

---

## Table of Contents
1. [Overview](#overview)
2. [Step 1: Supabase Setup](#step-1-supabase-setup)
3. [Step 2: Resend Setup](#step-2-resend-setup)
4. [Step 3: Deploy to Vercel](#step-3-deploy-to-vercel)
5. [Step 4: Connect Domain](#step-4-connect-domain)
6. [Environment Variables Reference](#environment-variables-reference)
7. [Admin Dashboard](#admin-dashboard)
8. [Going Live Checklist](#going-live-checklist)

---

## Overview

The site is built with:
- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Supabase** (form submissions database)
- **Resend** (email notifications)
- **Vercel** (hosting)

---

## Step 1: Supabase Setup (~5 minutes)

### 1.1 Create a Supabase account
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **"New Project"**
3. Choose a name (e.g. `preventli`), set a database password, choose region: **Australia (ap-southeast-2)**
4. Click **"Create new project"** and wait ~2 minutes

### 1.2 Create the database table
1. In your Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New query"**
3. Paste and run this SQL:

```sql
-- Create the contact submissions table
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT NOT NULL,
  employees TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted')) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (used by API routes)
CREATE POLICY "Service role full access" 
  ON contact_submissions
  FOR ALL 
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon to insert only (for contact form)
CREATE POLICY "Anon can insert" 
  ON contact_submissions
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- Add an index for faster queries
CREATE INDEX idx_contact_submissions_created_at 
  ON contact_submissions(created_at DESC);
CREATE INDEX idx_contact_submissions_status 
  ON contact_submissions(status);
```

4. Click **"Run"** — you should see "Success. No rows returned."

### 1.3 Get your Supabase keys
1. Go to **Settings** → **API** (in the left sidebar)
2. You'll need:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role / secret key** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep this secret!

---

## Step 2: Resend Setup (~3 minutes)

### 2.1 Create a Resend account
1. Go to [resend.com](https://resend.com) and sign up
2. Click **"API Keys"** → **"Create API Key"**
3. Name it `preventli-production`, select **"Full access"**
4. Copy the key → `RESEND_API_KEY`

### 2.2 Verify your domain (important!)
For emails to be sent from `noreply@preventli.com.au`:
1. In Resend, go to **"Domains"** → **"Add Domain"**
2. Enter `preventli.com.au`
3. Add the DNS records shown (TXT, CNAME, MX) to your domain registrar
4. Wait for verification (5–30 minutes)

> **Note:** Until your domain is verified, you can use Resend's sandbox mode. Just set `from` in the API route to `onboarding@resend.dev` for testing.

---

## Step 3: Deploy to Vercel (~10 minutes)

### Option A: Via Vercel CLI (recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to the project
cd /home/paul_clawdbot/preventli-site

# Login to Vercel
vercel login

# Deploy (production)
vercel --prod
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your personal account
- **Link to existing project?** → No
- **Project name?** → `preventli-site`
- **In which directory?** → `.` (current)

### Option B: Via GitHub (for continuous deployment)

1. Push to GitHub:
```bash
cd /home/paul_clawdbot/preventli-site
git init
git add .
git commit -m "feat: initial Preventli site"
git remote add origin https://github.com/YOUR_USERNAME/preventli-site.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → **"New Project"**
3. Import your GitHub repository
4. Vercel auto-detects Next.js — click **"Deploy"**

### 3.1 Add environment variables in Vercel

After deploying, go to your Vercel project → **Settings** → **Environment Variables**

Add each of these:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SITE_URL` | `https://preventli.com.au` |
| `RESEND_API_KEY` | Your Resend API key |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `ADMIN_PASSWORD` | A strong password for /admin |

After adding variables, click **"Redeploy"** (deployments → latest → **Redeploy**).

---

## Step 4: Connect Domain preventli.com.au (~5 minutes)

### 4.1 Add domain in Vercel
1. Go to your Vercel project → **Settings** → **Domains**
2. Type `preventli.com.au` and click **"Add"**
3. Also add `www.preventli.com.au` and redirect to apex domain

### 4.2 Update DNS records at your registrar

Vercel will show you the required DNS records. Typically:

**For apex domain (preventli.com.au):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

DNS propagation takes 5–30 minutes. Vercel provides SSL automatically.

### 4.3 Verify
Once DNS propagates, visit https://preventli.com.au — you should see the site! 🎉

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | ✅ | Your production URL (e.g. `https://preventli.com.au`) |
| `RESEND_API_KEY` | ✅ | Resend API key for email notifications |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL (safe to expose to browser) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key (safe to expose to browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key ⚠️ NEVER expose to browser |
| `ADMIN_PASSWORD` | ✅ | Password to access /admin dashboard |

---

## Admin Dashboard

Access at: **https://preventli.com.au/admin**

### Features:
- 📊 **Stats cards**: Total leads, This week, Conversion rate
- 📋 **Leads table**: All submissions with date, contact details, message
- 🔄 **Status management**: Update leads to New → Contacted → Converted
- 📥 **CSV Export**: Download all leads as a spreadsheet

### Login:
Use the `ADMIN_PASSWORD` you set in Vercel environment variables.

---

## Going Live Checklist

Before sharing the site with customers:

- [ ] Supabase table created and tested
- [ ] Resend API key added and domain verified
- [ ] All 6 environment variables added in Vercel
- [ ] Site redeployed after adding env vars
- [ ] Domain connected and SSL working
- [ ] Test contact form — check email notification arrives
- [ ] Check /admin dashboard loads and shows submissions
- [ ] Update phone number in `components/ContactForm.tsx` (currently `1800 XXX XXX`)
- [ ] Update ABN in `components/Footer.tsx` (currently `XX XXX XXX XXX`)
- [ ] Review pricing — confirm $299/$599/mo tiers match your offering
- [ ] (Optional) Add real testimonials from existing clients
- [ ] Share with customers! 🚀

---

## After Launch — Quick Updates

### Change phone number:
Edit `components/ContactForm.tsx` → find `1800 XXX XXX`

### Change email:
Edit `components/ContactForm.tsx` and `app/api/contact/route.ts` → find `paul@preventli.com.au`

### Change pricing:
Edit `components/Pricing.tsx` → update `monthlyPrice` and `annualPrice`

### Add real testimonials:
Edit `components/Testimonials.tsx` → update the `testimonials` array

---

## Technical Notes

- **Build command**: `npm run build`
- **Node version**: 18+ recommended (tested on 22)
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Pure CSS (IntersectionObserver) — no heavy animation libraries
- **TypeScript**: Strict mode, no `any` types

---

*Built for Preventli — WorkCover Claims Made Preventable*
