import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Plus, Pencil, Trash2, X, Check, RotateCcw, Lock, ImageUp } from 'lucide-react'
import { AdminShell } from '../../components/admin/AdminShell'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { useToast } from '../../components/admin/Toast'
import {
  listStickers,
  addSticker,
  updateSticker,
  softDeleteSticker,
  restoreSticker,
  uploadStickerImage,
  replaceStickerImage,
  validateStickerImage,
  normaliseStickerId,
  UNLOCK_TYPES,
} from '../../lib/firestore/stickersRepo'

const EMPTY = {
  stickerId: '',
  title: '',
  unlockType: 'streak',
  unlockValue: 7,
  criteriaLabel: '',
}

// Auto-suggest a criteria label from the unlock rule when the admin hasn't typed one.
function defaultCriteriaLabel(type, value) {
  if (type === 'daily_goal') return 'Complete daily goal'
  if (type === 'streak') return `Reach ${value || 'N'}-day streak`
  return 'Awarded manually'
}

export default function AdminStickers() {
  const toast = useToast()

  const [stickers, setStickers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Editing state: null | 'new' | stickerId
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(EMPTY)
  // Pending image file for the open editor (uploaded on save). null when editing keeps existing image.
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function refresh() {
    const items = await listStickers({ includeInactive: true })
    setStickers(items)
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false))
  }, [])

  function startNew() {
    setEditingId('new')
    setDraft(EMPTY)
    setImageFile(null)
    setImagePreview(null)
  }

  function startEdit(s) {
    setEditingId(s.id)
    setDraft({
      stickerId: s.id,
      title: s.title ?? '',
      unlockType: s.unlock?.type ?? 'streak',
      unlockValue: s.unlock?.value ?? 7,
      criteriaLabel: s.criteria_label ?? '',
    })
    setImageFile(null)
    setImagePreview(s.image_url ?? null)
  }

  function cancelEdit() {
    setEditingId(null)
    setDraft(EMPTY)
    setImageFile(null)
    setImagePreview(null)
  }

  function pickImage(file) {
    const err = validateStickerImage(file)
    if (err) {
      toast({ message: err, type: 'error' })
      return
    }
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function buildUnlock() {
    const type = draft.unlockType
    if (type === 'streak') {
      const value = Number(draft.unlockValue)
      return { type, value }
    }
    return { type }
  }

  async function handleSave() {
    const isNew = editingId === 'new'

    if (!draft.title.trim()) {
      toast({ message: 'Title is required.', type: 'error' })
      return
    }
    if (draft.unlockType === 'streak' && (!draft.unlockValue || Number(draft.unlockValue) < 1)) {
      toast({ message: 'Streak stickers need a day count of 1 or more.', type: 'error' })
      return
    }
    if (isNew) {
      if (!normaliseStickerId(draft.stickerId)) {
        toast({ message: 'A sticker ID is required (e.g. streak_21).', type: 'error' })
        return
      }
      if (!imageFile) {
        toast({ message: 'Upload a sticker image.', type: 'error' })
        return
      }
    }

    const unlock = buildUnlock()
    const criteriaLabel =
      draft.criteriaLabel.trim() || defaultCriteriaLabel(draft.unlockType, draft.unlockValue)

    setSaving(true)
    try {
      if (isNew) {
        const id = normaliseStickerId(draft.stickerId)
        const { url, path } = await uploadStickerImage(id, imageFile)
        const maxOrder = stickers.reduce((m, s) => Math.max(m, s.order ?? 0), -1)
        await addSticker({
          stickerId: id,
          title: draft.title.trim(),
          imageUrl: url,
          imagePath: path,
          unlock,
          criteriaLabel,
          order: maxOrder + 1,
        })
        toast({ message: 'Sticker added.', type: 'success' })
      } else {
        const current = stickers.find((s) => s.id === editingId)
        if (imageFile) {
          await replaceStickerImage(editingId, current?.image_path, imageFile)
        }
        await updateSticker(editingId, {
          title: draft.title.trim(),
          unlock,
          criteriaLabel,
        })
        toast({ message: 'Sticker updated.', type: 'success' })
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
      await softDeleteSticker(deleteTarget.id)
      await refresh()
      toast({ message: 'Sticker hidden from the app.', type: 'success' })
    } catch (err) {
      toast({ message: err.message ?? 'Delete failed.', type: 'error' })
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  async function handleRestore(s) {
    try {
      await restoreSticker(s.id)
      await refresh()
      toast({ message: 'Sticker restored.', type: 'success' })
    } catch (err) {
      toast({ message: err.message ?? 'Restore failed.', type: 'error' })
    }
  }

  const editorOpen = editingId !== null

  return (
    <>
      <Helmet>
        <title>Stickers · BackBonz Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <AdminShell>
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">Stickers</h1>
          <button
            onClick={startNew}
            disabled={editorOpen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-denim text-white hover:bg-denim-400 transition-colors disabled:opacity-50"
          >
            <Plus size={15} />
            Add sticker
          </button>
        </div>

        <p className="text-sm text-foreground-muted mb-6">
          Stickers users unlock by hitting goals and streaks. The <strong>Sticker ID</strong> is a
          permanent join-key (e.g. <code className="bg-background px-1 rounded">streak_21</code>) —
          it can't be changed once created. Deleting hides a sticker from the app but keeps it on
          existing journal entries.
        </p>

        {editingId === 'new' && (
          <StickerEditor
            isNew
            draft={draft}
            setDraft={setDraft}
            imagePreview={imagePreview}
            onPickImage={pickImage}
            saving={saving}
            onSave={handleSave}
            onCancel={cancelEdit}
          />
        )}

        {loading ? (
          <div className="text-sm text-foreground-muted">Loading stickers…</div>
        ) : stickers.length === 0 && editingId !== 'new' ? (
          <p className="text-sm text-foreground-muted">
            No stickers yet. Click <strong>Add sticker</strong> to create one.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {stickers.map((s) =>
              editingId === s.id ? (
                <div key={s.id} className="sm:col-span-2">
                  <StickerEditor
                    draft={draft}
                    setDraft={setDraft}
                    imagePreview={imagePreview}
                    onPickImage={pickImage}
                    saving={saving}
                    onSave={handleSave}
                    onCancel={cancelEdit}
                  />
                </div>
              ) : (
                <div
                  key={s.id}
                  className={`bg-white border border-divider rounded-2xl p-4 flex items-start gap-4 ${
                    s.active === false ? 'opacity-60' : ''
                  }`}
                >
                  <div className="w-16 h-16 shrink-0 rounded-xl bg-background border border-divider flex items-center justify-center overflow-hidden">
                    {s.image_url ? (
                      <img src={s.image_url} alt={s.title} className="w-full h-full object-contain" />
                    ) : (
                      <ImageUp size={20} className="text-foreground-muted" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground truncate">{s.title}</p>
                      {s.active === false && (
                        <span className="text-[10px] font-bold uppercase tracking-wide text-true-brown bg-yoke-100 px-1.5 py-0.5 rounded">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-foreground-muted mt-0.5 font-mono truncate">{s.id}</p>
                    <p className="text-sm text-foreground-tertiary mt-1 flex items-center gap-1">
                      <Lock size={12} className="shrink-0" />
                      {s.criteria_label || describeUnlock(s.unlock)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {s.active === false ? (
                      <button
                        onClick={() => handleRestore(s)}
                        disabled={editorOpen}
                        className="p-2 rounded-lg text-foreground-muted hover:text-denim hover:bg-rebel-pink-100/50 transition-colors disabled:opacity-40"
                        aria-label="Restore sticker"
                        title="Restore"
                      >
                        <RotateCcw size={15} />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(s)}
                          disabled={editorOpen}
                          className="p-2 rounded-lg text-foreground-muted hover:text-denim hover:bg-rebel-pink-100/50 transition-colors disabled:opacity-40"
                          aria-label="Edit sticker"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(s)}
                          disabled={editorOpen}
                          className="p-2 rounded-lg text-foreground-muted hover:text-cherry-red hover:bg-rebel-pink-100/50 transition-colors disabled:opacity-40"
                          aria-label="Delete sticker"
                        >
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </AdminShell>

      <ConfirmModal
        open={!!deleteTarget}
        title="Hide this sticker?"
        message={
          deleteTarget
            ? `"${deleteTarget.title}" will be hidden from the app. Existing journal entries that used it keep working. You can restore it later.`
            : ''
        }
        confirmLabel="Hide"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        busy={deleting}
      />
    </>
  )
}

function describeUnlock(unlock) {
  if (!unlock) return 'No unlock rule'
  if (unlock.type === 'daily_goal') return 'Complete daily goal'
  if (unlock.type === 'streak') return `Reach ${unlock.value}-day streak`
  return 'Awarded manually'
}

function StickerEditor({ isNew, draft, setDraft, imagePreview, onPickImage, saving, onSave, onCancel }) {
  const inputRef = useRef(null)
  const selectedType = UNLOCK_TYPES.find((t) => t.value === draft.unlockType)

  return (
    <div className="bg-white border-2 border-denim/30 rounded-2xl p-4 mb-3 flex flex-col gap-4">
      <p className="font-semibold text-foreground">{isNew ? 'New sticker' : 'Edit sticker'}</p>

      <div className="flex gap-4">
        {/* Image picker */}
        <div className="flex flex-col gap-2 items-center">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-divider bg-background hover:border-denim/50 flex items-center justify-center overflow-hidden transition-colors"
            aria-label="Upload sticker image"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="w-full h-full object-contain" />
            ) : (
              <ImageUp size={24} className="text-foreground-muted" />
            )}
          </button>
          <span className="text-[11px] text-foreground-muted">PNG/WebP · 1 MB</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onPickImage(f)
              e.target.value = ''
            }}
          />
        </div>

        {/* Fields */}
        <div className="flex-1 flex flex-col gap-3">
          {isNew && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-foreground-secondary">
                Sticker ID <span className="text-foreground-muted font-normal">(permanent)</span>
              </label>
              <input
                type="text"
                value={draft.stickerId}
                onChange={(e) => setDraft((d) => ({ ...d, stickerId: e.target.value }))}
                placeholder="streak_21"
                className="w-full px-3 py-2 rounded-xl border border-divider bg-background text-foreground font-mono text-sm focus:outline-none focus:border-rebel-pink focus:ring-2 focus:ring-rebel-pink/20 transition-colors"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground-secondary">Title</label>
            <input
              type="text"
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="21 Day Streak"
              className="w-full px-3 py-2 rounded-xl border border-divider bg-background text-foreground focus:outline-none focus:border-rebel-pink focus:ring-2 focus:ring-rebel-pink/20 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-sm font-medium text-foreground-secondary">Unlock rule</label>
          <select
            value={draft.unlockType}
            onChange={(e) => setDraft((d) => ({ ...d, unlockType: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl border border-divider bg-background text-foreground focus:outline-none focus:border-rebel-pink focus:ring-2 focus:ring-rebel-pink/20 transition-colors"
          >
            {UNLOCK_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {selectedType?.needsValue && (
          <div className="flex flex-col gap-1 w-full sm:w-32">
            <label className="text-sm font-medium text-foreground-secondary">Streak days</label>
            <input
              type="number"
              min={1}
              value={draft.unlockValue}
              onChange={(e) => setDraft((d) => ({ ...d, unlockValue: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-divider bg-background text-foreground focus:outline-none focus:border-rebel-pink focus:ring-2 focus:ring-rebel-pink/20 transition-colors"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-foreground-secondary">
          Criteria label <span className="text-foreground-muted font-normal">(shown in the app)</span>
        </label>
        <input
          type="text"
          value={draft.criteriaLabel}
          onChange={(e) => setDraft((d) => ({ ...d, criteriaLabel: e.target.value }))}
          placeholder={defaultCriteriaLabel(draft.unlockType, draft.unlockValue)}
          className="w-full px-3 py-2 rounded-xl border border-divider bg-background text-foreground focus:outline-none focus:border-rebel-pink focus:ring-2 focus:ring-rebel-pink/20 transition-colors"
        />
      </div>

      <div className="flex items-center gap-2 self-end">
        <button
          onClick={onCancel}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground-tertiary hover:bg-rebel-pink-100/50 transition-colors disabled:opacity-50"
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
