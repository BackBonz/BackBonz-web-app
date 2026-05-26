/**
 * @param {{ className?: string } & React.HTMLAttributes<HTMLDivElement>} props
 */
export function Container({ className = '', children, ...props }) {
  return (
    <div
      className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
