import { motion, useReducedMotion } from 'framer-motion'

const PRESETS = {
  pink:   { body: '#EA92CB', shine: '#F7D3E9', tail: '#D97AB5' },
  blue:   { body: '#7299D1', shine: '#C2D3ED', tail: '#4377C2' },
  yellow: { body: '#F9E88A', shine: '#FDF6D0', tail: '#E8D050' },
  orange: { body: '#EF5C3F', shine: '#F9BEB2', tail: '#C9391E' },
}

/**
 * Animated inline-SVG fish illustration.
 *
 * @param {{ variant?: 'pink'|'blue'|'yellow'|'orange', size?: number, flipX?: boolean, float?: boolean, delay?: number, className?: string }} props
 */
export function Fish({
  variant = 'pink',
  size = 80,
  flipX = false,
  float = true,
  delay = 0,
  className = '',
}) {
  const reduce = useReducedMotion()
  const c = PRESETS[variant] ?? PRESETS.pink

  const shouldFloat = float && !reduce

  return (
    <motion.div
      animate={shouldFloat ? { y: [0, -12, -4, 0], rotate: [0, 3, -1, 0] } : false}
      transition={shouldFloat ? { duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay } : {}}
      className={className}
      aria-hidden="true"
      style={{ display: 'inline-block', transform: flipX ? 'scaleX(-1)' : undefined }}
    >
      <svg
        width={size}
        height={Math.round(size * 0.6)}
        viewBox="0 0 100 60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M72 30 C88 12 100 4 100 4 L94 30 L100 56 C100 56 88 48 72 30 Z"
          fill={c.tail}
          opacity="0.9"
        />
        <ellipse cx="40" cy="30" rx="36" ry="23" fill={c.body} />
        <ellipse cx="29" cy="24" rx="13" ry="7.5" fill={c.shine} opacity="0.45" />
        <circle cx="16" cy="27" r="4.5" fill="white" />
        <circle cx="17" cy="27" r="2.6" fill="#010003" />
        <circle cx="18" cy="26" r="1" fill="white" opacity="0.85" />
      </svg>
    </motion.div>
  )
}
