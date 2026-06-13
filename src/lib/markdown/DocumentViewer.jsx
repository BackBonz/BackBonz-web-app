import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Download, List, ChevronRight, AlertCircle } from 'lucide-react'
import { MarkdownRenderer, slugify } from './MarkdownRenderer'
import { PdfViewer } from './PdfViewer'
import { DocxViewer } from './DocxViewer'

// ── Utilities ─────────────────────────────────────────────────────────

function extractHeadings(markdown) {
  return markdown
    .split('\n')
    .filter((l) => /^#{1,3}\s/.test(l))
    .map((l) => {
      const m = l.match(/^(#{1,3})\s+(.+)/)
      if (!m) return null
      const text = m[2].replace(/[*_`[\]]/g, '').trim()
      return { level: m[1].length, text, id: slugify(text) }
    })
    .filter(Boolean)
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

// ── Scroll progress hook ───────────────────────────────────────────────

function useScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      setP(total > 0 ? (scrollTop / total) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return p
}

// ── Active heading hook ────────────────────────────────────────────────

function useActiveHeading(headings) {
  const [active, setActive] = useState('')
  useEffect(() => {
    if (!headings.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-80px 0px -65% 0px', threshold: 0 }
    )
    headings.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])
  return active
}

// ── Search highlight hook ──────────────────────────────────────────────

const HIGHLIGHT_CLASS = 'search-hi'

function useSearchHighlight(containerRef, searchTerm) {
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Remove previous highlights
    container.querySelectorAll(`mark.${HIGHLIGHT_CLASS}`).forEach((mark) => {
      const text = document.createTextNode(mark.textContent)
      mark.replaceWith(text)
    })

    const term = searchTerm.trim()
    if (term.length < 2) return

    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(escaped, 'gi')

    // Walk text nodes
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
    const matches = []
    let node
    while ((node = walker.nextNode())) {
      if (regex.test(node.textContent)) {
        matches.push(node)
        regex.lastIndex = 0
      }
    }

    matches.forEach((textNode) => {
      const parent = textNode.parentNode
      if (!parent || parent.nodeName === 'SCRIPT' || parent.nodeName === 'STYLE') return

      const text = textNode.textContent
      const fragment = document.createDocumentFragment()
      let last = 0
      regex.lastIndex = 0

      let match
      while ((match = regex.exec(text)) !== null) {
        if (match.index > last) {
          fragment.appendChild(document.createTextNode(text.slice(last, match.index)))
        }
        const mark = document.createElement('mark')
        mark.className = `${HIGHLIGHT_CLASS} bg-yoke/70 text-foreground rounded px-0.5`
        mark.textContent = match[0]
        fragment.appendChild(mark)
        last = regex.lastIndex
      }
      if (last < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(last)))
      }
      parent.replaceChild(fragment, textNode)
    })

    return matches.length // match count if needed
  }, [containerRef, searchTerm])
}

// ── TableOfContents ────────────────────────────────────────────────────

function TableOfContents({ headings, activeId, onLinkClick }) {
  if (!headings.length) {
    return (
      <p className="text-xs text-foreground-muted italic px-2">No headings found</p>
    )
  }

  return (
    <nav aria-label="Document table of contents">
      <ul className="space-y-0.5" role="list">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 1) * 12}px` }}>
            <a
              href={`#${h.id}`}
              onClick={onLinkClick}
              className={`block text-xs leading-relaxed py-1 px-2 rounded-xl transition-colors truncate ${
                activeId === h.id
                  ? 'bg-rebel-pink-100 text-rebel-pink font-medium'
                  : 'text-foreground-tertiary hover:text-foreground hover:bg-background'
              }`}
              aria-current={activeId === h.id ? 'location' : undefined}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// ── DocumentViewer (main component) ───────────────────────────────────

/**
 * @param {{
 *   doc: { type: 'md'|'pdf'|'docx', src: string, title: string, updatedAt: string }
 * }} props
 */
export function DocumentViewer({ doc }) {
  const [source, setSource] = useState('')
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [search, setSearch] = useState('')
  const [tocOpen, setTocOpen] = useState(false)
  const searchRef = useRef(null)
  const contentRef = useRef(null)

  const headings = doc.type === 'md' ? extractHeadings(source) : []
  const scrollProgress = useScrollProgress()
  const activeId = useActiveHeading(headings)

  useSearchHighlight(contentRef, search)

  // Fetch markdown source
  useEffect(() => {
    if (doc.type !== 'md') {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    setFetchError(null)
    fetch(doc.src)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then((text) => { if (!cancelled) { setSource(text); setLoading(false) } })
      .catch((err) => { if (!cancelled) { setFetchError(err.message); setLoading(false) } })
    return () => { cancelled = true }
  }, [doc.src, doc.type])

  const handleTocLinkClick = useCallback(() => {
    setTocOpen(false)
  }, [])

  const matchCount = search.trim().length >= 2
    ? (contentRef.current?.querySelectorAll(`mark.${HIGHLIGHT_CLASS}`).length ?? 0)
    : 0

  return (
    <>
      {/* Scroll progress bar — fixed below Navbar */}
      <div
        className="fixed top-16 left-0 right-0 z-40 h-0.5 bg-divider"
        aria-hidden="true"
      >
        <div
          className="h-full bg-rebel-pink transition-[width] duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Document header */}
      <div className="bg-white border-b border-divider sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          {/* Title + date */}
          <div className="flex-1 min-w-0">
            <h1 className="font-fun font-bold text-4xl sm:text-5xl md:text-6xl max-w-6xl text-foreground leading-tight truncate">
              {doc.title}
            </h1>
            {doc.updatedAt && (
              <p className="text-xs text-foreground-muted mt-0.5">
                Last updated: {formatDate(doc.updatedAt)}
              </p>
            )}
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none"
                aria-hidden="true"
              />
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search document…"
                aria-label="Search document"
                className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-divider bg-background text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-rebel-pink focus:ring-1 focus:ring-rebel-pink/30 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            {search.trim().length >= 2 && (
              <span className="text-xs text-foreground-muted whitespace-nowrap" aria-live="polite">
                {matchCount} {matchCount === 1 ? 'result' : 'results'}
              </span>
            )}

            {/* Download button */}
            <a
              href={doc.src}
              download
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-denim hover:text-denim-400 transition-colors whitespace-nowrap"
              aria-label={`Download ${doc.title}`}
            >
              <Download size={14} aria-hidden="true" />
              Download
            </a>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-8">
          {/* Desktop TOC sidebar */}
          {doc.type === 'md' && headings.length > 0 && (
            <aside className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-36 max-h-[calc(100vh-10rem)] overflow-y-auto pb-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-foreground-muted mb-3 px-2">
                  Contents
                </p>
                <TableOfContents
                  headings={headings}
                  activeId={activeId}
                  onLinkClick={handleTocLinkClick}
                />
              </div>
            </aside>
          )}

          {/* Content area */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div
                className="flex items-center justify-center py-24"
                role="status"
                aria-live="polite"
              >
                <div className="w-8 h-8 border-4 border-rebel-pink/30 border-t-rebel-pink rounded-full animate-spin" />
                <span className="ml-3 text-foreground-secondary">Loading document…</span>
              </div>
            ) : fetchError ? (
              <div
                className="flex items-start gap-3 p-4 bg-cherry-red-100 rounded-2xl text-cherry-red"
                role="alert"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-medium">Failed to load document</p>
                  <p className="text-sm text-cherry-red-300 mt-1">{fetchError}</p>
                </div>
              </div>
            ) : (
              <article ref={contentRef} aria-label={doc.title}>
                {doc.type === 'md' && <MarkdownRenderer source={source} />}
                {doc.type === 'pdf' && <PdfViewer src={doc.src} title={doc.title} />}
                {doc.type === 'docx' && <DocxViewer src={doc.src} title={doc.title} />}
              </article>
            )}
          </div>
        </div>
      </div>

      {/* Mobile TOC trigger */}
      {doc.type === 'md' && headings.length > 0 && (
        <button
          onClick={() => setTocOpen(true)}
          className="fixed bottom-6 right-6 lg:hidden z-30 w-12 h-12 rounded-full bg-rebel-pink text-white shadow-lg flex items-center justify-center hover:bg-rebel-pink-300 transition-colors"
          aria-label="Open table of contents"
          aria-expanded={tocOpen}
        >
          <List size={20} aria-hidden="true" />
        </button>
      )}

      {/* Mobile TOC drawer */}
      <AnimatePresence>
        {tocOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-foreground/40 lg:hidden"
            onClick={() => setTocOpen(false)}
          >
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 250 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-divider">
                <p className="text-sm font-semibold text-foreground">Contents</p>
                <button
                  onClick={() => setTocOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-rebel-pink-100 transition-colors"
                  aria-label="Close table of contents"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <TableOfContents
                  headings={headings}
                  activeId={activeId}
                  onLinkClick={handleTocLinkClick}
                />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
