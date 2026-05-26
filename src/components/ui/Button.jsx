/**
 * @param {{ variant?: 'primary'|'secondary'|'ghost', size?: 'sm'|'md'|'lg', className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-2xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-denim focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-rebel-pink text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-yoke text-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0',
    ghost:
      'bg-transparent text-foreground-secondary border border-divider hover:bg-rebel-pink-100 hover:border-rebel-pink-300',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
