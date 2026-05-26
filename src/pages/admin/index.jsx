import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { FileText, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'
import { AdminShell } from '../../components/admin/AdminShell'
import { getAllData } from '../../lib/uploads/documentsRepo'

const PAGES = [
  { key: 'privacy',       label: 'Privacy Policy',  path: '/privacy'        },
  { key: 'userAgreement', label: 'User Agreement',  path: '/user-agreement' },
]

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllData()
      .then(setData)
      .finally(() => setLoading(false))
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
                  className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-4"
                >
                  <div className="flex items-start gap-3">
                    <FileText size={20} className="text-denim mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">{label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{total} version{total !== 1 ? 's' : ''} uploaded</p>
                    </div>
                  </div>

                  {active ? (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
                      <CheckCircle size={14} className="shrink-0" />
                      <span className="truncate">
                        <strong>Active:</strong> {active.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
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
                      className="text-sm text-gray-400 hover:text-foreground transition-colors"
                    >
                      View public page ↗
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </AdminShell>
    </>
  )
}
