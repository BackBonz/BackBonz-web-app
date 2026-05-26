import { createContext, useCallback, useContext, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

// ── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastStack toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx.addToast
}

// ── UI ───────────────────────────────────────────────────────────────────────

const ICONS = {
  success: <CheckCircle size={18} className="text-green-600 shrink-0" />,
  error:   <XCircle    size={18} className="text-cherry-red shrink-0" />,
  info:    <Info       size={18} className="text-denim shrink-0" />,
}

function ToastStack({ toasts, onRemove }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-start gap-3 bg-white border border-gray-200 shadow-lg rounded-xl px-4 py-3 min-w-[260px] max-w-sm"
          >
            {ICONS[t.type]}
            <p className="text-sm text-foreground flex-1">{t.message}</p>
            <button
              onClick={() => onRemove(t.id)}
              aria-label="Dismiss"
              className="text-gray-400 hover:text-foreground transition-colors mt-0.5"
            >
              <X size={15} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
