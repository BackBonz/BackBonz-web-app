import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Mail, Trash2, MailOpen, Clock, User, Tag, ChevronDown, ChevronUp } from 'lucide-react'
import { AdminShell } from '../../components/admin/AdminShell'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { useToast } from '../../components/admin/Toast'
import { listMessages, markRead, deleteMessage } from '../../lib/firestore/messagesRepo'

function formatDate(date) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  }).format(date)
}

function MessageCard({ msg, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const toast = useToast()

  async function handleExpand() {
    setExpanded((v) => !v)
    if (!msg.read) {
      try { await markRead(msg.id) } catch { /* non-critical */ }
    }
  }

  const mailtoHref = [
    `mailto:${msg.email}`,
    `?subject=${encodeURIComponent('Re: Your BackBonz message')}`,
    `&body=${encodeURIComponent(`Hi ${msg.name},\n\nThanks for reaching out!\n\n---\nYour original message:\n"${msg.message}"\n---\n\nBest,\nBackBonz Team`)}`,
  ].join('')

  return (
    <div
      className={`rounded-2xl border transition-colors ${
        msg.read
          ? 'bg-white border-gray-200'
          : 'bg-rebel-pink-100/30 border-rebel-pink-200'
      }`}
    >
      {/* Summary row */}
      <button
        onClick={handleExpand}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        aria-expanded={expanded}
      >
        {/* Unread dot */}
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${msg.read ? 'bg-transparent' : 'bg-rebel-pink'}`}
          aria-label={msg.read ? 'Read' : 'Unread'}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground">{msg.name}</span>
            {msg.role && (
              <span className="text-xs text-foreground-muted bg-gray-100 px-2 py-0.5 rounded-full">
                {msg.role}
              </span>
            )}
          </div>
          <p className="text-xs text-foreground-muted truncate mt-0.5">{msg.message}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-foreground-muted hidden sm:block">
            {formatDate(msg.submittedAt)}
          </span>
          {expanded ? <ChevronUp size={14} className="text-foreground-muted" /> : <ChevronDown size={14} className="text-foreground-muted" />}
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4 flex flex-col gap-4">
          {/* Meta */}
          <dl className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <User size={14} className="text-foreground-muted mt-0.5 shrink-0" />
              <div>
                <dt className="text-xs text-foreground-muted">Name</dt>
                <dd className="font-medium text-foreground">{msg.name}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Mail size={14} className="text-foreground-muted mt-0.5 shrink-0" />
              <div>
                <dt className="text-xs text-foreground-muted">Email</dt>
                <dd className="font-medium text-foreground break-all">{msg.email}</dd>
              </div>
            </div>
            {msg.role && (
              <div className="flex items-start gap-2">
                <Tag size={14} className="text-foreground-muted mt-0.5 shrink-0" />
                <div>
                  <dt className="text-xs text-foreground-muted">Role</dt>
                  <dd className="font-medium text-foreground">{msg.role}</dd>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2">
              <Clock size={14} className="text-foreground-muted mt-0.5 shrink-0" />
              <div>
                <dt className="text-xs text-foreground-muted">Submitted</dt>
                <dd className="font-medium text-foreground">{formatDate(msg.submittedAt)}</dd>
              </div>
            </div>
          </dl>

          {/* Message body */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-foreground-muted mb-1">Message</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{msg.message}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={mailtoHref}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-denim text-white text-sm font-medium hover:bg-denim-400 transition-colors"
            >
              <MailOpen size={14} aria-hidden="true" />
              Reply in email app
            </a>
            <button
              onClick={() => onDelete(msg)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-cherry-red-200 text-cherry-red text-sm font-medium hover:bg-cherry-red-100 transition-colors"
            >
              <Trash2 size={14} aria-hidden="true" />
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminMessages() {
  const toast = useToast()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    try {
      const data = await listMessages()
      setMessages(data)
    } catch (err) {
      toast({ message: err.message ?? 'Failed to load messages.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => { load() }, [load])

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteMessage(deleteTarget.id)
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id))
      toast({ message: 'Message deleted.', type: 'success' })
    } catch (err) {
      toast({ message: err.message ?? 'Delete failed.', type: 'error' })
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <>
      <Helmet>
        <title>Messages · BackBonz Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <AdminShell>
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-display text-2xl font-bold text-foreground">Messages</h1>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-rebel-pink text-white text-xs font-bold">
              {unreadCount} new
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-sm text-foreground-muted">Loading messages…</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 text-foreground-muted">
            <Mail size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No messages yet — they'll appear here when someone submits the contact form.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((msg) => (
              <MessageCard key={msg.id} msg={msg} onDelete={setDeleteTarget} />
            ))}
          </div>
        )}
      </AdminShell>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete message?"
        message={deleteTarget ? `Message from "${deleteTarget.name}" will be permanently removed.` : ''}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        busy={deleting}
      />
    </>
  )
}
