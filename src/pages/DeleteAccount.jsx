import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle,
  ShieldAlert,
  Mail,
  ArrowLeft,
  Database,
  Archive,
} from 'lucide-react'
import PageShell from '../components/layout/PageShell'
import { Seo } from '../lib/seo/Seo'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Highlight } from '../components/ui/Highlight'
import { Button } from '../components/ui/Button'
import { SITE } from '../config/site'
import { useSettings } from '../lib/settings'
import {
  requestDeletionCode,
  confirmDeletion,
  cancelDeletion,
  deletionErrorMessage,
} from '../lib/account'

// What we permanently erase — surfaced to users and required for the Play Store
// "Delete account URL" data-safety disclosure.
const DELETED_DATA = [
  'Your profile: name, date of birth, gender, timezone, and daily/weekly goals',
  'Brace-wear sessions and activity tags',
  'Streaks, longest-streak records, and milestones',
  'Journal entries and unlocked stickers',
  'Notification preferences and device push tokens',
  'Your login credentials (email & password)',
]

const KEPT_DATA = [
  'Support messages you emailed us are not stored in a database, so there is nothing to delete there.',
  'Aggregated, anonymous analytics that cannot identify you may be retained to keep the app running.',
]

// ── Field error ────────────────────────────────────────────────────────
function FieldError({ message, id }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1 text-xs text-cherry-red flex items-center gap-1" role="alert">
      <AlertCircle size={11} aria-hidden="true" />
      {message}
    </p>
  )
}

// ── Deletion form (credentials → code → done) ──────────────────────────
function DeleteAccountForm() {
  const [step, setStep] = useState('credentials') // credentials | verify | done
  const [status, setStatus] = useState('idle') // idle | loading
  const [serverError, setServerError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [verificationId, setVerificationId] = useState('')

  // Track whether the temporary auth session is still open so we can clear it
  // if the user navigates away mid-flow without finishing.
  const sessionOpen = useRef(false)
  useEffect(() => {
    return () => {
      if (sessionOpen.current) cancelDeletion()
    }
  }, [])

  const resetErrors = () => {
    setServerError('')
    setFieldErrors({})
  }

  // Step 1 — validate credentials + send the code.
  const onSubmitCredentials = async (e) => {
    e.preventDefault()
    resetErrors()

    const errs = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Enter a valid email address.'
    }
    if (!password) {
      errs.password = 'Enter your password.'
    }
    if (Object.keys(errs).length) {
      setFieldErrors(errs)
      return
    }

    setStatus('loading')
    try {
      const id = await requestDeletionCode({ email, password })
      sessionOpen.current = true
      setVerificationId(id)
      setStep('verify')
    } catch (err) {
      setServerError(deletionErrorMessage(err))
    } finally {
      setStatus('idle')
    }
  }

  // Step 2 — verify the code + delete everything.
  const onSubmitCode = async (e) => {
    e.preventDefault()
    resetErrors()

    if (!/^\d{6}$/.test(otp.trim())) {
      setFieldErrors({ otp: 'Enter the 6-digit code from your email.' })
      return
    }

    setStatus('loading')
    try {
      await confirmDeletion({ verificationId, otp })
      sessionOpen.current = false
      setStep('done')
    } catch (err) {
      setServerError(deletionErrorMessage(err))
    } finally {
      setStatus('idle')
    }
  }

  const startOver = async () => {
    await cancelDeletion()
    sessionOpen.current = false
    resetErrors()
    setPassword('')
    setOtp('')
    setVerificationId('')
    setStep('credentials')
  }

  // ── Done state ───────────────────────────────────────────────────────
  if (step === 'done') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 text-center shadow-lg border border-divider"
        role="status"
        aria-live="polite"
      >
        <CheckCircle size={40} className="text-denim mx-auto mb-3" aria-hidden="true" />
        <h3 className="font-display text-title-4 text-foreground mb-2">Account deleted</h3>
        <p className="text-foreground-secondary text-body">
          Your BackBonz account and all associated data have been permanently deleted. We’ve sent a
          confirmation to <span className="font-medium text-foreground">{email}</span>. We’re sorry
          to see you go. 💙
        </p>
      </motion.div>
    )
  }

  const loading = status === 'loading'

  // ── Form ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-divider">
      {/* Danger banner */}
      <div className="flex items-start gap-3 p-3 mb-6 bg-cherry-red-100 rounded-2xl text-cherry-red">
        <ShieldAlert size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p className="text-sm">
          This permanently deletes your account and data. It <strong>cannot be undone.</strong>
        </p>
      </div>

      <AnimatePresence mode="wait">
        {step === 'credentials' ? (
          <motion.form
            key="credentials"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            onSubmit={onSubmitCredentials}
            className="flex flex-col gap-5"
            noValidate
            aria-label="Verify your account"
          >
            {/* Email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="del-email" className="text-sm font-medium text-foreground-secondary">
                Account email <span className="text-cherry-red" aria-label="required">*</span>
              </label>
              <input
                id="del-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'del-email-error' : undefined}
                className={`w-full px-4 py-3 rounded-2xl border bg-background text-foreground text-body placeholder:text-foreground-muted focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.email
                    ? 'border-cherry-red focus:ring-cherry-red/20'
                    : 'border-divider focus:border-rebel-pink focus:ring-rebel-pink/20'
                }`}
              />
              <FieldError id="del-email-error" message={fieldErrors.email} />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1">
              <label htmlFor="del-password" className="text-sm font-medium text-foreground-secondary">
                Password <span className="text-cherry-red" aria-label="required">*</span>
              </label>
              <input
                id="del-password"
                type="password"
                autoComplete="current-password"
                placeholder="Your account password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'del-password-error' : undefined}
                className={`w-full px-4 py-3 rounded-2xl border bg-background text-foreground text-body placeholder:text-foreground-muted focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.password
                    ? 'border-cherry-red focus:ring-cherry-red/20'
                    : 'border-divider focus:border-rebel-pink focus:ring-rebel-pink/20'
                }`}
              />
              <FieldError id="del-password-error" message={fieldErrors.password} />
            </div>

            {serverError && (
              <div
                className="flex items-start gap-2 p-3 bg-cherry-red-100 rounded-2xl text-cherry-red text-sm"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>{serverError}</span>
              </div>
            )}

            <Button type="submit" variant="primary" size="md" disabled={loading} className="self-stretch">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  Sending code…
                </>
              ) : (
                <>
                  <Mail size={16} aria-hidden="true" />
                  Send verification code
                </>
              )}
            </Button>
            <p className="text-xs text-foreground-muted text-center">
              We’ll email a 6-digit code to confirm it’s really you before deleting anything.
            </p>
          </motion.form>
        ) : (
          <motion.form
            key="verify"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12 }}
            onSubmit={onSubmitCode}
            className="flex flex-col gap-5"
            noValidate
            aria-label="Enter verification code"
          >
            <p className="text-body text-foreground-secondary">
              We emailed a 6-digit verification code to{' '}
              <span className="font-medium text-foreground">{email}</span>. Enter it below to
              permanently delete your account. The code expires in 10 minutes.
            </p>

            <div className="flex flex-col gap-1">
              <label htmlFor="del-otp" className="text-sm font-medium text-foreground-secondary">
                Verification code <span className="text-cherry-red" aria-label="required">*</span>
              </label>
              <input
                id="del-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                aria-invalid={!!fieldErrors.otp}
                aria-describedby={fieldErrors.otp ? 'del-otp-error' : undefined}
                className={`w-full px-4 py-3 rounded-2xl border bg-background text-foreground text-2xl tracking-[0.4em] font-mono text-center placeholder:text-foreground-muted placeholder:tracking-normal focus:outline-none focus:ring-2 transition-colors ${
                  fieldErrors.otp
                    ? 'border-cherry-red focus:ring-cherry-red/20'
                    : 'border-divider focus:border-rebel-pink focus:ring-rebel-pink/20'
                }`}
              />
              <FieldError id="del-otp-error" message={fieldErrors.otp} />
            </div>

            {serverError && (
              <div
                className="flex items-start gap-2 p-3 bg-cherry-red-100 rounded-2xl text-cherry-red text-sm"
                role="alert"
                aria-live="assertive"
              >
                <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span>{serverError}</span>
              </div>
            )}

            <Button type="submit" variant="primary" size="md" disabled={loading} className="self-stretch">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  Deleting account…
                </>
              ) : (
                <>
                  <Trash2 size={16} aria-hidden="true" />
                  Permanently delete my account
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={startOver}
              disabled={loading}
              className="text-sm text-foreground-muted hover:text-foreground transition-colors inline-flex items-center justify-center gap-1 disabled:opacity-50"
            >
              <ArrowLeft size={13} aria-hidden="true" />
              Start over
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────
export default function DeleteAccount() {
  const { supportEmail } = useSettings()

  return (
    <PageShell>
      <Seo
        title="Delete Your Account"
        description="Permanently delete your BackBonz account and all associated data. Verify with your email and password, confirm with a one-time code, and everything is erased."
        path="/delete-account"
      />

      {/* Hero */}
      <section className="bg-cherry-red-100 pt-28 pb-14" aria-labelledby="delete-hero-heading">
        <Container className="text-center flex flex-col items-center gap-4">
          <h1
            id="delete-hero-heading"
            className="font-fun font-bold text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight max-w-2xl"
          >
            Delete your <Highlight color="red">BackBonz account</Highlight>
          </h1>
          <p className="text-body-lg text-foreground-secondary max-w-xl leading-relaxed">
            Request permanent deletion of your {SITE.name} account and all associated data. This page
            applies to the {SITE.name} mobile app.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20 bg-background">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start max-w-5xl mx-auto">
            {/* Left — information */}
            <div className="flex flex-col gap-10">
              {/* Steps */}
              <div>
                <SectionHeading
                  eyebrow="How it works"
                  title={<>Steps to <Highlight color="denim">delete</Highlight></>}
                  className="mb-6"
                />
                <ol className="flex flex-col gap-4">
                  {[
                    `Enter the email and password for your ${SITE.name} account in the form.`,
                    'We email a 6-digit verification code to that address to confirm it’s you.',
                    'Enter the code to confirm the deletion request.',
                    'Your account and all associated data are permanently deleted, and we send a confirmation email.',
                  ].map((text, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        className="shrink-0 w-7 h-7 rounded-full bg-rebel-pink text-white text-sm font-bold flex items-center justify-center"
                        aria-hidden="true"
                      >
                        {i + 1}
                      </span>
                      <span className="text-body text-foreground-secondary leading-relaxed pt-0.5">
                        {text}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* What gets deleted */}
              <div>
                <h3 className="font-display text-title-4 text-foreground mb-4 flex items-center gap-2">
                  <Trash2 size={18} className="text-cherry-red" aria-hidden="true" />
                  Data that is deleted
                </h3>
                <ul className="flex flex-col gap-2">
                  {DELETED_DATA.map((item) => (
                    <li key={item} className="flex gap-2 text-body text-foreground-secondary leading-relaxed">
                      <span className="text-cherry-red mt-1.5 shrink-0" aria-hidden="true">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* What is kept */}
              <div>
                <h3 className="font-display text-title-4 text-foreground mb-4 flex items-center gap-2">
                  <Database size={18} className="text-denim" aria-hidden="true" />
                  Data that is kept
                </h3>
                <ul className="flex flex-col gap-2">
                  {KEPT_DATA.map((item) => (
                    <li key={item} className="flex gap-2 text-body text-foreground-secondary leading-relaxed">
                      <span className="text-denim mt-1.5 shrink-0" aria-hidden="true">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Retention */}
              <div className="flex items-start gap-3 bg-yoke-100 rounded-2xl px-4 py-4">
                <Archive size={18} className="text-true-brown mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">Retention period</p>
                  <p className="text-sm text-foreground-secondary leading-relaxed">
                    Your account and personal data are removed from our live systems immediately when
                    deletion completes. Residual copies in encrypted backups are purged within 30 days.
                    We do not retain your personal data after that period.
                  </p>
                </div>
              </div>

              <p className="text-sm text-foreground-muted leading-relaxed">
                Prefer to have us handle it, or having trouble? Email{' '}
                <a
                  href={`mailto:${supportEmail}?subject=Account%20deletion%20request`}
                  className="text-denim underline underline-offset-2 hover:text-denim-400"
                >
                  {supportEmail}
                </a>{' '}
                and we’ll process your deletion request.
              </p>
            </div>

            {/* Right — form (sticky on desktop) */}
            <div className="lg:sticky lg:top-28">
              <DeleteAccountForm />
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  )
}
