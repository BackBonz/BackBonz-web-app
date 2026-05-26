import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore'
import { db } from '../../config/firebase'

const COL = 'contactMessages'

/**
 * Save a new contact form submission.
 * Security rule: allow create if true (public).
 */
export async function submitMessage({ name, email, role, message }) {
  await addDoc(collection(db, COL), {
    name,
    email,
    role: role || '',
    message,
    submittedAt: serverTimestamp(),
    read: false,
  })
}

/**
 * Fetch all messages, newest first.
 * Security rule: admin-only read.
 */
export async function listMessages() {
  const q = query(collection(db, COL), orderBy('submittedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    submittedAt: d.data().submittedAt?.toDate?.() ?? null,
  }))
}

/**
 * Mark a message as read.
 */
export async function markRead(id) {
  await updateDoc(doc(db, COL, id), { read: true })
}

/**
 * Delete a message permanently.
 */
export async function deleteMessage(id) {
  await deleteDoc(doc(db, COL, id))
}
