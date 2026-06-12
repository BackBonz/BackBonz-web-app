/**
 * Marker-box highlight for emphasized words (handover style) — a solid rounded
 * colored box behind the text. Inherits the surrounding font (HeadSurgery /
 * Plakat / Bianco). `box-decoration-clone` keeps padding/rounding correct when
 * the highlighted phrase wraps across lines.
 *
 * @param {{ color?: 'pink'|'yoke'|'denim'|'brown'|'red', className?: string, children: React.ReactNode }} props
 */
const VARIANTS = {
  pink:  'bg-rebel-pink text-foreground',
  yoke:  'bg-yoke text-foreground',
  denim: 'bg-denim text-white',
  brown: 'bg-true-brown text-white',
  red:   'bg-cherry-red text-white',
}

export function Highlight({ color = 'pink', className = '', children }) {
  return (
    <span
      className={`box-decoration-clone px-2 py-0.5 ${VARIANTS[color] ?? VARIANTS.pink} ${className}`}
    >
      {children}
    </span>
  )
}
