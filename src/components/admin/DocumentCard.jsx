import { FileText, Eye, Trash2, CheckCircle, Loader2 } from 'lucide-react'

const TYPE_LABELS = { md: 'Markdown', pdf: 'PDF', docx: 'Word' }

export function DocumentCard({ doc, onSetActive, onDelete, onPreview, settingActive, deleting, previewing }) {
  const busy = settingActive || deleting || previewing

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 bg-white transition-colors ${
        doc.isActive ? 'border-denim/40 ring-1 ring-denim/20' : 'border-divider'
      }`}
    >
      {/* Icon */}
      <div className={`mt-0.5 shrink-0 ${doc.isActive ? 'text-denim' : 'text-foreground-muted'}`}>
        <FileText size={20} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate" title={doc.name}>
          {doc.name}
        </p>
        <p className="text-xs text-foreground-muted mt-0.5">
          {TYPE_LABELS[doc.type] ?? doc.type}
          {doc.updatedAt ? ` · ${doc.updatedAt}` : ''}
          {doc.size ? ` · ${(doc.size / 1024).toFixed(0)} KB` : ''}
        </p>
        {doc.isActive && (
          <span className="inline-flex items-center gap-1 mt-1.5 text-xs font-medium text-denim">
            <CheckCircle size={12} />
            Active
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <IconBtn
          label={previewing ? 'Loading preview…' : 'Preview'}
          onClick={() => onPreview(doc)}
          disabled={busy}
          className="text-foreground-muted hover:text-denim"
        >
          {previewing
            ? <Loader2 size={16} className="animate-spin" />
            : <Eye size={16} />
          }
        </IconBtn>

        {!doc.isActive && (
          <button
            onClick={() => onSetActive(doc)}
            disabled={busy}
            className="text-xs font-medium px-2.5 py-1 rounded-lg border border-denim/30 text-denim hover:bg-denim/5 transition-colors disabled:opacity-50"
          >
            {settingActive ? 'Setting…' : 'Set Active'}
          </button>
        )}

        <IconBtn
          label="Delete"
          onClick={() => onDelete(doc)}
          disabled={busy}
          className="text-foreground-muted hover:text-cherry-red"
        >
          <Trash2 size={16} />
        </IconBtn>
      </div>
    </div>
  )
}

function IconBtn({ label, onClick, disabled, className, children }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-lg hover:bg-rebel-pink-100/50 transition-colors disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}
