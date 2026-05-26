/**
 * @param {{ id?: string, eyebrow?: string, title: string, subtitle?: string, centered?: boolean, className?: string }} props
 */
export function SectionHeading({ id, eyebrow, title, subtitle, centered = false, className = '' }) {
  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-widest text-rebel-pink mb-2">
          {eyebrow}
        </p>
      )}
      <h2 id={id} className="font-display text-title-2 sm:text-title-1 text-foreground leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-body-lg text-foreground-secondary max-w-2xl leading-relaxed text-center mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
