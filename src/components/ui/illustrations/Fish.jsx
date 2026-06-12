import { motion, useReducedMotion } from 'framer-motion'
import { withBase } from '../../../lib/format'

// Swimming-fish images (public/images). Variant names kept for backwards-compat.
const SRC = {
  white:  'images/white.png',
  blue:   'images/blue.png',
  orange: 'images/orange.png',
  // legacy aliases → nearest available image
  pink:   'images/white.png',
  yellow: 'images/orange.png',
}

/**
 * Floating fish image.
 *
 * @param {{ variant?: 'white'|'blue'|'orange', size?: number, flipX?: boolean, float?: boolean, delay?: number, className?: string }} props
 */
export function Fish({
  variant = 'blue',
  size = 80,
  flipX = false,
  float = true,
  delay = 0,
  className = '',
}) {
  const reduce = useReducedMotion()
  const src = withBase(SRC[variant] ?? SRC.blue)
  const shouldFloat = float && !reduce

  return (
    <motion.div
      animate={shouldFloat ? { y: [0, -12, -4, 0], rotate: [0, 3, -1, 0] } : false}
      transition={shouldFloat ? { duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay } : {}}
      className={className}
      aria-hidden="true"
      style={{ display: 'inline-block' }}
    >
      <img
        src={src}
        alt=""
        draggable="false"
        style={{ width: size, height: 'auto', transform: flipX ? 'scaleX(-1)' : undefined }}
      />
    </motion.div>
  )
}
