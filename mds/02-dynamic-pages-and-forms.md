# BackBonz — SECTION 2 of 5: Dynamic Pages (Support, Privacy, User Agreement) + Forms & Email

> Paste this ENTIRE file into the SAME Claude in VS Code chat, AFTER Section 1 is built and running.
> Build ONLY what is described here. The actual file UPLOAD/admin storage comes in Section 3 — for now, render documents from local sample files in `src/content/` and read the "active document" from a simple JSON manifest. Mark Firebase touch-points with `// TODO (Section 3)`.

---

## CONTEXT

Section 1 produced a running Vite + React + Tailwind + Framer Motion project with a complete static Home page and placeholder routes for `/support`, `/privacy`, `/user-agreement`. Now we make the content pages real and wire up the contact + support forms with validation and email delivery.

Do not change the Home page design language — reuse the same `ui/` components, colors, fonts, and soft/playful style.

---

## DEPENDENCIES TO ADD

- `react-hook-form`, `zod`, `@hookform/resolvers`
- `react-markdown`, `remark-gfm`, `rehype-sanitize` (XSS-safe markdown)
- `react-pdf` (PDF preview) — or fall back to an `<iframe>` viewer if react-pdf worker setup is heavy
- `mammoth` (DOCX → HTML conversion in the browser)
- Resend integration will run via a serverless function (see EMAIL section)

---

## 1) DOCUMENT RENDERING ENGINE (shared by Privacy + User Agreement)

Build a reusable `DocumentViewer` component in `src/lib/markdown/` (plus supporting files) that:

- Accepts a document descriptor `{ type: "md" | "pdf" | "docx", src, title, updatedAt }`.
- **Detects file type** and renders accordingly:
  - **Markdown** → `react-markdown` + `remark-gfm`, sanitized with `rehype-sanitize`. Style it beautifully (typographic rhythm, headings in `font-display`, soft dividers, readable line length ~70ch).
  - **PDF** → embedded preview (`react-pdf` paged viewer, or iframe fallback). Mobile-friendly.
  - **DOCX** → convert to HTML with `mammoth` in-browser, then sanitize before injecting. NEVER inject unsanitized HTML (DOMPurify or rehype-sanitize). Guard against XSS.
- Provides these UX features around the rendered content:
  - **Sticky sidebar** with a table of contents (auto-generated from markdown headings; for PDF/DOCX show document meta + download).
  - **Search inside document** (client-side text filter / highlight).
  - **Scroll progress** bar at the top.
  - Fully **mobile optimized** (sidebar collapses to a drawer).
  - "Last updated" timestamp + a download/open-original button.

For THIS section, source documents from local samples so the pages work end-to-end:
- Create `src/content/privacy.md` and `src/content/user-agreement.md` with realistic, COPPA-aware placeholder policy text (clearly marked as placeholder/sample).
- Create `src/content/manifest.json` describing which file is "active" for each page, e.g.:
  ```json
  {
    "privacy": { "type": "md", "src": "/content/privacy.md", "title": "Privacy Policy", "updatedAt": "2026-05-01" },
    "userAgreement": { "type": "md", "src": "/content/user-agreement.md", "title": "User Agreement", "updatedAt": "2026-05-01" }
  }
  ```
- Add a clear comment: `// TODO (Section 3): replace local manifest/content with Firebase Storage-backed active document.`

## 2) PRIVACY PAGE (`/privacy`)
Render the active privacy document through `DocumentViewer`. Hero header on top (consistent with brand), then the viewer with sticky TOC sidebar, in-doc search, and scroll progress.

## 3) USER AGREEMENT PAGE (`/user-agreement`)
Identical functionality to Privacy, pointed at the user-agreement document. Reuse the same `DocumentViewer` — do not duplicate logic.

## 4) SUPPORT PAGE (`/support`)
Build:
- **Hero section** (friendly, on-brand).
- **Contact details** (support email `admin.backbonz@gmail.com`, expected response time, "Coming Soon" note).
- **FAQ accordion** (Framer Motion expand/collapse, keyboard accessible, aria-expanded). MUST include these questions with helpful teen/parent-friendly answers:
  - How to use the brace timer
  - How parental consent works
  - How to request account deletion
  - How to request a data export
  - Privacy / data concerns
- **Support form** — reuse the SAME reusable form component as the Home contact form (see below).

## 5) REUSABLE CONTACT/SUPPORT FORM + EMAIL

Build a single reusable `ContactForm` component in `src/components/forms/` used by BOTH the Home Contact section and the Support page.

- Fields: **Name**, **Email**, **Message**, optional **role** dropdown (Teen / Parent / Clinician).
- Validation: **React Hook Form + Zod** schema (required name, valid email, min message length, optional role enum).
- States: explicit **loading**, **success**, and **error** UI states (animated, on-brand, friendly copy).
- **Google reCAPTCHA v3**: integrate token generation on submit (use the v3 site key from env; verify server-side in the function below). Wrap app or component with the reCAPTCHA provider; load script lazily.
- **Email delivery only — NO database storage.** On submit, POST to a serverless function that calls the **Resend** API and emails to `admin.backbonz@gmail.com`.

### Serverless email function
Since this is a Vite SPA (not Next.js), create a deployable serverless endpoint for Vercel at `api/contact.js` (Vercel Serverless Function) that:
- Accepts `{ name, email, message, role, recaptchaToken }`.
- **Verifies the reCAPTCHA v3 token** with Google (server-side) and rejects low scores.
- Sends the email via **Resend** (`RESEND_API_KEY` from env) to `admin.backbonz@gmail.com`, with a clean HTML template.
- Applies basic **rate limiting** (per-IP, in-memory or lightweight) and validates/sanitizes inputs server-side too.
- Returns clear success/error JSON. Never stores anything.

Add to `.env.example`:
```
VITE_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
RESEND_API_KEY=
CONTACT_TO_EMAIL=admin.backbonz@gmail.com
```

---

## ACCESSIBILITY & SECURITY (keep applying)
- Sanitize ALL rendered markdown/DOCX/HTML (no XSS). 
- Forms: labels tied to inputs, aria-live for status, keyboard operable, focus management on success/error.
- FAQ + drawers fully keyboard navigable.

---

## DELIVERABLES FOR THIS SECTION
1. `DocumentViewer` engine (md/pdf/docx) with sticky TOC, search, scroll progress, mobile drawer.
2. Real `/privacy` and `/user-agreement` pages rendering sample local content via the manifest.
3. Real `/support` page with hero, contact details, FAQ accordion, and the reusable form.
4. Reusable `ContactForm` (RHF + Zod, loading/success/error, reCAPTCHA v3) wired into Home + Support.
5. `api/contact.js` serverless function (Resend + reCAPTCHA verify + rate limit, no storage).
6. Updated `.env.example`.
7. Updated `sitemap.xml` already includes these routes (verify).

End by printing the new/changed file tree and how to test the form locally. Do not start Section 3.
