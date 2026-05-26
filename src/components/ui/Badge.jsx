/**
 * @param {{ variant?: 'pink'|'blue'|'yellow'|'green', className?: string } & React.HTMLAttributes<HTMLSpanElement>} props
 */
export function Badge({ variant = 'pink', className = '', children, ...props }) {
  const variants = {
    pink: 'bg-rebel-pink-100 text-rebel-pink border border-rebel-pink-200',
    blue: 'bg-denim-300/20 text-denim border border-denim-300/30',
    yellow: 'bg-yoke-100 text-true-brown border border-yoke-300',
    green: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
