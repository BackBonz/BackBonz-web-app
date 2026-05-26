import { Link } from 'react-router-dom'
import { Mail, ShieldCheck } from 'lucide-react'
import { SITE } from '../../config/site'

function FishGlyphSmall() {
  return (
    <svg width="20" height="13" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M72 30 C88 12 100 4 100 4 L94 30 L100 56 C100 56 88 48 72 30 Z" fill="#EA92CB" opacity="0.8" />
      <ellipse cx="40" cy="30" rx="36" ry="23" fill="#EA92CB" opacity="0.8" />
      <circle cx="16" cy="27" r="4" fill="white" />
    </svg>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-foreground text-white pt-12 pb-8" role="contentinfo">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 font-display text-lg font-bold text-white hover:text-rebel-pink transition-colors"
              aria-label="BackBonz home"
            >
              <FishGlyphSmall />
              BackBonz
            </Link>
            <p className="text-sm text-white/60 max-w-xs leading-relaxed">
              {SITE.tagline}
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2" role="list">
              {SITE.nav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-white/60 hover:text-rebel-pink transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Privacy at a glance — COPPA / Kids Category compliance summary */}
        <div className="border-t border-white/10 pt-6 mb-6">
          <div className="flex items-start gap-3 bg-white/5 rounded-2xl px-4 py-3">
            <ShieldCheck size={16} className="text-rebel-pink mt-0.5 shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs font-semibold text-white/80 mb-1">Privacy at a glance</p>
              <p className="text-xs text-white/50 leading-relaxed">
                BackBonz collects only what you give us — your contact message is emailed directly to our team and never stored in a database.
                The app tracks brace wear-time locally on your device. No ads, no behavioral tracking, no data sold to third parties.
                Children under 13 require parental consent.{' '}
                <Link to="/privacy" className="text-rebel-pink hover:text-rebel-pink-300 underline underline-offset-2">
                  Full Privacy Policy →
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-rebel-pink transition-colors"
            aria-label={`Send email to ${SITE.contactEmail}`}
          >
            <Mail size={13} aria-hidden="true" />
            {SITE.contactEmail}
          </a>
        </div>
      </div>
    </footer>
  )
}
