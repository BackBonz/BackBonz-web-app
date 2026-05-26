import { useState, useEffect } from 'react'
import DOMPurify from 'dompurify'
import { Download, AlertCircle } from 'lucide-react'

/**
 * DOCX → HTML viewer using mammoth in the browser.
 * HTML output is sanitized with DOMPurify before injection.
 * @param {{ src: string, title: string }} props
 */
export function DocxViewer({ src, title }) {
  const [html, setHtml] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function convert() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(src)
        if (!response.ok) throw new Error(`Failed to load document (${response.status})`)

        const arrayBuffer = await response.arrayBuffer()

        // mammoth browser build
        const mammoth = await import('mammoth')
        const result = await mammoth.default.convertToHtml({ arrayBuffer })

        if (cancelled) return

        // Sanitize before injecting — never inject unsanitized HTML
        const clean = DOMPurify.sanitize(result.value, {
          ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'a', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'blockquote', 'hr', 'span', 'div',
          ],
          ALLOWED_ATTR: ['href', 'target', 'rel', 'id', 'class'],
          FORCE_BODY: true,
        })

        setHtml(clean)
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    convert()
    return () => { cancelled = true }
  }, [src])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16" role="status" aria-live="polite">
        <div className="w-8 h-8 border-4 border-rebel-pink/30 border-t-rebel-pink rounded-full animate-spin" />
        <span className="ml-3 text-foreground-secondary">Converting document…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-start gap-3 p-4 bg-cherry-red-100 rounded-2xl text-cherry-red" role="alert">
        <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
        <div>
          <p className="font-medium">Failed to load document</p>
          <p className="text-sm mt-1 text-cherry-red-300">{error}</p>
          <a href={src} download className="text-sm underline mt-2 inline-block">
            Download original file
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <a
        href={src}
        download
        className="inline-flex items-center gap-1.5 text-sm font-medium text-denim hover:text-denim-400 transition-colors self-start"
        aria-label={`Download ${title} DOCX`}
      >
        <Download size={15} aria-hidden="true" />
        Download original DOCX
      </a>

      {/* Sanitized HTML — safe to inject */}
      <div
        className="docx-content prose max-w-[70ch] text-foreground-secondary leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html /* sanitized by DOMPurify above */ }}
      />
    </div>
  )
}
