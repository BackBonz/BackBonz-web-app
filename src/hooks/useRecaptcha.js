import { useEffect, useCallback } from 'react'

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

/**
 * Lazily loads the reCAPTCHA v3 script and provides an execute function.
 * Gracefully no-ops when VITE_RECAPTCHA_SITE_KEY is not set (dev mode).
 */
export function useRecaptcha() {
  const hasKey = Boolean(SITE_KEY)

  useEffect(() => {
    if (!hasKey) return
    if (document.getElementById('recaptcha-script')) return

    const script = document.createElement('script')
    script.id = 'recaptcha-script'
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
    script.async = true
    document.head.appendChild(script)
  }, [hasKey])

  const execute = useCallback(
    async (action = 'submit') => {
      if (!hasKey || !window.grecaptcha) return ''
      try {
        await new Promise((resolve) => window.grecaptcha.ready(resolve))
        return await window.grecaptcha.execute(SITE_KEY, { action })
      } catch {
        return ''
      }
    },
    [hasKey]
  )

  return { execute, hasKey }
}
