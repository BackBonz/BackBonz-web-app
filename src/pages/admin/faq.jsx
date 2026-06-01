import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Plus, Pencil, Trash2, X, Check, RotateCcw } from 'lucide-react'
import { AdminShell } from '../../components/admin/AdminShell'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { useToast } from '../../components/admin/Toast'
import {
  listFaqs,
  addFaq,
  updateFaq,
  deleteFaq,
  seedDefaultFaqs,
} from '../../lib/firestore/faqsRepo'

const EMPTY = { question: '', answer: '' }

export default function AdminFaq() {
  const toast = useToast()

  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Editing state: null | 'new' | faqId
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(EMPTY)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [confirmSeed, setConfirmSeed] = useState(false)

  async function refresh() {
    const items = await listFaqs()
    setFaqs(items)
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [])

  function startNew() {
    setEditingId('new')
    setDraft(EMPTY)
  }

  function startEdit(faq) {
    setEditingId(faq.id)
    setDraft({ question: faq.question, answer: faq.answer })
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft(EMPTY)
  }

  async function handleSave() {
    if (!draft.question.trim() || !draft.answer.trim()) {
      toast({ message: 'Question and answer are both required.', type: 'error' })
      return
    }
    setSaving(true)
    try {
      if (editingId === 'new') {
        const maxOrder = faqs.reduce((m, f) => Math.max(m, f.order ?? 0), -1)
        await addFaq({ question: draft.question, answer: draft.answer, order: maxOrder + 1 })
        toast({ message: 'FAQ added.', type: 'success' })
      } else {
        await updateFaq(editingId, { question: draft.question, answer: draft.answer })
        toast({ message: 'FAQ updated.', type: 'success' })
      }
      await refresh()
      cancelEdit()
    } catch (err) {
      toast({ message: err.message ?? 'Save failed.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteFaq(deleteTarget.id)
      await refresh()
      toast({ message: 'FAQ deleted.', type: 'success' })
    } catch (err) {
      toast({ message: err.message ?? 'Delete failed.', type: 'error' })
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  async function handleSeed() {
    setSeeding(true)
    try {
      await seedDefaultFaqs()
      await refresh()
      toast({ message: 'Default FAQs restored.', type: 'success' })
    } catch (err) {
      toast({ message: err.message ?? 'Could not restore defaults.', type: 'error' })
    } finally {
      setSeeding(false)
      setConfirmSeed(false)
    }
  }

  const editorOpen = editingId !== null

  return (
    <>
      <Helmet>
        <title>FAQ · BackBonz Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <AdminShell>
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">FAQ</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setConfirmSeed(true)}
              disabled={seeding}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-foreground transition-colors disabled:opacity-50"
            >
              <RotateCcw size={14} />
              Restore defaults
            </button>
            <button
              onClick={startNew}
              disabled={editorOpen}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-denim text-white hover:bg-denim-400 transition-colors disabled:opacity-50"
            >
              <Plus size={15} />
              Add FAQ
            </button>
          </div>
        </div>

        <p className="text-sm text-foreground-muted mb-6">
          Answers support Markdown (lists, <strong>bold</strong>, [links](url)). Use{' '}
          <code className="bg-gray-100 px-1 rounded">{'{{email}}'}</code> to insert the live support email.
        </p>

        {/* New-FAQ editor */}
        {editingId === 'new' && (
          <FaqEditor
            draft={draft}
            setDraft={setDraft}
            saving={saving}
            onSave={handleSave}
            onCancel={cancelEdit}
            title="New FAQ"
          />
        )}

        {loading ? (
          <div className="text-sm text-foreground-muted">Loading FAQs…</div>
        ) : faqs.length === 0 && editingId !== 'new' ? (
          <p className="text-sm text-foreground-muted">
            No FAQs yet. Click <strong>Add FAQ</strong> to create one, or{' '}
            <strong>Restore defaults</strong> to load the starter set.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {faqs.map((faq) =>
              editingId === faq.id ? (
                <FaqEditor
                  key={faq.id}
                  draft={draft}
                  setDraft={setDraft}
                  saving={saving}
                  onSave={handleSave}
                  onCancel={cancelEdit}
                  title="Edit FAQ"
                />
              ) : (
                <div
                  key={faq.id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 flex items-start justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{faq.question}</p>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 whitespace-pre-wrap">
                      {faq.answer}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(faq)}
                      disabled={editorOpen}
                      className="p-2 rounded-lg text-gray-400 hover:text-denim hover:bg-gray-100 transition-colors disabled:opacity-40"
                      aria-label="Edit FAQ"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(faq)}
                      disabled={editorOpen}
                      className="p-2 rounded-lg text-gray-400 hover:text-cherry-red hover:bg-gray-100 transition-colors disabled:opacity-40"
                      aria-label="Delete FAQ"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </AdminShell>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete FAQ?"
        message={deleteTarget ? `"${deleteTarget.question}" will be permanently removed.` : ''}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        busy={deleting}
      />

      <ConfirmModal
        open={confirmSeed}
        title="Restore default FAQs?"
        message="This replaces ALL current FAQs with the default starter set. This cannot be undone."
        confirmLabel="Restore"
        onConfirm={handleSeed}
        onCancel={() => setConfirmSeed(false)}
        busy={seeding}
      />
    </>
  )
}

function FaqEditor({ draft, setDraft, saving, onSave, onCancel, title }) {
  return (
    <div className="bg-white border-2 border-denim/30 rounded-2xl p-4 mb-3 flex flex-col gap-3">
      <p className="font-semibold text-foreground">{title}</p>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground-secondary">Question</label>
        <input
          type="text"
          value={draft.question}
          onChange={(e) => setDraft((d) => ({ ...d, question: e.target.value }))}
          placeholder="How do I…?"
          className="w-full px-3 py-2 rounded-xl border border-divider bg-background text-foreground focus:outline-none focus:border-rebel-pink focus:ring-2 focus:ring-rebel-pink/20 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground-secondary">Answer (Markdown)</label>
        <textarea
          rows={8}
          value={draft.answer}
          onChange={(e) => setDraft((d) => ({ ...d, answer: e.target.value }))}
          placeholder={'Write the answer in Markdown…\n\n- bullet\n- list'}
          className="w-full px-3 py-2 rounded-xl border border-divider bg-background text-foreground font-mono text-sm focus:outline-none focus:border-rebel-pink focus:ring-2 focus:ring-rebel-pink/20 transition-colors resize-y"
        />
      </div>

      <div className="flex items-center gap-2 self-end">
        <button
          onClick={onCancel}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <X size={15} />
          Cancel
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium bg-denim text-white hover:bg-denim-400 transition-colors disabled:opacity-50"
        >
          <Check size={15} />
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
