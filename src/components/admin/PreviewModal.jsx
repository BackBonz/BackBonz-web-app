import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { DocumentViewer } from '../../lib/markdown/DocumentViewer'

export function PreviewModal({ doc, onClose }) {
  // Close on Escape
  useEffect(() => {
    if (!doc) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [doc, onClose])

  // Lock body scroll while open
  useEffect(() => {
    if (doc) document.body.style.overflow = 'hidden'
    else      document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [doc])

  return (
    <AnimatePresence>
      {doc && (
        <motion.div
          key="preview-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            key="preview-panel"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background rounded-2xl shadow-2xl w-full max-w-3xl max-h-[88vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-divider shrink-0">
              <p className="font-semibold text-foreground truncate">{doc.name}</p>
              <button
                onClick={onClose}
                aria-label="Close preview"
                className="p-1.5 rounded-lg hover:bg-rebel-pink-100/50 transition-colors text-foreground-tertiary hover:text-foreground"
              >
                <X size={18} />
              </button>
            </div>

            {/* Viewer */}
            <div className="flex-1 overflow-y-auto">
              <DocumentViewer
                doc={{ type: doc.type, src: doc.url, title: doc.name, updatedAt: doc.updatedAt }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
