# BackBonz — SECTION 3 of 5: Firebase (Auth + Storage) + Admin Panel + Upload System

> Paste this ENTIRE file into the SAME chat AFTER Section 2 is built.
> This section replaces the local sample-content manifest from Section 2 with a real Firebase-backed system, and adds the protected admin panel that manages the documents shown on `/privacy` and `/user-agreement`.

---

## CONTEXT

Sections 1–2 produced: a static Home page, and dynamic `/support`, `/privacy`, `/user-agreement` pages where the document pages currently read from local `src/content/` files via a JSON manifest. Now we make documents admin-managed: an admin uploads `.md` / `.pdf` / `.docx`, picks the active version, and the public pages render it from **Firebase Storage**.

Reuse all existing brand components and the `DocumentViewer` from Section 2 unchanged on the public side — only swap its data source.

---

## DEPENDENCIES
- `firebase` (modular SDK v10+): Auth + Storage.
- Keep migration easy: put ALL Firebase access behind a thin repository layer in `src/lib/uploads/` and `src/lib/auth/` so the rest of the app never imports Firebase directly. This makes a future backend migration low-effort.

---

## 1) FIREBASE SETUP (`src/config/firebase.js` + `.env`)

- Initialize Firebase app from env vars (NEVER hardcode keys).
- Export `auth` and `storage` instances.
- Add to `.env.example`:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_ADMIN_EMAIL=admin.backbonz@gmail.com
```
- Provide the recommended **Firebase Storage security rules** in the README: only an authenticated admin can write to `/uploads/**`; public read allowed for the active document paths (or generate signed/download URLs). Document this clearly.

## 2) STORAGE STRUCTURE (in Firebase Storage)

```
/uploads/privacy/<timestamp>-<filename>.(md|pdf|docx)
/uploads/user-agreement/<timestamp>-<filename>.(md|pdf|docx)
/uploads/_meta/active.json     # which file is the active version per page + timestamps
```

The `active.json` manifest (read by the public pages) describes, per page: active file path, type, original filename, uploadedAt, and a list of all versions. Public `/privacy` and `/user-agreement` read THIS instead of the local Section-2 manifest.

Repository layer (`src/lib/uploads/documentsRepo.js`) exposes:
- `listDocuments(page)` → all uploaded versions for a page
- `uploadDocument(page, file)` → validates + stores, returns descriptor
- `deleteDocument(page, path)`
- `setActive(page, path)` → toggles active version
- `getActive(page)` → the descriptor the public viewer consumes

Update Section-2's `DocumentViewer` data source: public pages now call `getActive(page)` and fetch the file's download URL from Storage. Remove/disable the local-content TODO. Keep a graceful fallback message if no document is active yet.

## 3) AUTH (single admin)

- In `src/lib/auth/`: email/password sign-in via Firebase Auth for a **single admin** account (email from `VITE_ADMIN_EMAIL`).
- `useAuth()` hook exposing `{ user, loading, signIn, signOut }`.
- **Protected route wrapper** `<RequireAdmin>` that:
  - shows a loading state while auth resolves,
  - redirects unauthenticated users to `/admin/login`,
  - only allows the configured admin email (defense in depth).
- Persist session (Firebase default persistence). Protect ALL `/admin/*` routes except `/admin/login`.

## 4) ADMIN ROUTES & PANEL (`src/pages/admin/` + `src/components/admin/`)

Routes:
- `/admin/login` — clean, on-brand login form (RHF + Zod), loading/error states. NOT indexed.
- `/admin` — dashboard overview (greeting, current active docs at a glance, quick links).
- `/admin/documents` — the document manager.

**Dashboard / document manager features (all required):**
1. Upload Privacy Policy document
2. Upload User Agreement document
3. Replace an existing file (upload new version)
4. Preview uploaded content (reuse `DocumentViewer` in a modal/panel)
5. Delete uploaded files (with confirm)
6. Toggle the **active version** per page
7. Accept uploads of **.md / .pdf / .docx**
8. Show **upload timestamps** and original filenames, sorted newest first

UI: friendly, simple, same design system — but slightly more utilitarian than the marketing pages. Clear empty states, loading spinners, success/error toasts.

## 5) UPLOAD VALIDATION & SECURITY

In the upload path (client AND ideally a serverless guard):
- **Extension allow-list:** only `.md`, `.pdf`, `.docx`.
- **MIME validation:** verify the file's MIME type matches the extension (`text/markdown`/`text/plain`, `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`).
- **Max file size** limit (e.g. 10 MB) — reject larger.
- Sanitize rendered output (already handled in `DocumentViewer`; keep it).
- Protected admin routes (done via `<RequireAdmin>`).
- Add `/admin` and `/admin/*` to `robots.txt` as disallowed, and ensure these pages emit `noindex` (this is the ONLY place noindex is allowed — keep public pages indexable).

---

## DELIVERABLES FOR THIS SECTION
1. `src/config/firebase.js` + env additions + documented Storage security rules in README.
2. Repository layer (`auth/`, `uploads/`) that fully encapsulates Firebase (migration-friendly).
3. Working single-admin auth + `<RequireAdmin>` protected routes.
4. `/admin/login`, `/admin`, `/admin/documents` pages.
5. Full upload system: upload, replace, delete, preview, toggle-active, timestamps — for both privacy and user-agreement.
6. Public `/privacy` and `/user-agreement` now render the Firebase **active** document via the unchanged `DocumentViewer`.
7. File validation (extension + MIME + size) and admin `noindex` + robots disallow.

End by printing the changed file tree, the Firebase Storage rules, and step-by-step instructions to create the admin user and test an upload. Do not start Section 4.
