import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Save } from 'lucide-react'
import { AdminShell } from '../../components/admin/AdminShell'
import { useToast } from '../../components/admin/Toast'
import { getSettings, saveSettings } from '../../lib/firestore/settingsRepo'
import { DEFAULT_SETTINGS } from '../../lib/settings/defaults'

/** "2026-06-30T00:00:00" → "2026-06-30" for <input type="date"> */
function toDateInput(value) {
  if (!value) return ''
  return String(value).slice(0, 10)
}

export default function AdminSettings() {
  const toast = useToast()
  const [form, setForm] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getSettings()
      .then(setForm)
      .finally(() => setLoading(false))
  }, [])

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await saveSettings({
        launchDate: form.launchDate,
        supportEmail: form.supportEmail.trim(),
        showAppStore: form.showAppStore,
        appStoreUrl: form.appStoreUrl.trim(),
        showPlayStore: form.showPlayStore,
        playStoreUrl: form.playStoreUrl.trim(),
        showBeta: form.showBeta,
      })
      toast({ message: 'Settings saved.', type: 'success' })
    } catch (err) {
      toast({ message: err.message ?? 'Save failed.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Settings · BackBonz Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <AdminShell>
        <h1 className="font-display text-2xl font-bold text-foreground mb-6">Settings</h1>

        {loading ? (
          <div className="text-sm text-foreground-muted">Loading settings…</div>
        ) : (
          <form onSubmit={handleSave} className="flex flex-col gap-8 max-w-xl">
            {/* General */}
            <section className="bg-white border border-divider rounded-2xl p-5 flex flex-col gap-4">
              <h2 className="font-semibold text-foreground">General</h2>

              <Field label="Launch date" hint="Drives the homepage countdown and date labels.">
                <input
                  type="date"
                  value={toDateInput(form.launchDate)}
                  onChange={(e) => set('launchDate', `${e.target.value}T00:00:00`)}
                  className={inputClass}
                />
              </Field>

              <Field label="Support email" hint="Shown across the site (footer, support page, FAQs).">
                <input
                  type="email"
                  value={form.supportEmail}
                  onChange={(e) => set('supportEmail', e.target.value)}
                  placeholder="support@example.com"
                  className={inputClass}
                />
              </Field>
            </section>

            {/* Hero buttons */}
            <section className="bg-white border border-divider rounded-2xl p-5 flex flex-col gap-4">
              <h2 className="font-semibold text-foreground">Hero buttons</h2>

              <Toggle
                label="Show App Store button"
                checked={form.showAppStore}
                onChange={(v) => set('showAppStore', v)}
              />
              {form.showAppStore && (
                <Field label="App Store URL">
                  <input
                    type="url"
                    value={form.appStoreUrl}
                    onChange={(e) => set('appStoreUrl', e.target.value)}
                    placeholder="https://apps.apple.com/…"
                    className={inputClass}
                  />
                </Field>
              )}

              <Toggle
                label="Show Google Play button"
                checked={form.showPlayStore}
                onChange={(v) => set('showPlayStore', v)}
              />
              {form.showPlayStore && (
                <Field label="Google Play URL">
                  <input
                    type="url"
                    value={form.playStoreUrl}
                    onChange={(e) => set('playStoreUrl', e.target.value)}
                    placeholder="https://play.google.com/…"
                    className={inputClass}
                  />
                </Field>
              )}

              <Toggle
                label='Show "Join the Beta" button'
                checked={form.showBeta}
                onChange={(v) => set('showBeta', v)}
              />
            </section>

            <button
              type="submit"
              disabled={saving}
              className="self-start flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-denim text-white hover:bg-denim-400 transition-colors disabled:opacity-50"
            >
              <Save size={16} />
              {saving ? 'Saving…' : 'Save settings'}
            </button>
          </form>
        )}
      </AdminShell>
    </>
  )
}

const inputClass =
  'w-full px-3 py-2 rounded-xl border border-divider bg-background text-foreground focus:outline-none focus:border-rebel-pink focus:ring-2 focus:ring-rebel-pink/20 transition-colors'

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-foreground-secondary">{label}</label>
      {children}
      {hint && <p className="text-xs text-foreground-muted">{hint}</p>}
    </div>
  )
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <span className="text-sm font-medium text-foreground-secondary">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-denim' : 'bg-divider'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </label>
  )
}
