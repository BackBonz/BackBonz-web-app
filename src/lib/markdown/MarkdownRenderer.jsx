import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'

function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function childrenToString(children) {
  if (typeof children === 'string') return children
  if (Array.isArray(children)) return children.map(childrenToString).join('')
  if (children?.props?.children) return childrenToString(children.props.children)
  return String(children ?? '')
}

function makeHeading(level) {
  const Tag = `h${level}`
  const sizeClasses = {
    1: 'font-fun text-title-2 sm:text-title-1 text-foreground mt-10 mb-4 leading-tight',
    2: 'font-display text-title-3 text-foreground mt-8 mb-3 leading-tight',
    3: 'font-display text-title-4 text-foreground mt-6 mb-2 leading-snug',
    4: 'font-display text-title-5 text-foreground mt-4 mb-2 leading-snug',
  }
  return function HeadingComponent({ children }) {
    const id = slugify(childrenToString(children))
    return (
      <Tag
        id={id}
        className={`${sizeClasses[level] ?? sizeClasses[4]} scroll-mt-24 group`}
      >
        <a
          href={`#${id}`}
          className="no-underline hover:underline decoration-rebel-pink"
          aria-hidden="true"
          tabIndex={-1}
        >
          {children}
        </a>
      </Tag>
    )
  }
}

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    h1: [...(defaultSchema.attributes?.h1 ?? []), 'id'],
    h2: [...(defaultSchema.attributes?.h2 ?? []), 'id'],
    h3: [...(defaultSchema.attributes?.h3 ?? []), 'id'],
    h4: [...(defaultSchema.attributes?.h4 ?? []), 'id'],
    table: ['className'],
    td: [...(defaultSchema.attributes?.td ?? []), 'align'],
    th: [...(defaultSchema.attributes?.th ?? []), 'align'],
  },
}

const components = {
  h1: makeHeading(1),
  h2: makeHeading(2),
  h3: makeHeading(3),
  h4: makeHeading(4),
  p: ({ children }) => (
    <p className="text-body text-foreground-secondary leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-outside ml-5 space-y-1.5 mb-4 text-foreground-secondary">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-outside ml-5 space-y-1.5 mb-4 text-foreground-secondary">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="text-body leading-relaxed pl-1">{children}</li>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-denim underline underline-offset-2 hover:text-denim-400 transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-foreground-secondary">{children}</em>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-rebel-pink bg-rebel-pink-100/40 pl-4 pr-3 py-2 my-4 rounded-r-xl text-foreground-tertiary italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-divider my-8" />,
  code: ({ inline, children }) =>
    inline ? (
      <code className="bg-rebel-pink-100 text-cherry-red px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ) : (
      <pre className="bg-foreground text-white rounded-2xl p-4 overflow-x-auto my-4 text-sm leading-relaxed">
        <code>{children}</code>
      </pre>
    ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-6 rounded-2xl border border-divider">
      <table className="w-full text-sm text-left">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-rebel-pink-100/50 text-foreground">{children}</thead>
  ),
  tbody: ({ children }) => (
    <tbody className="divide-y divide-divider text-foreground-secondary">{children}</tbody>
  ),
  tr: ({ children }) => <tr className="hover:bg-background transition-colors">{children}</tr>,
  th: ({ children }) => (
    <th className="px-4 py-3 font-semibold text-foreground">{children}</th>
  ),
  td: ({ children }) => <td className="px-4 py-3">{children}</td>,
}

/**
 * @param {{ source: string }} props
 */
export function MarkdownRenderer({ source }) {
  return (
    <div className="max-w-[70ch]">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
        components={components}
      >
        {source}
      </ReactMarkdown>
    </div>
  )
}

export { slugify, childrenToString }
