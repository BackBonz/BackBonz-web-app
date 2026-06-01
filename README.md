# BackBonz — Marketing Website

> **BackBonz** helps teens with scoliosis (ages 8–16) build healthy brace-wear habits through daily tracking, a fish companion that thrives on consistency, and streak-based rewards.

This repository contains the **public marketing website** for BackBonz — not the mobile app itself. It is a React SPA deployed on Vercel with a single serverless function for contact-form email delivery.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Local Setup](#local-setup)
5. [Firebase Setup](#firebase-setup)
6. [Resend + reCAPTCHA Setup](#resend--recaptcha-setup)
7. [Development](#development)
8. [Admin Document Management](#admin-document-management)
9. [Vercel Deployment](#vercel-deployment)
10. [Environment Variables Reference](#environment-variables-reference)
11. [Accessibility, SEO & Compliance Notes](#accessibility-seo--compliance-notes)

---

## Project Overview

The site was built in five sequential milestones:

| # | Section | What was built |
|---|---------|----------------|
| 1 | Foundation | Vite 8 + React 19 + Tailwind v4, brand design tokens, Navbar, Footer, PageShell, Button/Badge/Card/Container UI primitives |
| 2 | Home + Docs + Contact | Hero, Problem, HowItWorks, Features, Countdown, Contact sections; DocumentViewer (md/pdf/docx) for Privacy + User Agreement; Contact form with Resend + reCAPTCHA v3 |
| 3 | Firebase Auth + Admin | Firebase Auth (email/password + Google OAuth), Firebase Storage, admin panel for uploading/managing Privacy and User Agreement documents |
| 4 | Design Polish | Lottie fish animations, app screenshots in HowItWorks, centralized Framer Motion system with `prefers-reduced-motion`, accessibility hardening |
| 5 | Production hardening | SEO finalization, code-splitting, security headers (CSP), COPPA compliance note, Vercel deployment config, README |

**Product loop** shown on site: *Put on brace → Start timer → Fish swims → Build streak → Celebrate 🎉*

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React 19, Vite 8 |
| Styling | Tailwind CSS v4 (config via `@theme {}` in `src/index.css`) |
| Routing | React Router v7 (BrowserRouter, code-split lazy routes) |
| Animation | Framer Motion v12, Lottie React |
| Forms | React Hook Form + Zod |
| SEO | react-helmet-async |
| Markdown | react-markdown + rehype-sanitize + remark-gfm |
| DOCX | mammoth (dynamic import) |
| Auth | Firebase Auth v10 (email/password + Google OAuth) |
| Storage | Firebase Storage v10 |
| Email | Resend (serverless function only — never client-side) |
| Spam protection | Google reCAPTCHA v3 |
| Deploy | Vercel (SPA + 1 serverless function) |

---

## Folder Structure

```
backbonz-web/
├── api/
│   └── contact.js              # Vercel serverless function — email via Resend
├── public/
│   ├── content/
│   │   ├── privacy.md          # Local fallback Privacy Policy
│   │   └── user-agreement.md   # Local fallback User Agreement
│   ├── images/                 # App screenshots (home_screen, entries_screen, account_screen)
│   ├── lottie/                 # Lottie JSON animations (blue/orange/white fish)
│   ├── favicon.svg
│   ├── favicon-32x32.png       # Generate from SVG (see setup)
│   ├── apple-touch-icon.png    # Generate from SVG (see setup)
│   ├── og-image.png            # Generate from og-image.svg (see setup)
│   ├── og-image.svg            # Branded 1200x630 SVG source
│   ├── robots.txt
│   ├── site.webmanifest
│   └── sitemap.xml
├── src/
│   ├── App.jsx                 # Routes (all lazy-loaded with Suspense)
│   ├── main.jsx                # Entry — BrowserRouter + HelmetProvider + AuthProvider
│   ├── index.css               # Tailwind v4 @theme tokens + hero-gradient + reduced-motion
│   ├── config/
│   │   ├── firebase.js         # Canonical Firebase init (reads VITE_FIREBASE_* env vars)
│   │   ├── site.js             # SITE constant — name, URL, nav, contactEmail, launchDate
│   │   └── theme.js
│   ├── components/
│   │   ├── admin/              # Toast, AdminShell, UploadZone, DocumentCard, PreviewModal, ConfirmModal
│   │   ├── forms/
│   │   │   └── ContactForm.jsx
│   │   ├── layout/
│   │   │   ├── Footer.jsx      # Privacy-at-a-glance COPPA summary lives here
│   │   │   ├── Navbar.jsx
│   │   │   └── PageShell.jsx
│   │   ├── sections/           # Hero, Problem, HowItWorks, Features, Countdown, Contact
│   │   └── ui/
│   │       ├── illustrations/
│   │       │   └── Fish.jsx    # Animated SVG fish (pink/blue/yellow/orange variants)
│   │       └── LottiePlayer.jsx
│   ├── hooks/
│   │   ├── useCountdown.js
│   │   └── useRecaptcha.js
│   ├── lib/
│   │   ├── auth/               # AuthProvider, useAuth, RequireAdmin
│   │   ├── firebase/           # Re-exports from config/firebase.js
│   │   ├── markdown/           # DocumentViewer, MarkdownRenderer, PdfViewer, DocxViewer
│   │   ├── motion.js           # Centralized Framer Motion variants (fadeUp, cardReveal, etc.)
│   │   ├── seo/
│   │   │   └── Seo.jsx         # Helmet wrapper with OG + Twitter card + canonical
│   │   └── uploads/
│   │       └── documentsRepo.js # Firebase Storage CRUD + validation for admin documents
│   ├── pages/
│   │   ├── Home.jsx            # JSON-LD SoftwareApplication + Organization
│   │   ├── Privacy.jsx
│   │   ├── Support.jsx
│   │   ├── UserAgreement.jsx
│   │   └── admin/
│   │       ├── index.jsx       # Dashboard — active document status
│   │       ├── documents.jsx   # Upload / manage / preview / delete documents
│   │       └── login.jsx       # Google OAuth + email/password login
│   └── content/
│       └── manifest.json       # Points to local fallback .md files in public/content/
├── .env.example
├── .env.local                  # YOUR secrets — gitignored (never commit this)
├── vercel.json                 # SPA rewrites + security headers (CSP, X-Frame-Options, etc.)
├── storage.cors.json           # Firebase Storage CORS config — apply once via gsutil
└── vite.config.js
```

---

## Local Setup

### Prerequisites

- Node.js 20+
- A Firebase project (see [Firebase Setup](#firebase-setup))
- A Resend account (see [Resend + reCAPTCHA Setup](#resend--recaptcha-setup))

### 1. Clone and install

```bash
git clone https://github.com/YOUR-ORG/backbonz-web.git
cd backbonz-web
npm install
```

### 2. Copy and fill environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in every key (see [Environment Variables Reference](#environment-variables-reference)). The `.env.local` file is gitignored — never commit it.

### 3. Generate PNG icons from SVG (one-time)

The OG image and favicons need PNG variants for full social media and browser compatibility. Use any of:

```bash
# Inkscape CLI
inkscape public/og-image.svg --export-png=public/og-image.png -w 1200 -h 630
inkscape public/favicon.svg --export-png=public/apple-touch-icon.png -w 180 -h 180
inkscape public/favicon.svg --export-png=public/favicon-32x32.png -w 32 -h 32

# ImageMagick alternative
convert -background none public/og-image.svg -resize 1200x630 public/og-image.png
convert -background none public/favicon.svg -resize 180x180 public/apple-touch-icon.png
```

Alternatively use [Squoosh](https://squoosh.app) or [realfavicongenerator.net](https://realfavicongenerator.net) in the browser.

---

## Firebase Setup

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable **Google Analytics** (optional — gracefully degraded in code)

### 2. Enable Authentication

1. Firebase Console → Build → Authentication → Get started
2. Enable **Email/Password** provider
3. Enable **Google** provider, configure OAuth consent screen
4. Create the admin user: Users tab → Add user → use the email set in `VITE_ADMIN_EMAIL`

### 3. Enable Storage

1. Firebase Console → Build → Storage → Get started
2. Choose a region, start in test mode, then apply the rules below

### 4. Apply Storage Security Rules

In Firebase Console → Storage → Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read, write: if request.auth != null
        && request.auth.token.email == "admin.backbonz@gmail.com";
    }
    match /uploads/_meta/active.json {
      allow read: if true;
    }
  }
}
```

Replace `admin.backbonz@gmail.com` with the value of your `VITE_ADMIN_EMAIL`.

### 4b. Apply Firestore Security Rules

In Firebase Console → Firestore Database → Rules. `siteConfig` (editable settings)
and `faqs` are **publicly readable** so the marketing site can render them, and
**admin-only writable**. `contactMessages` is public-create, admin-only read.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null
        && request.auth.token.email == "admin.backbonz@gmail.com";
    }
    match /contactMessages/{id} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
    match /siteConfig/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /faqs/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

Replace `admin.backbonz@gmail.com` with the value of your `VITE_ADMIN_EMAIL`.

### 5. Configure Firebase Storage CORS (required for browser uploads/downloads)

Run once from [Google Cloud Shell](https://shell.cloud.google.com):

```bash
gsutil cors set storage.cors.json gs://YOUR-BUCKET-NAME.firebasestorage.app
```

`storage.cors.json` is included in the repo root.

### 6. Get Firebase web config

Firebase Console → Project Settings → Your apps → Web app → Config snippet. Copy each value into `.env.local`.

---

## Resend + reCAPTCHA Setup

### Resend

1. Sign up at [resend.com](https://resend.com)
2. Add and verify your sending domain
3. Create an API key → `RESEND_API_KEY` in `.env.local`
4. Update the `from:` field in `api/contact.js` to match your verified domain

### reCAPTCHA v3

1. [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin) → Register new site → reCAPTCHA v3
2. Add domains: `backbonz.com`, `localhost`
3. Site Key → `VITE_RECAPTCHA_SITE_KEY` (public, safe in client bundle)
4. Secret Key → `RECAPTCHA_SECRET_KEY` (server-only — never put in a `VITE_` variable)

---

## Development

```bash
npm run dev       # Vite dev server at http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # ESLint
```

To test the contact API locally with the Vercel CLI:

```bash
npm install -g vercel
vercel dev        # Runs Vite + serverless functions on http://localhost:3000
```

Without `vercel dev`, the contact form will call `/api/contact` and gracefully surface an error — the form UI itself is fully testable.

---

## Admin Document Management

### Login

Navigate to `/admin/login`. Sign in with:
- **Google OAuth** (recommended — use the Google account matching `VITE_ADMIN_EMAIL`)
- **Email/Password** (if you created a Firebase password for the admin user)

Any sign-in attempt from a non-admin email is silently rejected at both the client email-guard and the `onAuthStateChanged` listener.

### Uploading documents

1. Go to `/admin/documents`
2. Drag-and-drop or click to upload for **Privacy Policy** or **User Agreement**
3. Supported: `.md`, `.pdf`, `.docx` — max 10 MB
4. Click **Set Active** on the version you want users to see
5. The public `/privacy` and `/user-agreement` pages immediately serve the active Firebase document

### Active document logic

`/uploads/_meta/active.json` in Storage stores `{ privacy: "path", userAgreement: "path" }`. Public pages fetch this silently on load and upgrade from the bundled `.md` fallback if an active document exists. No rebuild or redeploy is needed when switching document versions.

---

## Vercel Deployment

### Step 1 — Connect repository

1. [vercel.com/new](https://vercel.com/new) → Import GitHub repo
2. Framework: **Vite** (auto-detected)
3. Build command: `npm run build`
4. Output directory: `dist`

### Step 2 — Set environment variables

Vercel Dashboard → Project → Settings → Environment Variables. Add all keys from `.env.example`. Server-only keys (no `VITE_` prefix) should be set to **Production** environment only.

### Step 3 — Deploy

```bash
# Push to main (auto-deploys via Git integration)
git push origin main

# Or deploy manually
npx vercel --prod
```

### Step 4 — Custom domain + HTTPS

1. Vercel Dashboard → Project → Settings → Domains
2. Add `backbonz.com` and `www.backbonz.com`
3. Follow DNS instructions (CNAME or A record to Vercel)
4. TLS certificate is provisioned automatically

---

## GitHub Pages Deployment (alternative, no secrets)

The repo also ships a GitHub Actions workflow that builds and publishes the
static SPA to **GitHub Pages** without any repository secrets.

**How env works without secrets:** the build reads `.env.production` (committed).
It contains only `VITE_*` values, which are client-side public by design (Vite
inlines them into the bundle regardless of host; Firebase security is enforced by
Auth + Firestore/Storage rules). Server-only keys (`RESEND_API_KEY`,
`RECAPTCHA_SECRET_KEY`) are intentionally omitted — Pages is static-only and the
contact form writes directly to Firestore, so `api/contact.js` is not used here.

**One-time setup:**

1. Repo → **Settings → Pages → Build and deployment → Source = "GitHub Actions"**.
2. Push to `main` (or run the workflow manually from the Actions tab).

The site publishes at the custom domain **`https://backbonz.app/`** (served from
the root). `public/CNAME` holds the domain so it persists across every deploy.

**Config notes:** `vite.config.js` uses `base: '/'`; the router reads it via
`import.meta.env.BASE_URL` (in `main.jsx`) and public assets referenced from JS
use the `withBase()` helper (`src/lib/format.js`) — both are no-ops at the root,
but keep the app portable if the base ever changes. The workflow copies
`index.html` → `404.html` so client-side routes work on direct navigation.

> Custom domain DNS: an apex domain (`backbonz.app`) needs `A`/`AAAA` records to
> GitHub Pages IPs (or `ALIAS`/`ANAME`); a `www` subdomain uses a `CNAME` to
> `backbonz.github.io`. Keep "Enforce HTTPS" enabled in repo Settings → Pages.

---

## Environment Variables Reference

```bash
# ── Firebase (VITE_ prefix = bundled into client, safe to expose) ────
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=       # optional

# ── Admin ────────────────────────────────────────────────────────────
VITE_ADMIN_EMAIL=admin.backbonz@gmail.com

# ── reCAPTCHA v3 ─────────────────────────────────────────────────────
VITE_RECAPTCHA_SITE_KEY=            # PUBLIC — safe in client bundle
RECAPTCHA_SECRET_KEY=               # SERVER-ONLY — never in VITE_*

# ── Resend email ─────────────────────────────────────────────────────
RESEND_API_KEY=                     # SERVER-ONLY
CONTACT_TO_EMAIL=support.backbonz@gmail.com
```

**Security model:**
- `VITE_*` keys are embedded in the client bundle at build time and visible to anyone who inspects the source. Firebase web config keys are [intentionally public](https://firebase.google.com/docs/web/setup#available-libraries) — they are scoped and restricted by Firebase Security Rules.
- `RESEND_API_KEY` and `RECAPTCHA_SECRET_KEY` are read only by `api/contact.js` (serverless function) and never reach the browser bundle.

---

## Accessibility, SEO & Compliance Notes

### Accessibility (WCAG 2.1 AA target)

- Visible focus rings on all interactive elements (`:focus-visible`, denim outline, 3px)
- Hamburger meets 44×44 px minimum tap target (WCAG 2.5.5)
- All images have `alt` text; decorative elements have `aria-hidden="true"`
- `prefers-reduced-motion` respected in CSS (hero gradient, transitions) and JS (Framer Motion variants, Lottie, Countdown digit flip)
- Landmark regions: `<header role="banner">`, `<main id="main-content" tabIndex={-1}>`, `<footer role="contentinfo">`, `<nav aria-label="…">`
- Section headings have `id` wired to the parent section's `aria-labelledby`
- Admin modals use `role="dialog"` / `role="alertdialog"` with `aria-modal="true"`

### SEO

- Unique `<title>` and `<meta name="description">` per route via `Seo.jsx`
- Canonical URLs, Open Graph (og:title/description/image/url/type), Twitter Card on all public pages
- JSON-LD `SoftwareApplication` + `Organization` structured data on Home
- Sitemap at `/sitemap.xml` (4 public routes, no `/admin*`)
- `robots.txt`: `Disallow: /admin` and `Disallow: /admin/`
- `noindex, nofollow` only on `/admin*` pages (via `<Helmet>` meta tag in each admin page component)
- Clean BrowserRouter paths — no hash routing; Vercel SPA rewrite handles direct URL access

### COPPA / Kids Category Compliance

BackBonz targets users aged 8–16. Key compliance facts for app store reviewers:

| Requirement | Status |
|-------------|--------|
| No third-party ad networks | ✅ Zero ad code |
| No behavioral tracking / profiling | ✅ No cookies, no localStorage profiling |
| No analytics on marketing site | ✅ Firebase Analytics optional, not on marketing site |
| Minimal data collection | ✅ Contact form: email-only delivery, nothing stored |
| Parental consent for under-13 | ✅ Required in User Agreement |
| Privacy Policy at stable URL | ✅ `https://backbonz.com/privacy` |
| Terms at stable URL | ✅ `https://backbonz.com/user-agreement` |
| Plain-language privacy summary | ✅ Footer "Privacy at a glance" on every page |
| Data deletion / export | ✅ Described in User Agreement |

### Security

- Admin routes protected by Firebase Auth + email allow-list
- File uploads: extension allow-list (`.md`, `.pdf`, `.docx`), MIME check, 10 MB cap
- Markdown: `rehype-sanitize`; DOCX HTML: `DOMPurify`
- reCAPTCHA v3 server-side verified (score ≥ 0.5)
- Rate limiting: 3 req/min/IP on contact endpoint
- Security headers via `vercel.json`: CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`
- No secrets in client bundle beyond intended public Firebase config + reCAPTCHA site key
