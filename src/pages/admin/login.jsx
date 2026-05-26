import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Navigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../../lib/auth'

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

function mapFirebaseError(err) {
  const code = err?.code ?? ''
  if (['auth/invalid-credential', 'auth/user-not-found', 'auth/wrong-password', 'auth/invalid-email'].includes(code))
    return 'Invalid email or password.'
  if (code === 'auth/too-many-requests')
    return 'Too many attempts. Try again later.'
  if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request')
    return null // user dismissed — not an error worth showing
  return err?.message ?? 'Sign-in failed. Try again.'
}

export default function AdminLogin() {
  const { signIn, signInWithGoogle, user } = useAuth()
  const location = useLocation()
  const [serverError, setServerError] = useState(null)
  const [googleLoading, setGoogleLoading] = useState(false)

  const from = location.state?.from?.pathname ?? '/admin'

  // All hooks must be called before any conditional return
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  // Declarative redirect — never call navigate() during render
  if (user) return <Navigate to={from} replace />

  async function onSubmit({ email, password }) {
    setServerError(null)
    try {
      await signIn(email, password)
      // onAuthStateChanged fires → user set → <Navigate> triggers
    } catch (err) {
      const msg = mapFirebaseError(err)
      if (msg) setServerError(msg)
    }
  }

  async function handleGoogle() {
    setServerError(null)
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
      // onAuthStateChanged fires → user set → <Navigate> triggers
    } catch (err) {
      const msg = mapFirebaseError(err)
      if (msg) setServerError(msg)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Login · BackBonz</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
          <div className="mb-8 text-center">
            <p className="text-2xl font-display font-bold text-denim tracking-tight">BackBonz</p>
            <p className="text-sm text-gray-500 mt-1">Admin access only</p>
          </div>

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading || isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium text-foreground transition-colors disabled:opacity-60 shadow-sm"
          >
            <GoogleIcon />
            {googleLoading ? 'Signing in…' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          {/* Email / password form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                {...register('email')}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-denim/40"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-cherry-red">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-denim/40"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-cherry-red">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <p role="alert" className="text-sm text-cherry-red text-center">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting || googleLoading}
              className="w-full py-2.5 rounded-xl bg-denim text-white font-semibold text-sm hover:bg-denim/90 transition-colors disabled:opacity-60"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in with email'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
    </svg>
  )
}
