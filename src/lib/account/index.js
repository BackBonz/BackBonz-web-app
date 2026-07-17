import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../../config/firebase'
import { callable } from '../firebase/functions'

// Reuse the already-deployed OTP + deletion Cloud Functions.
//  • sendPasswordResetOTP  → validates the email/password account and emails a
//    6-digit code, returning a verificationId.
//  • verifyPasswordResetOTP → checks the code against that verificationId.
//  • deleteUserAccount      → deletes all Firestore data + the Auth user for the
//    *currently authenticated* caller, and emails a confirmation.
const sendOtp = callable('sendPasswordResetOTP')
const verifyOtp = callable('verifyPasswordResetOTP')
const deleteAccount = callable('deleteUserAccount')

/**
 * Step 1 — find the account by signing in with the supplied credentials
 * (this both locates the account and verifies the password), then email a
 * 6-digit verification code to that address.
 *
 * On success the user is left signed in so that step 2 can call the
 * auth-protected deleteUserAccount function. If we fail to send the code we
 * sign back out so no half-open session lingers.
 *
 * @param {{ email: string, password: string }} creds
 * @returns {Promise<string>} verificationId to pass to confirmDeletion()
 */
export async function requestDeletionCode({ email, password }) {
  await signInWithEmailAndPassword(auth, email.trim(), password)
  try {
    const { data } = await sendOtp({ email: email.trim() })
    return data.verificationId
  } catch (err) {
    await signOut(auth).catch(() => {})
    throw err
  }
}

/**
 * Step 2 — verify the emailed code, then permanently delete the account and all
 * associated data. Clears the local session afterwards (the Auth user no longer
 * exists once deletion succeeds).
 *
 * @param {{ verificationId: string, otp: string }} args
 */
export async function confirmDeletion({ verificationId, otp }) {
  await verifyOtp({ verificationId, otp: otp.trim() })
  await deleteAccount()
  await signOut(auth).catch(() => {})
}

/** Abandon an in-progress deletion — drops the temporary signed-in session. */
export function cancelDeletion() {
  return signOut(auth).catch(() => {})
}

/**
 * Map Firebase Auth / Functions error codes to friendly, user-facing copy.
 * @param {any} err
 * @returns {string}
 */
export function deletionErrorMessage(err) {
  const code = err?.code || ''
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address doesn’t look right. Please check and try again.'
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'We couldn’t find an account with that email and password. Please double-check your details.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.'
    case 'functions/failed-precondition':
      return 'This account doesn’t use email & password sign-in, so it can’t be deleted here.'
    case 'functions/not-found':
      return 'We couldn’t find an account for that email.'
    case 'functions/permission-denied':
      return 'That verification code is incorrect. Please try again.'
    case 'functions/deadline-exceeded':
      return 'That verification code has expired. Please start over to get a new one.'
    default:
      return err?.message || 'Something went wrong. Please try again.'
  }
}
