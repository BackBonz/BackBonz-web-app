// ── Display formatting helpers ────────────────────────────────────────────────

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/** "2026-06-30T00:00:00" → "June 30, 2026" */
export function formatLaunchDate(value) {
  const d = new Date(value)
  if (isNaN(d)) return ''
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

/** "2026-06-30T00:00:00" → "June 2026" */
export function formatLaunchMonthYear(value) {
  const d = new Date(value)
  if (isNaN(d)) return ''
  return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/**
 * Prefixes a root-relative public asset path with Vite's base URL so it
 * resolves correctly under a sub-path deployment (e.g. GitHub Pages
 * /BackBonz-web-app/). In dev the base is "/", so this is a no-op.
 * Pass paths to files in `public/`, e.g. withBase('lottie/fish.json').
 */
export function withBase(path) {
  return `${import.meta.env.BASE_URL}${String(path).replace(/^\//, '')}`
}
