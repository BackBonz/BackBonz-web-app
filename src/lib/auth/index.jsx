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

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL

const googleProvider = new GoogleAuthProvider()

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && firebaseUser.email === ADMIN_EMAIL) {
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
    if (email !== ADMIN_EMAIL) throw new Error('Unauthorized email address.')
    return signInWithEmailAndPassword(auth, email, password)
  }

  async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    if (result.user.email !== ADMIN_EMAIL) {
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
