import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { FileText, CheckCircle, AlertCircle, ArrowRight, Sticker } from 'lucide-react'
import { AdminShell } from '../../components/admin/AdminShell'
import { getAllData } from '../../lib/uploads/documentsRepo'
import { listStickers } from '../../lib/firestore/stickersRepo'

const PAGES = [
  { key: 'privacy',       label: 'Privacy Policy',  path: '/privacy'        },
  { key: 'userAgreement', label: 'User Agreement',  path: '/user-agreement' },
]

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [stickerStats, setStickerStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getAllData().then(setData),
      listStickers({ includeInactive: true })
        .then((items) => {
          const active = items.filter((s) => s.active !== false).length
          setStickerStats({ active, total: items.length })
        })
        .catch(() => setStickerStats({ active: 0, total: 0 })),
    ]).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Helmet>
        <title>Dashboard · BackBonz Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <AdminShell>
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard</h1>

        {loading ? (
          <div className="text-sm text-foreground-muted">Loading document status…</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {PAGES.map(({ key, label, path }) => {
              const pageData = data?.[key]
              const active   = pageData?.docs?.find((d) => d.isActive)
              const total    = pageData?.docs?.length ?? 0

              return (
                <div
                  key={key}
                  className="bg-white border border-divider rounded-2xl p-5 flex flex-col gap-4"
                >
                  <div className="flex items-start gap-3">
                    <FileText size={20} className="text-denim mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">{label}</p>
                      <p className="text-xs text-foreground-muted mt-0.5">{total} version{total !== 1 ? 's' : ''} uploaded</p>
                    </div>
                  </div>

                  {active ? (
                    <div className="flex items-center gap-2 text-sm text-denim bg-denim/10 rounded-lg px-3 py-2">
                      <CheckCircle size={14} className="shrink-0" />
                      <span className="truncate">
                        <strong>Active:</strong> {active.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-true-brown bg-yoke-100 rounded-lg px-3 py-2">
                      <AlertCircle size={14} className="shrink-0" />
                      No active document — public page shows fallback
                    </div>
                  )}

                  <div className="flex items-center gap-3 mt-auto">
                    <Link
                      to="/admin/documents"
                      className="flex items-center gap-1 text-sm font-medium text-denim hover:underline"
                    >
                      Manage <ArrowRight size={13} />
                    </Link>
                    <a
                      href={path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-foreground-muted hover:text-foreground transition-colors"
                    >
                      View public page ↗
                    </a>
                  </div>
                </div>
              )
            })}

            <div className="bg-white border border-divider rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <Sticker size={20} className="text-denim mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-foreground">Stickers</p>
                  <p className="text-xs text-foreground-muted mt-0.5">
                    {stickerStats?.active ?? 0} active
                    {stickerStats && stickerStats.total > stickerStats.active
                      ? ` · ${stickerStats.total - stickerStats.active} hidden`
                      : ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-denim bg-denim/10 rounded-lg px-3 py-2">
                <CheckCircle size={14} className="shrink-0" />
                <span className="truncate">Unlock rewards shown in the app</span>
              </div>

              <div className="flex items-center gap-3 mt-auto">
                <Link
                  to="/admin/stickers"
                  className="flex items-center gap-1 text-sm font-medium text-denim hover:underline"
                >
                  Manage <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </AdminShell>
    </>
  )
}
