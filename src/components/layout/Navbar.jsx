import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { SITE } from '../../config/site'

function FishGlyph() {
  return (
    <svg
      width="28" height="18"
      viewBox="0 0 100 60"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M72 30 C88 12 100 4 100 4 L94 30 L100 56 C100 56 88 48 72 30 Z"
        fill="#EA92CB"
      />
      <ellipse cx="40" cy="30" rx="36" ry="23" fill="#EA92CB" />
      <ellipse cx="30" cy="25" rx="11" ry="7" fill="#F2BEDE" />
      <circle cx="16" cy="27" r="4" fill="white" />
      <circle cx="17" cy="27" r="2.2" fill="#010003" />
      <circle cx="17.8" cy="26.2" r="0.8" fill="white" opacity="0.7" />
    </svg>
  )
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Hash links (e.g. "/#contact"): smooth-scroll if already on the target page.
  function handleHashNav(e, to) {
    setIsOpen(false)
    const [path, id] = to.split('#')
    if (id && location.pathname === (path || '/')) {
      e.preventDefault()
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      role="banner"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-divider'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display text-xl font-bold text-foreground hover:text-rebel-pink transition-colors"
          aria-label="BackBonz — go to home"
        >
          <FishGlyph />
          <span>BackBonz</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-7" role="list">
          {SITE.nav.map((item) =>
            item.to.includes('#') ? (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={(e) => handleHashNav(e, item.to)}
                  className="text-sm font-medium text-foreground-secondary transition-colors hover:text-rebel-pink"
                >
                  {item.label}
                </Link>
              </li>
            ) : (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-rebel-pink ${
                      isActive ? 'text-rebel-pink' : 'text-foreground-secondary'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            )
          )}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden min-w-11 min-h-11 flex items-center justify-center rounded-xl hover:bg-rebel-pink/10 transition-colors text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="md:hidden bg-white/96 backdrop-blur-md border-t border-divider px-4 pb-4 pt-2"
          >
            <ul role="list" className="flex flex-col gap-1">
              {SITE.nav.map((item) =>
                item.to.includes('#') ? (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={(e) => handleHashNav(e, item.to)}
                      className="block px-4 py-3 rounded-2xl text-sm font-medium text-foreground-secondary hover:bg-rebel-pink-100/50 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-rebel-pink-100 text-rebel-pink'
                            : 'text-foreground-secondary hover:bg-rebel-pink-100/50'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
