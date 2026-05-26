/**
 * @param {{ className?: string } & React.HTMLAttributes<HTMLDivElement>} props
 */
export function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-lg p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
