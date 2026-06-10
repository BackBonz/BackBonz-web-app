import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth } from '../../config/firebase'

// Only this account may access the admin panel — via email/password OR Google.
// Pinned to admin.backbonz@gmail.com; VITE_ADMIN_EMAIL can override for other envs.
const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || 'admin.backbonz@gmail.com')
  .trim()
  .toLowerCase()

// Email comparison is case-insensitive (email addresses are not case-sensitive).
const isAdminEmail = (email) =>
  typeof email === 'string' && email.trim().toLowerCase() === ADMIN_EMAIL

const googleProvider = new GoogleAuthProvider()

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && isAdminEmail(firebaseUser.email)) {
        setUser(firebaseUser)
      } else {
        setUser(null)
        if (firebaseUser) firebaseSignOut(auth)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  async function signIn(email, password) {
    if (!isAdminEmail(email)) throw new Error('Unauthorized email address.')
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    if (!isAdminEmail(result.user.email)) {
      await firebaseSignOut(auth)
      throw new Error('Unauthorized account. Use the admin Google account.')
    }
    return result
  }

  async function signOut() {
    return firebaseSignOut(auth)
  }

  const value = useMemo(
    () => ({ user, loading, signIn, signInWithGoogle, signOut }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

/** Layout route — wraps protected /admin pages */
export function RequireAdmin() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="text-foreground-secondary text-sm">Loading…</span>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
