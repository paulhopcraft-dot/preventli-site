# How to Edit the Preventli Website

## The Simple Mental Model

Every change you make locally → commit → push → Vercel auto-deploys to preventli.ai in ~60 seconds.

```
Your laptop  →  GitHub  →  Vercel  →  preventli.ai
```

---

## Making a Change (the standard workflow)

### 1. Edit the file
Open the relevant file in VS Code or Claude Code and make your change.

### 2. Check what changed
```bash
git diff
```

### 3. Save the change to git
```bash
git add -A
git commit -m "describe what you changed"
git push
```

That's it. Visit preventli.ai in ~60 seconds to see it live.

---

## What File Controls What

| What you want to change | File |
|---|---|
| Hero headline / subheadline | `components/Hero.tsx` |
| Features section | `components/Features.tsx` |
| Pricing tiers and prices | `components/Pricing.tsx` |
| Testimonials | `components/Testimonials.tsx` |
| Contact form | `components/ContactForm.tsx` |
| Footer / ABN / links | `components/Footer.tsx` |
| Navigation bar | `components/Navbar.tsx` |
| Privacy policy text | `app/privacy/page.tsx` |
| Terms of service text | `app/terms/page.tsx` |
| SEO / page title / description | `app/layout.tsx` |
| Email sent when form submitted | `app/api/contact/route.ts` |

---

## Quick Text Edits (no coding needed)

Most text is just strings inside the files. Example — to change the hero headline:

1. Open `components/Hero.tsx`
2. Find: `Stop WorkCover Claims`
3. Change the text
4. Save, commit, push

---

## Things Still To Do

- [ ] Update ABN in `components/Footer.tsx` — search for `XX XXX XXX XXX`
- [ ] Confirm contact form emails go to the right address — check `app/api/contact/route.ts` line 64

---

## If Something Breaks

1. Go to [vercel.com](https://vercel.com) → your project → **Deployments**
2. Click the failing deployment → **View Build Logs**
3. The error is usually near the bottom in red

To quickly undo your last change:
```bash
git revert HEAD
git push
```

---

## Vercel Environment Variables

These are secret keys stored in Vercel (not in the code). If a feature stops working, check these at:
**Vercel → preventli-site → Settings → Environment Variables**

| Variable | What it does |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Should be `https://preventli.ai` |
| `RESEND_API_KEY` | Powers the contact form emails |
| `NEXT_PUBLIC_SUPABASE_URL` | Saves form submissions to database |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase access key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase secret key |
| `ADMIN_PASSWORD` | Password for /admin dashboard |
