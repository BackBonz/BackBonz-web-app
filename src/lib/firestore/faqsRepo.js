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
  writeBatch,
} from 'firebase/firestore'
import { db } from '../../config/firebase'
import { DEFAULT_FAQS } from '../settings/defaults'

const COL = 'faqs'

/**
 * Fetch all FAQs ordered by `order`.
 * Security rule: public read.
 */
export async function listFaqs() {
  const q = query(collection(db, COL), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Add a new FAQ. New items go to the end of the list.
 * Security rule: admin-only write.
 */
export async function addFaq({ question, answer, order }) {
  const ref = await addDoc(collection(db, COL), {
    question,
    answer,
    order: order ?? Date.now(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

/**
 * Update an existing FAQ.
 */
export async function updateFaq(id, { question, answer }) {
  await updateDoc(doc(db, COL, id), {
    question,
    answer,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Delete an FAQ permanently.
 */
export async function deleteFaq(id) {
  await deleteDoc(doc(db, COL, id))
}

/**
 * Replace all FAQs with the default set. Deletes existing docs first.
 * Used by the admin "Restore defaults" action.
 */
export async function seedDefaultFaqs() {
  const existing = await getDocs(collection(db, COL))
  const batch = writeBatch(db)
  existing.docs.forEach((d) => batch.delete(d.ref))
  DEFAULT_FAQS.forEach((faq, i) => {
    const ref = doc(collection(db, COL))
    batch.set(ref, {
      question: faq.question,
      answer: faq.answer,
      order: i,
      updatedAt: serverTimestamp(),
    })
  })
  await batch.commit()
}
