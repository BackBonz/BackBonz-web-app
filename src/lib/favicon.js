import { withBase } from './format'

// Cycles the browser-tab favicon through the three fish-tank frames.
// PNG favicons can't animate natively, so we swap the <link> href on a timer.
const FRAMES = [
  'images/fish_tank_1.png',
  'images/fish_tank_2.png',
  'images/fish_tank_3.png',
].map(withBase)

const INTERVAL_MS = 2000

export function startFaviconRotation() {
  if (typeof document === 'undefined') return

  // Reuse the existing icon link (id set in index.html) or create one.
  let link = document.getElementById('app-favicon') || document.querySelector('link[rel~="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.type = 'image/png'
  link.href = FRAMES[0]

  // Don't animate for users who prefer reduced motion — just show the first frame.
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduce || FRAMES.length < 2) return

  // Preload so swaps don't flicker.
  FRAMES.forEach((src) => {
    const img = new Image()
    img.src = src
  })

  let idx = 0
  setInterval(() => {
    idx = (idx + 1) % FRAMES.length
    link.href = FRAMES[idx]
  }, INTERVAL_MS)
}
