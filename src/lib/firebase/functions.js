import { getFunctions, httpsCallable } from 'firebase/functions'
import { app } from '../../config/firebase'

// The BackBonz Cloud Functions are deployed to the default region (us-central1),
// which is also getFunctions()'s default — so no region override is needed.
export const functions = getFunctions(app)

/** Convenience wrapper for an onCall function by name. */
export function callable(name) {
  return httpsCallable(functions, name)
}
