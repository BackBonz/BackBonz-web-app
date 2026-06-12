import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export function ConfirmModal({ open, title, message, confirmLabel = 'Delete', onConfirm, onCancel, busy }) {
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onCancel])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="confirm-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCancel}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        >
          <motion.div
            key="confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle size={22} className="text-cherry-red shrink-0 mt-0.5" />
              <div>
                <h2 id="confirm-title" className="font-semibold text-foreground">
                  {title}
                </h2>
                {message && (
                  <p className="text-sm text-foreground-tertiary mt-1">{message}</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={onCancel}
                disabled={busy}
                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground-secondary hover:bg-rebel-pink-100/50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={busy}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-cherry-red text-white hover:bg-cherry-red/90 transition-colors disabled:opacity-50"
              >
                {busy ? 'Deleting…' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
