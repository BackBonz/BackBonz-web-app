import { ExternalLink, Download } from 'lucide-react'

/**
 * iframe-based PDF viewer. react-pdf worker setup is skipped in favour of this approach
 * for reliability and Vite 8 compatibility.
 * @param {{ src: string, title: string }} props
 */
export function PdfViewer({ src, title }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Action bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <a
          href={src}
          download
          className="inline-flex items-center gap-1.5 text-sm font-medium text-denim hover:text-denim-400 transition-colors"
          aria-label={`Download ${title} PDF`}
        >
          <Download size={15} aria-hidden="true" />
          Download PDF
        </a>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-denim hover:text-denim-400 transition-colors"
          aria-label={`Open ${title} in new tab`}
        >
          <ExternalLink size={15} aria-hidden="true" />
          Open in new tab
        </a>
      </div>

      {/* iframe viewer */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-divider bg-background shadow-sm">
        <iframe
          src={src}
          title={title}
          className="w-full min-h-[70vh]"
          aria-label={`${title} PDF viewer`}
        />
        {/* Fallback message if iframe doesn't load */}
        <noscript>
          <p className="p-4 text-foreground-secondary">
            Your browser cannot display this PDF inline.{' '}
            <a href={src} className="text-denim underline">
              Download it here.
            </a>
          </p>
        </noscript>
      </div>
    </div>
  )
}
