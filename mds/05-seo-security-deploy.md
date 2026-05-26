# BackBonz — SECTION 5 of 5: SEO, Performance, Security, Compliance, README & Vercel Deploy

> Paste this ENTIRE file into the SAME chat AFTER Section 4 is built.
> Final hardening + ship. No new product features — make it production-ready, reviewable, and deployable.

---

## CONTEXT

The site is now feature-complete and polished. This final section finalizes SEO, performance, security, COPPA/kids-category compliance, documentation, and deployment to Vercel — everything needed for Apple App Store Kids Category and Google Play Families Policy reviewer legitimacy verification, public support/privacy URLs, and search indexing.

---

## 1) SEO FINALIZATION
- Verify per-route metadata via the `Seo` component: unique title + description + canonical + OpenGraph (og:title, og:description, og:image, og:url, og:type) + Twitter card for `/`, `/support`, `/privacy`, `/user-agreement`.
- Generate/verify **`public/sitemap.xml`** listing all public routes with `lastmod`; exclude `/admin*`.
- Verify **`public/robots.txt`**: allow public routes, `Disallow: /admin`, reference the sitemap URL.
- Confirm **no `noindex`** on public pages; `noindex` ONLY on `/admin*`.
- Add an **OpenGraph image**: create a branded `public/og-image.png` placeholder (BackBonz logo + tagline + fish) and wire it as default `og:image`. Add favicon + apple-touch-icon + web manifest (`site.webmanifest`) with brand colors.
- Add JSON-LD structured data on Home (`SoftwareApplication` / `Organization`) — accurate, minimal.

## 2) PERFORMANCE (target Lighthouse 90+ on mobile)
- Code-split routes (lazy + Suspense), especially heavy deps: `react-pdf`, `mammoth`, admin bundle, Firebase — keep them OUT of the initial Home bundle.
- Optimize images (compressed, correct dimensions, `loading="lazy"`, width/height to avoid CLS, prefer SVG for illustrations/badges).
- Self-host or `preconnect`/`display=swap` fonts; subset if possible.
- Audit bundle size (`vite build` + a visualizer); remove dead code. Defer non-critical animation work.
- Ensure no layout shift; lazy-load below-the-fold sections.

## 3) SECURITY AUDIT
- Confirm: protected admin routes, file upload validation (extension + MIME + size), sanitized markdown/DOCX/HTML (no XSS), reCAPTCHA v3 verified server-side, per-IP rate limiting on the contact function.
- Add basic security headers via `vercel.json` (Content-Security-Policy as tight as the stack allows — allow Firebase/Google/Resend/recaptcha endpoints; `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options`/frame-ancestors).
- Ensure NO secrets in client bundle beyond intended `VITE_` public keys (Firebase web config + reCAPTCHA site key are public by design; `RESEND_API_KEY` and `RECAPTCHA_SECRET_KEY` stay server-only in the function env).
- CSRF: the contact endpoint is stateless + token-checked (reCAPTCHA) + origin-checked; document this.

## 4) COMPLIANCE (COPPA / Kids Category — important for reviewers)
- **No third-party analytics, no ad networks, no behavioral tracking, no unnecessary data collection.** Privacy-first by default. Contact form is email-only, stores nothing.
- Confirm the privacy policy + user agreement pages load reliably from public, stable URLs (these are what reviewers check).
- Add a short, honest "Privacy at a glance" / kids-safety note on Support or Footer summarizing minimal-data practices, with a link to the full policy.
- Make sure stable, exact URLs are guaranteed: `/`, `/support`, `/privacy`, `/user-agreement` (no trailing-slash ambiguity, no hash routing — use clean BrowserRouter paths; configure Vercel rewrites for SPA fallback).

## 5) VERCEL DEPLOYMENT CONFIG
- Add `vercel.json` with: SPA rewrite (`/* → /index.html`) EXCEPT `/api/*` (serverless functions), security headers (above), and clean-URL behavior.
- Ensure `api/contact.js` deploys as a Vercel Serverless Function and reads server-only env vars.
- Document required env vars in Vercel dashboard (all keys from `.env.example`, split by client `VITE_*` vs server-only).
- Provide the exact deploy steps (connect repo → set env vars → build command `npm run build`, output `dist` → deploy), plus custom-domain + HTTPS note.

## 6) README (final, complete)
Write a thorough `README.md` covering:
- Project overview + the BackBonz product loop.
- Tech stack and the 5-section architecture (brief).
- Full local setup: clone, `npm install`, copy `.env.example` → `.env`, fill keys.
- Firebase setup: create project, enable Auth (email/password) + Storage, create the single admin user, paste the Storage security rules.
- Resend + reCAPTCHA v3 key setup.
- How to run dev, build, preview.
- How to manage privacy/user-agreement documents via `/admin`.
- Vercel deployment steps + required env vars.
- Folder-structure map and where things live.
- Accessibility, SEO, and compliance notes for reviewers.

## 7) FINAL QA CHECKLIST (run through and report)
Produce a checklist confirming: all routes load; forms validate + send email + show all states; documents render for md/pdf/docx; admin upload/replace/delete/toggle-active works; mobile iPhone-portrait looks great; Lighthouse mobile scores (Perf/A11y/Best-Practices/SEO) with numbers; sitemap/robots correct; no console errors; secrets not leaked to client.

---

## DELIVERABLES FOR THIS SECTION
1. Finalized per-route SEO + OG image + favicons + web manifest + JSON-LD.
2. Performance optimizations (code-splitting, lazy heavy deps, image/font optimization) with reported Lighthouse numbers.
3. Security headers via `vercel.json` + documented secret handling + audit summary.
4. COPPA/kids-category compliance confirmations + "privacy at a glance" note + stable clean URLs.
5. `vercel.json` + full Vercel deployment instructions.
6. Complete production `README.md`.
7. Final QA checklist report.

This completes the BackBonz build. End by printing the final full project tree and the deployment command sequence.
