import { useEffect, useState } from 'react'
import LottieImport from 'lottie-react'
import { useReducedMotion } from 'framer-motion'

// lottie-react CJS/ESM interop — Vite may resolve the module namespace instead of the default export
const Lottie = typeof LottieImport === 'function' ? LottieImport : LottieImport.default

/**
 * Loads a Lottie JSON from `public/` via fetch and renders it.
 * Renders nothing while loading, nothing on error, and nothing when
 * prefers-reduced-motion is set (let the caller show a static fallback).
 *
 * @param {{ src: string, style?: React.CSSProperties, className?: string, ariaLabel?: string }} props
 */
export function LottiePlayer({ src, style, className, ariaLabel }) {
  const [data, setData] = useState(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    let cancelled = false
    fetch(src)
      .then((r) => r.json())
      .then((json) => { if (!cancelled) setData(json) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [src, reduce])

  if (reduce || !data) return null

  return (
    <Lottie
      animationData={data}
      loop
      autoplay
      className={className}
      style={style}
      role={ariaLabel ? 'img' : 'presentation'}
      aria-label={ariaLabel}
    />
  )
}
