import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { DEFAULT_SETTINGS } from '../settings/defaults'

const COL = 'siteConfig'
const DOC = 'main'

/**
 * Returns site settings merged over DEFAULT_SETTINGS.
 * Security rule: public read.
 */
export async function getSettings() {
  try {
    const snap = await getDoc(doc(db, COL, DOC))
    return snap.exists() ? { ...DEFAULT_SETTINGS, ...snap.data() } : { ...DEFAULT_SETTINGS }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

/**
 * Saves a partial settings update (merged into the existing doc).
 * Security rule: admin-only write.
 */
export async function saveSettings(partial) {
  await setDoc(
    doc(db, COL, DOC),
    { ...partial, updatedAt: serverTimestamp() },
    { merge: true }
  )
}
