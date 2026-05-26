# BackBonz Build — 5 Section Prompts (read me first)

Upload these to Claude in VS Code **in order**, in the **same chat**, one at a time. Wait for each to finish and confirm it runs before pasting the next. Each file is a complete, self-contained instruction set that references what the previous section built.

| # | File | What it builds |
|---|------|----------------|
| 1 | `01-foundation-and-home.md` | Folder structure, full config, design system, SEO scaffold, and the complete **static animated Home page**. Placeholder routes for the rest so it runs. |
| 2 | `02-dynamic-pages-and-forms.md` | **Dynamic pages**: Support (FAQ + form), Privacy & User Agreement document viewer (md/pdf/docx) from local sample content, reusable contact form + Resend email + reCAPTCHA. |
| 3 | `03-firebase-auth-admin.md` | **Firebase Storage + Auth**, single-admin login, protected routes, and the **admin panel** (upload/replace/delete/preview/toggle-active). Public doc pages switch to Firebase. |
| 4 | `04-design-polish-and-a11y.md` | **Design + things**: gradient/blob system, animated fish illustrations, motion system, responsive QA (iPhone-portrait first), accessibility hardening, emotion/copy pass. |
| 5 | `05-seo-security-deploy.md` | **Finalize**: SEO/OG/JSON-LD, performance (Lighthouse 90+), security headers, COPPA/kids compliance, full README, and Vercel deployment. |

## About your 32MB upload limit
These prompt files are plain text (a few KB each), so size is not a concern — the real reason to split is to keep each build step focused enough that Claude completes it well in one pass without losing the thread. Upload them one per turn, not all at once.

## Decisions I made (change if you disagree, then tell Claude)
1. **Vite + React Router, not Next.js.** Your spec listed Vite as the build tool but used Next.js `app/page.tsx` routing. You can't have both. I went with **Vite + React Router DOM** and translated the routes. (If you actually want Next.js, say so and I'll rewrite Section 1 — note Next.js changes the API-route and SEO setup.)
2. **JavaScript with `.jsx`**, per your stack (you said JavaScript, not TypeScript). Types are JSDoc-only.
3. **`api/contact.js` as a Vercel Serverless Function** for Resend + reCAPTCHA verification, because a pure SPA can't safely call Resend from the browser (your secret key must stay server-side).
4. **Launch countdown set to `2026-06-10`.** Confirm the year — it's in `src/config/site.js`.
5. **`noindex` only on `/admin*`**; all public pages stay indexable, per your SEO requirement.

## Tip for each paste
At the top of each section after the first, you can add one line: *"Continue the same BackBonz project from the previous section; don't recreate existing files unless changing them."* That keeps Claude from regenerating Section 1's work.
