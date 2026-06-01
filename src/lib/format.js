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
