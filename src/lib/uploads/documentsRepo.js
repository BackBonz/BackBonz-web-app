import {
  ref,
  uploadBytes,
  getDownloadURL,
  getBytes,
  getBlob,
  deleteObject,
  listAll,
  getMetadata,
} from 'firebase/storage'
import { storage } from '../../config/firebase'

// ── Constants ────────────────────────────────────────────────────────────────

const ALLOWED_EXTENSIONS = ['md', 'pdf', 'docx']
const ALLOWED_MIMES = {
  md:   'text/markdown',
  pdf:  'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

/** Storage paths */
const META_PATH = 'uploads/_meta/active.json'
const pagePath  = (page) => `uploads/${page}`

// ── Validation ───────────────────────────────────────────────────────────────

export function validateFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return `File type ".${ext}" is not allowed. Use .md, .pdf, or .docx.`
  }

  const expectedMime = ALLOWED_MIMES[ext]
  // MIME may be empty string on some systems; only reject if a non-matching type was actually given
  if (file.type && file.type !== expectedMime) {
    return `MIME type "${file.type}" does not match the .${ext} extension.`
  }

  if (file.size > MAX_BYTES) {
    return `File exceeds the 10 MB limit (${(file.size / 1024 / 1024).toFixed(1)} MB).`
  }

  return null // valid
}

// ── Active-doc metadata helpers ──────────────────────────────────────────────

// Uses getBytes (SDK transport) to avoid browser CORS on fetch(downloadURL)
async function readActiveMeta() {
  try {
    const bytes = await getBytes(ref(storage, META_PATH))
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return {}
  }
}

async function writeActiveMeta(meta) {
  const blob = new Blob([JSON.stringify(meta)], { type: 'application/json' })
  await uploadBytes(ref(storage, META_PATH), blob, { contentType: 'application/json' })
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the currently-active document descriptor for a page, or null if none.
 * Shape: { type, src, title, updatedAt }
 * src is a blob: URL so DocumentViewer can fetch it without browser CORS.
 */
export async function getActive(page) {
  try {
    const meta = await readActiveMeta()
    const activePath = meta[page]
    if (!activePath) return null

    const fileRef = ref(storage, activePath)
    const [blob, fileMeta] = await Promise.all([
      getBlob(fileRef),
      getMetadata(fileRef),
    ])

    const ext = activePath.split('.').pop().toLowerCase()
    const type = ext === 'md' ? 'md' : ext === 'pdf' ? 'pdf' : 'docx'
    const src = URL.createObjectURL(blob)
    const updatedAt = fileMeta.updated
      ? new Date(fileMeta.updated).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)

    return { type, src, title: pageTitle(page), updatedAt }
  } catch {
    return null
  }
}

/**
 * Fetches a storage file via SDK and returns a blob: URL safe for the browser to consume.
 * Used by the admin preview to avoid CORS on download URLs.
 */
export async function getDocumentBlobUrl(storagePath) {
  const blob = await getBlob(ref(storage, storagePath))
  return URL.createObjectURL(blob)
}

/**
 * Lists all uploaded documents for a page with metadata.
 * Shape: [{ path, name, type, url, updatedAt, size, isActive }]
 * url is the Firebase download URL (used only for display / copy-link).
 */
export async function listDocuments(page) {
  try {
    const dirRef = ref(storage, pagePath(page))
    const { items } = await listAll(dirRef)

    const meta = await readActiveMeta()
    const activePath = meta[page] ?? null

    const docs = await Promise.all(
      items.map(async (item) => {
        const [url, fileMeta] = await Promise.all([
          getDownloadURL(item),
          getMetadata(item),
        ])
        const ext = item.name.split('.').pop().toLowerCase()
        return {
          path: item.fullPath,
          name: item.name,
          type: ext === 'md' ? 'md' : ext === 'pdf' ? 'pdf' : 'docx',
          url,
          updatedAt: fileMeta.updated
            ? new Date(fileMeta.updated).toISOString().slice(0, 10)
            : '',
          size: fileMeta.size,
          isActive: item.fullPath === activePath,
        }
      })
    )

    // newest first
    return docs.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  } catch {
    return []
  }
}

/**
 * Returns { privacy, userAgreement } — single round-trip helper for dashboard.
 */
export async function getAllData() {
  const [privacyDocs, uaDocs, meta] = await Promise.all([
    listDocuments('privacy'),
    listDocuments('userAgreement'),
    readActiveMeta(),
  ])
  return {
    privacy:       { docs: privacyDocs, activePath: meta.privacy       ?? null },
    userAgreement: { docs: uaDocs,       activePath: meta.userAgreement ?? null },
  }
}

/**
 * Uploads a file for a page. Returns the storage path.
 * Filename: {timestamp}-{sanitised-name}
 */
export async function uploadDocument(page, file) {
  const error = validateFile(file)
  if (error) throw new Error(error)

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `${pagePath(page)}/${Date.now()}-${safeName}`
  const ext = file.name.split('.').pop().toLowerCase()
  await uploadBytes(ref(storage, path), file, { contentType: ALLOWED_MIMES[ext] })
  return path
}

/**
 * Deletes a document. If it was active, clears the active pointer.
 */
export async function deleteDocument(page, path) {
  await deleteObject(ref(storage, path))

  const meta = await readActiveMeta()
  if (meta[page] === path) {
    delete meta[page]
    await writeActiveMeta(meta)
  }
}

/**
 * Sets the active document for a page. Pass null to clear.
 */
export async function setActive(page, path) {
  const meta = await readActiveMeta()
  if (path === null) {
    delete meta[page]
  } else {
    meta[page] = path
  }
  await writeActiveMeta(meta)
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function pageTitle(page) {
  return page === 'privacy' ? 'Privacy Policy' : 'User Agreement'
}
