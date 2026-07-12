import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { db, storage } from '../../config/firebase'

const COL = 'stickers'

// ── Image validation ─────────────────────────────────────────────────────────

const ALLOWED_IMAGE_MIMES = ['image/png', 'image/webp']
const MAX_IMAGE_BYTES = 1 * 1024 * 1024 // 1 MB — stickers are small transparent PNG/WebP

export function validateStickerImage(file) {
  if (!ALLOWED_IMAGE_MIMES.includes(file.type)) {
    return 'Sticker image must be a PNG or WebP file.'
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `Image exceeds the 1 MB limit (${(file.size / 1024 / 1024).toFixed(2)} MB).`
  }
  return null // valid
}

// ── Unlock-rule types ────────────────────────────────────────────────────────
// These MUST stay in sync with the Cloud Function evaluator (functions/src/index.ts)
// and the Flutter StickerModel.
export const UNLOCK_TYPES = [
  { value: 'daily_goal', label: 'Complete daily goal', needsValue: false },
  { value: 'streak',     label: 'Reach an N-day streak', needsValue: true },
  { value: 'manual',     label: 'Manual only (never auto-unlocks)', needsValue: false },
]

// ── sticker_id ───────────────────────────────────────────────────────────────

/** Normalise a raw id into a safe, stable doc/join key: lowercase snake_case. */
export function normaliseStickerId(raw) {
  return String(raw)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

// ── Storage ──────────────────────────────────────────────────────────────────

const imgPath = (stickerId) => `stickers/${stickerId}-${Date.now()}.png`

/**
 * Uploads a sticker image to Storage and returns { url, path }.
 */
export async function uploadStickerImage(stickerId, file) {
  const error = validateStickerImage(file)
  if (error) throw new Error(error)

  const path = imgPath(stickerId)
  const fileRef = ref(storage, path)
  await uploadBytes(fileRef, file, { contentType: file.type })
  const url = await getDownloadURL(fileRef)
  return { url, path }
}

async function deleteStorageImage(path) {
  if (!path) return
  try {
    await deleteObject(ref(storage, path))
  } catch {
    // Ignore missing-object errors — the doc delete is what matters.
  }
}

// ── CRUD ─────────────────────────────────────────────────────────────────────

/**
 * Fetch all stickers ordered by `order`.
 * Pass { includeInactive: true } for the admin list; the app reads active only.
 */
export async function listStickers({ includeInactive = true } = {}) {
  const q = query(collection(db, COL), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  return includeInactive ? items : items.filter((s) => s.active !== false)
}

/**
 * Create a new sticker. The doc id IS the sticker_id (guarantees uniqueness and
 * keeps it as the stable join-key across users/journals).
 * Throws if a sticker with that id already exists.
 */
export async function addSticker({ stickerId, title, imageUrl, imagePath, unlock, criteriaLabel, order }) {
  const id = normaliseStickerId(stickerId)
  if (!id) throw new Error('A sticker ID is required.')

  const existing = await getDoc(doc(db, COL, id))
  if (existing.exists()) {
    throw new Error(`Sticker ID "${id}" already exists. Choose a different ID.`)
  }

  await setDoc(doc(db, COL, id), {
    title,
    image_url: imageUrl,
    image_path: imagePath,
    unlock,
    criteria_label: criteriaLabel,
    order: order ?? Date.now(),
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return id
}

/**
 * Update an existing sticker's editable fields. The sticker_id (doc id) is
 * immutable — it is the join-key referenced by existing journals/users.
 * Only the provided fields are written.
 */
export async function updateSticker(id, fields) {
  const patch = { updatedAt: serverTimestamp() }
  if (fields.title !== undefined)         patch.title = fields.title
  if (fields.imageUrl !== undefined)      patch.image_url = fields.imageUrl
  if (fields.imagePath !== undefined)     patch.image_path = fields.imagePath
  if (fields.unlock !== undefined)        patch.unlock = fields.unlock
  if (fields.criteriaLabel !== undefined) patch.criteria_label = fields.criteriaLabel
  if (fields.order !== undefined)         patch.order = fields.order
  if (fields.active !== undefined)        patch.active = fields.active
  await updateDoc(doc(db, COL, id), patch)
}

/**
 * Replace a sticker's image: uploads the new file, points the doc at it, then
 * removes the old Storage object.
 */
export async function replaceStickerImage(id, oldPath, file) {
  const { url, path } = await uploadStickerImage(id, file)
  await updateSticker(id, { imageUrl: url, imagePath: path })
  if (oldPath && oldPath !== path) await deleteStorageImage(oldPath)
  return { url, path }
}

/**
 * Soft-delete: hides the sticker from the app while keeping the doc (and its id)
 * so existing journal entries and users' unlocked_stickers still resolve.
 */
export async function softDeleteSticker(id) {
  await updateDoc(doc(db, COL, id), {
    active: false,
    updatedAt: serverTimestamp(),
  })
}

/** Re-activate a soft-deleted sticker. */
export async function restoreSticker(id) {
  await updateDoc(doc(db, COL, id), {
    active: true,
    updatedAt: serverTimestamp(),
  })
}
