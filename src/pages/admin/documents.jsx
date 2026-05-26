import { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { AdminShell } from '../../components/admin/AdminShell'
import { UploadZone } from '../../components/admin/UploadZone'
import { DocumentCard } from '../../components/admin/DocumentCard'
import { PreviewModal } from '../../components/admin/PreviewModal'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { useToast } from '../../components/admin/Toast'
import {
  listDocuments,
  uploadDocument,
  deleteDocument,
  setActive,
  getDocumentBlobUrl,
} from '../../lib/uploads/documentsRepo'

const SECTIONS = [
  { key: 'privacy',       label: 'Privacy Policy'  },
  { key: 'userAgreement', label: 'User Agreement'  },
]

export default function AdminDocuments() {
  const toast = useToast()

  const [docs, setDocs] = useState({ privacy: [], userAgreement: [] })
  const [loading, setLoading] = useState(true)

  // Per-section uploading state
  const [uploading, setUploading] = useState({})

  // Per-card busy state: { [path]: 'settingActive' | 'deleting' | null }
  const [busy, setBusy] = useState({})

  // Preview
  const [previewDoc, setPreviewDoc] = useState(null)
  const [previewingPath, setPreviewingPath] = useState(null)

  async function handlePreview(doc) {
    setPreviewingPath(doc.path)
    try {
      const blobUrl = await getDocumentBlobUrl(doc.path)
      setPreviewDoc({ ...doc, url: blobUrl })
    } catch {
      toast({ message: 'Could not load preview.', type: 'error' })
    } finally {
      setPreviewingPath(null)
    }
  }

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null) // { page, doc }
  const [deleting, setDeleting] = useState(false)

  const refresh = useCallback(async (page) => {
    const updated = await listDocuments(page)
    setDocs((prev) => ({ ...prev, [page]: updated }))
  }, [])

  useEffect(() => {
    Promise.all(SECTIONS.map(({ key }) => listDocuments(key))).then(([p, ua]) => {
      setDocs({ privacy: p, userAgreement: ua })
      setLoading(false)
    })
  }, [])

  // ── Upload ────────────────────────────────────────────────────────────────

  async function handleUpload(page, file) {
    setUploading((prev) => ({ ...prev, [page]: true }))
    try {
      await uploadDocument(page, file)
      await refresh(page)
      toast({ message: `${file.name} uploaded.`, type: 'success' })
    } catch (err) {
      toast({ message: err.message ?? 'Upload failed.', type: 'error' })
    } finally {
      setUploading((prev) => ({ ...prev, [page]: false }))
    }
  }

  // ── Set Active ────────────────────────────────────────────────────────────

  async function handleSetActive(page, doc) {
    setBusy((prev) => ({ ...prev, [doc.path]: 'settingActive' }))
    try {
      await setActive(page, doc.path)
      await refresh(page)
      toast({ message: `${doc.name} is now active.`, type: 'success' })
    } catch (err) {
      toast({ message: err.message ?? 'Could not set active.', type: 'error' })
    } finally {
      setBusy((prev) => ({ ...prev, [doc.path]: null }))
    }
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  function handleDeleteRequest(page, doc) {
    setDeleteTarget({ page, doc })
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const { page, doc } = deleteTarget
    setDeleting(true)
    try {
      await deleteDocument(page, doc.path)
      await refresh(page)
      toast({ message: `${doc.name} deleted.`, type: 'success' })
    } catch (err) {
      toast({ message: err.message ?? 'Delete failed.', type: 'error' })
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Helmet>
        <title>Documents · BackBonz Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <AdminShell>
        <h1 className="font-display text-2xl font-bold text-foreground mb-8">Documents</h1>

        {loading ? (
          <div className="text-sm text-foreground-muted">Fetching documents…</div>
        ) : (
          <div className="flex flex-col gap-10">
            {SECTIONS.map(({ key, label }) => (
              <section key={key}>
                <h2 className="font-semibold text-foreground mb-4">{label}</h2>

                <UploadZone
                  onUpload={(file) => handleUpload(key, file)}
                  uploading={!!uploading[key]}
                />

                {docs[key].length > 0 && (
                  <div className="mt-4 flex flex-col gap-2">
                    {docs[key].map((doc) => (
                      <DocumentCard
                        key={doc.path}
                        doc={doc}
                        onSetActive={(d) => handleSetActive(key, d)}
                        onDelete={(d) => handleDeleteRequest(key, d)}
                        onPreview={handlePreview}
                        settingActive={busy[doc.path] === 'settingActive'}
                        deleting={busy[doc.path] === 'deleting'}
                        previewing={previewingPath === doc.path}
                      />
                    ))}
                  </div>
                )}

                {docs[key].length === 0 && (
                  <p className="mt-3 text-sm text-foreground-muted">
                    Nothing here yet — drag a file above to upload the first version.
                  </p>
                )}
              </section>
            ))}
          </div>
        )}
      </AdminShell>

      <PreviewModal doc={previewDoc} onClose={() => setPreviewDoc(null)} />

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete document?"
        message={deleteTarget ? `"${deleteTarget.doc.name}" will be permanently removed.` : ''}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        busy={deleting}
      />
    </>
  )
}
