import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '../ui/Button'
import { submitMessage } from '../../lib/firestore/messagesRepo'

const ROLES = ['Teen', 'Parent / Guardian', 'Clinician / Orthotist', 'Other']

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address').max(254),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
  role: z.enum(['', ...ROLES]).optional(),
})

function FieldError({ message }) {
  if (!message) return null
  return (
    <p className="mt-1 text-xs text-cherry-red flex items-center gap-1" role="alert">
      <AlertCircle size={11} aria-hidden="true" />
      {message}
    </p>
  )
}

/**
 * @param {{ formId?: string, compact?: boolean }} props
 */
export function ContactForm({ formId = 'contact', compact = false }) {
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', message: '', role: '' },
  })

  const onSubmit = async (data) => {
    setStatus('loading')
    setServerError('')
    try {
      await submitMessage(data)
      setStatus('success')
      reset()
    } catch (err) {
      setStatus('error')
      setServerError(err.message || 'Something went wrong. Please try again.')
    }
  }

  // ── Success state ──────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 text-center shadow-lg border border-divider"
        role="status"
        aria-live="polite"
      >
        <CheckCircle size={40} className="text-denim mx-auto mb-3" aria-hidden="true" />
        <h3 className="font-display text-title-4 text-foreground mb-2">Message sent!</h3>
        <p className="text-foreground-secondary text-body mb-5">
          Thanks for reaching out. We'll get back to you at the email you provided.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm text-denim underline underline-offset-2 hover:text-denim-400 transition-colors inline-flex items-center gap-1"
        >
          <RotateCcw size={13} aria-hidden="true" />
          Send another message
        </button>
      </motion.div>
    )
  }

  // ── Form ───────────────────────────────────────────────────────────
  return (
    <motion.form
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-divider flex flex-col gap-5"
      noValidate
      aria-label="Contact form"
    >
      {/* Name */}
      <div className="flex flex-col gap-1">
        <label htmlFor={`${formId}-name`} className="text-sm font-medium text-foreground-secondary">
          Your name <span className="text-cherry-red" aria-label="required">*</span>
        </label>
        <input
          id={`${formId}-name`}
          type="text"
          autoComplete="name"
          placeholder="Alex Johnson"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          className={`w-full px-4 py-3 rounded-2xl border bg-background text-foreground text-body placeholder:text-foreground-muted focus:outline-none focus:ring-2 transition-colors ${
            errors.name
              ? 'border-cherry-red focus:ring-cherry-red/20'
              : 'border-divider focus:border-rebel-pink focus:ring-rebel-pink/20'
          }`}
          {...register('name')}
        />
        <span id={`${formId}-name-error`}>
          <FieldError message={errors.name?.message} />
        </span>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor={`${formId}-email`} className="text-sm font-medium text-foreground-secondary">
          Email address <span className="text-cherry-red" aria-label="required">*</span>
        </label>
        <input
          id={`${formId}-email`}
          type="email"
          autoComplete="email"
          placeholder="alex@example.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          className={`w-full px-4 py-3 rounded-2xl border bg-background text-foreground text-body placeholder:text-foreground-muted focus:outline-none focus:ring-2 transition-colors ${
            errors.email
              ? 'border-cherry-red focus:ring-cherry-red/20'
              : 'border-divider focus:border-rebel-pink focus:ring-rebel-pink/20'
          }`}
          {...register('email')}
        />
        <span id={`${formId}-email-error`}>
          <FieldError message={errors.email?.message} />
        </span>
      </div>

      {/* Role (optional) */}
      <div className="flex flex-col gap-1">
        <label htmlFor={`${formId}-role`} className="text-sm font-medium text-foreground-secondary">
          I am a…{' '}
          <span className="text-foreground-muted font-normal">(optional)</span>
        </label>
        <select
          id={`${formId}-role`}
          className="w-full px-4 py-3 rounded-2xl border border-divider bg-background text-foreground text-body focus:outline-none focus:border-rebel-pink focus:ring-2 focus:ring-rebel-pink/20 transition-colors appearance-none cursor-pointer"
          {...register('role')}
        >
          <option value="">Select a role…</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1">
        <label htmlFor={`${formId}-message`} className="text-sm font-medium text-foreground-secondary">
          Message <span className="text-cherry-red" aria-label="required">*</span>
        </label>
        <textarea
          id={`${formId}-message`}
          rows={compact ? 3 : 4}
          placeholder="Questions, feedback, or just say hi…"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          className={`w-full px-4 py-3 rounded-2xl border bg-background text-foreground text-body placeholder:text-foreground-muted focus:outline-none focus:ring-2 transition-colors resize-none ${
            errors.message
              ? 'border-cherry-red focus:ring-cherry-red/20'
              : 'border-divider focus:border-rebel-pink focus:ring-rebel-pink/20'
          }`}
          {...register('message')}
        />
        <span id={`${formId}-message-error`}>
          <FieldError message={errors.message?.message} />
        </span>
      </div>

      {/* Server error */}
      <AnimatePresence>
        {status === 'error' && serverError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2 p-3 bg-cherry-red-100 rounded-2xl text-cherry-red text-sm"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span>{serverError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={status === 'loading'}
        className="self-stretch"
        aria-label={status === 'loading' ? 'Sending message…' : 'Send message'}
      >
        {status === 'loading' ? (
          <>
            <Loader2 size={16} className="animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send size={16} aria-hidden="true" />
            Send message
          </>
        )}
      </Button>

      <p className="text-xs text-foreground-muted text-center">
        We respect your privacy. Your info is never stored or sold. 🔒
      </p>
    </motion.form>
  )
}
