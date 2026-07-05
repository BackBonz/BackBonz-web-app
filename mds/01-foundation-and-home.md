# BackBonz — SECTION 1 of 5: Project Foundation + Static Home Page

> Paste this ENTIRE file into Claude in VS Code as your first message.
> Build ONLY what is described here. Do not build dynamic pages, admin, or Firebase yet — those come in later sections. Stub anything that depends on later sections with a clearly-labeled `// TODO (Section X)` comment so the project still runs.

---

## ROLE

You are a senior full-stack engineer, UI/UX designer, and product architect. Build a production-ready marketing website for **BackBonz**, a scoliosis back-brace-tracking mobile app for teens aged 8–16.

This is **Section 1 of a 5-part build**. Your job in this section is to scaffold the whole project and ship a fully working, static, animated Home page. Later sections add dynamic document pages, Firebase, the admin panel, and final polish.

---

## TECH STACK (lock these in now)

- **Build tool:** Vite + React (JavaScript, NOT TypeScript-by-default — but allow `.jsx`)
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router DOM (since this is Vite, not Next.js)
- **Forms (set up the deps, use them in Section 2):** React Hook Form + Zod
- Node 18+

> NOTE: The original spec mixed Next.js `app/page.tsx` conventions with a Vite stack. We are using **Vite + React Router**. Translate any `app/` routing into React Router routes. Use `.jsx` files.

---

## EXACT FOLDER STRUCTURE TO CREATE

```
backbonz/
├── public/
│   ├── robots.txt
│   ├── sitemap.xml
│   └── images/            (placeholder fish/badge assets)
├── src/
│   ├── main.jsx
│   ├── App.jsx            (React Router routes live here)
│   ├── components/
│   │   ├── layout/        (Navbar, Footer, PageShell)
│   │   ├── ui/            (Button, Card, Badge, Container, SectionHeading)
│   │   ├── forms/         (placeholder — built in Section 2)
│   │   ├── sections/      (Hero, Problem, HowItWorks, Features, Countdown, Contact)
│   │   └── admin/         (placeholder — built in Section 3)
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Support.jsx        (placeholder route, "coming in section 2")
│   │   ├── Privacy.jsx        (placeholder route)
│   │   ├── UserAgreement.jsx  (placeholder route)
│   │   └── admin/             (placeholder folder)
│   ├── lib/
│   │   ├── seo/           (SEO/meta helper component)
│   │   ├── auth/          (placeholder — Section 3)
│   │   ├── uploads/       (placeholder — Section 3)
│   │   ├── markdown/      (placeholder — Section 2)
│   │   └── email/         (placeholder — Section 2)
│   ├── hooks/
│   │   └── useCountdown.js
│   ├── config/
│   │   ├── site.js        (brand strings, nav links, launch date)
│   │   └── theme.js       (color tokens mirrored from Tailwind)
│   ├── styles/
│   │   └── index.css      (Tailwind directives + font-face + base styles)
│   └── types/             (JSDoc typedefs only, since JS)
├── .env.example
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── package.json
└── README.md
```

---

## DESIGN SYSTEM — wire these into `tailwind.config.js`

Add a custom `colors` extension with these EXACT hex values, plus the font families.

**Core**
- rebelPink `#EA92CB`
- black `#010003`
- denim `#1455B3`
- yoke `#F9E88A`
- trueBrown `#B46E23`
- cherryRed `#EF5C3F`

**Surface**
- background `#F8F8F6`
- divider `#DADADA`

**Text**
- text-primary `#010003`
- text-secondary `#343335`
- text-tertiary `#676668`
- text-quarter `#99999A`

**Extended pink:** `#EEA8D3` `#F2BEDE` `#F7D3E9`
**Extended blue:** `#4377C2` `#7299D1`
**Extended yellow:** `#FAEDA1` `#FBF1B9` `#FDF6D0`
**Extended brown:** `#C3884F` `#D2A87B` `#E1C5A7`
**Extended red:** `#F27D65` `#F59D8C` `#F9BEB2`

**Fonts** (declare families; fall back gracefully — actual font files dropped in later, use system rounded fallbacks now):
- `font-sans` → "Bianco Sans", ui-rounded, "Segoe UI", system-ui (PRIMARY body)
- `font-display` → "Plakat", "Bianco Sans", sans-serif (decorative headlines)
- `font-fun` → "HeadSurgery", "Plakat", sans-serif (playful accents)

**Type scale (define as Tailwind fontSize tokens):** title-1 32px, title-2 28px, title-3 24px, title-4 20px, title-5 18px, body-lg 18px, body 16px.

**Vibe tokens to use everywhere:** large border-radius (rounded-2xl / rounded-3xl), soft shadows (`shadow-lg shadow-rebelPink/10`), floating cards, soft gradients. Friendly, motivational, teen-focused, playful, NON-medical. No hard edges, no clinical/hospital look, no dense corporate layouts.

---

## CONFIG FILES TO POPULATE

`src/config/site.js` should export:
```js
export const SITE = {
  name: "BackBonz",
  tagline: "Helping teens with scoliosis build confidence and healthy back-brace-wear habits.",
  description:
    "BackBonz helps teens with scoliosis build healthy back-brace-wear habits through tracking, motivation, and companion-based engagement.",
  url: "https://backbonz.com", // adjust at deploy
  contactEmail: "admin.backbonz@gmail.com",
  launchDate: "2026-06-10T00:00:00", // June 10 countdown
  nav: [
    { label: "Home", to: "/" },
    { label: "Support", to: "/support" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "User Agreement", to: "/user-agreement" },
  ],
};
```
(Confirm the launch YEAR with me if unsure — I set 2026; change if needed.)

---

## SEO (set up the system now)

- Create a reusable `<Seo title description image path />` component in `src/lib/seo/` that sets `document.title` and injects/updates `<meta>` + OpenGraph + canonical tags (use a small effect, or install `react-helmet-async` — your call, prefer react-helmet-async).
- Default metadata:
  - Title: `BackBonz — back-brace Tracking for Teens with Scoliosis`
  - Description: as in `SITE.description`
- Create `public/robots.txt` (allow all, point to sitemap) and `public/sitemap.xml` (list `/`, `/support`, `/privacy`, `/user-agreement`).
- **No `noindex` tags anywhere.** Add canonical URLs.

---

## HOME PAGE (`/`) — build it fully and statically

Compose these section components inside `src/components/sections/` and assemble in `pages/Home.jsx`:

1. **Navbar** (`components/layout/Navbar.jsx`)
   - Logo (text "BackBonz" in `font-display` + a small fish glyph is fine), nav links from `SITE.nav`, responsive hamburger menu (Framer Motion slide-in) on mobile. Sticky, translucent-on-scroll.

2. **Hero**
   - Emotional headline + supporting copy below.
   - Suggested copy: "Helping teens with scoliosis build confidence and healthy back-brace-wear habits." then "BackBonz transforms back-brace tracking into a rewarding daily routine through motivation, progress tracking, and companion-based engagement."
   - Floating fish illustrations (use simple inline SVG fish — animate with Framer Motion float/bob).
   - App Store badge placeholder + Google Play badge placeholder (styled placeholder boxes).
   - CTA buttons. Animated soft-gradient background. "Coming Soon" messaging.
   - Embed the **June 10 countdown timer** (use `hooks/useCountdown.js`).

3. **Problem** — three soft cards: back-brace-wearing is emotionally hard; manual tracking is frustrating; motivation drops over time.

4. **How It Works** — animated step cards / timeline: (1) Start your back-brace timer (2) Track your progress (3) Keep your fish swimming (4) Build streaks and rewards.

5. **Features** — feature cards: Live timer tracking, Manual session entry, Fish companion, Streaks & rewards, Journaling, Daily goals, Progress tracking, Emotional support. Each with a Lucide icon.

6. **Countdown** — full-width animated live countdown to June 10 (reuse `useCountdown`).

7. **Contact** — **for now build the static layout/markup ONLY** (Name, Email, Message, optional role dropdown: Teen / Parent / Clinician). Wire it to a no-op submit handler with a `// TODO (Section 2): RHF + Zod + Resend + reCAPTCHA`. Do NOT implement email sending yet.

8. **Footer** (`components/layout/Footer.jsx`) — copyright, contact email, links to Privacy / User Agreement / Support.

`hooks/useCountdown.js` — returns `{ days, hours, minutes, seconds, isLive }` ticking each second toward `SITE.launchDate`.

---

## ACCESSIBILITY & PERF (apply from the start)

- Semantic HTML5 landmarks, aria-labels on icon buttons, keyboard-navigable menu/accordion, visible focus rings, sufficient contrast.
- Lazy-load below-the-fold sections where sensible; optimize images; target Lighthouse 90+.

---

## DELIVERABLES FOR THIS SECTION

1. Complete runnable Vite project (`npm install` → `npm run dev` works with zero errors).
2. All config files (vite, tailwind, postcss, package.json).
3. `.env.example` with placeholder keys we'll fill later (Firebase, Resend, reCAPTCHA).
4. Fully built, animated, responsive **Home page**.
5. Placeholder route stubs for `/support`, `/privacy`, `/user-agreement`, `/admin*` that render a simple "Coming in next build step" panel so routing works.
6. `robots.txt`, `sitemap.xml`, SEO component.
7. README with setup + run instructions.

End your work by printing the file tree you created and the exact commands to run it. Do not start Section 2.
