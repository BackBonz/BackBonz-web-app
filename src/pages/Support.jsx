import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Mail, Clock, Sparkles, Trash2, ArrowRight } from 'lucide-react'
import PageShell from '../components/layout/PageShell'
import { Seo } from '../lib/seo/Seo'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Highlight } from '../components/ui/Highlight'
import { ContactForm } from '../components/forms/ContactForm'
import { MarkdownRenderer } from '../lib/markdown/MarkdownRenderer'
import { useSettings } from '../lib/settings'
import { formatLaunchMonthYear } from '../lib/format'
import { listFaqs } from '../lib/firestore/faqsRepo'
import { DEFAULT_FAQS } from '../lib/settings/defaults'

// ── FAQ Item ──────────────────────────────────────────────────────────

function FaqItem({ question, answer, index }) {
  const [open, setOpen] = useState(false)
  const id = `faq-answer-${index}`
  const btnId = `faq-btn-${index}`

  return (
    <div className="border-b border-divider last:border-0">
      <button
        id={btnId}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={id}
        className="w-full text-left py-5 flex items-center justify-between gap-4 group"
      >
        <span className="font-medium text-foreground group-hover:text-rebel-pink transition-colors">
          {question}
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-foreground-muted group-hover:text-rebel-pink transition-colors"
          aria-hidden="true"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            aria-labelledby={btnId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="pb-5 text-body text-foreground-secondary leading-relaxed">
              <MarkdownRenderer source={answer} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────

export default function Support() {
  const { supportEmail: email, launchDate } = useSettings()
  const [faqs, setFaqs] = useState(null)

  useEffect(() => {
    listFaqs()
      .then((items) => setFaqs(items.length ? items : DEFAULT_FAQS))
      .catch(() => setFaqs(DEFAULT_FAQS))
  }, [])

  // Substitute the live support email into FAQ answers.
  const renderedFaqs = (faqs ?? DEFAULT_FAQS).map((f) => ({
    ...f,
    answer: f.answer.replaceAll('{{email}}', email),
  }))

  return (
    <PageShell>
      <Seo
        title="Support"
        description="Get help with BackBonz — FAQ, back-brace timer guide, contact form, and data requests."
        path="/support"
      />

      {/* Hero */}
      <section
        className="bg-rebel-pink-100 pt-28 pb-14"
        aria-labelledby="support-hero-heading"
      >
        <Container className="text-center flex flex-col items-center gap-4">
          <h1
            id="support-hero-heading"
            className="font-fun font-bold text-4xl sm:text-5xl md:text-6xl max-w-6xl text-foreground leading-tight max-w-2xl"
          >
            Support &amp; <Highlight color="pink">Help Center</Highlight>
          </h1>
          <p className="text-body-lg text-foreground-secondary max-w-xl leading-relaxed">
            Have a question about BackBonz, your back-brace tracker, or your account? We've got you
            covered.
          </p>
        </Container>
      </section>

      {/* Contact details */}
      <section className="py-10 border-b border-divider bg-white">
        <Container>
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 justify-center items-start sm:items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rebel-pink-100 flex items-center justify-center shrink-0">
                <Mail size={18} className="text-rebel-pink" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-foreground-muted uppercase tracking-wide">Email us</p>
                <a
                  href={`mailto:${email}`}
                  className="text-sm font-medium text-denim hover:text-denim-400 transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-yoke-100 flex items-center justify-center shrink-0">
                <Clock size={18} className="text-true-brown" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-foreground-muted uppercase tracking-wide">
                  Response time
                </p>
                <p className="text-sm font-medium text-foreground">
                  Within 1–2 business days
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-denim-300/20 flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-denim" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-foreground-muted uppercase tracking-wide">App status</p>
                <p className="text-sm font-medium text-foreground">
                  Coming {formatLaunchMonthYear(launchDate)}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-background" aria-labelledby="faq-heading">
        <Container>
          <SectionHeading
            id="faq-heading"
            eyebrow="FAQ"
            title={<>Frequently asked <Highlight color="denim">questions</Highlight></>}
            subtitle="Quick answers for teens, parents, and clinicians."
            centered
            className="mb-12"
          />

          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-divider px-6 sm:px-8 divide-y-0">
            {renderedFaqs.map((item, i) => (
              <FaqItem key={item.id ?? i} question={item.question} answer={item.answer} index={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* Account & data — delete account */}
      <section className="py-12 bg-white border-t border-divider" aria-labelledby="account-data-heading">
        <Container>
          <div className="max-w-2xl mx-auto bg-cherry-red-100 rounded-3xl border border-cherry-red/20 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0">
              <Trash2 size={22} className="text-cherry-red" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h2 id="account-data-heading" className="font-display text-title-4 text-foreground mb-1">
                Delete your account
              </h2>
              <p className="text-body text-foreground-secondary leading-relaxed">
                Want to permanently delete your BackBonz account and all associated data? You can
                request deletion and verify it yourself in a couple of steps.
              </p>
            </div>
            <Link
              to="/delete-account"
              className="shrink-0 inline-flex items-center justify-center gap-2 font-medium rounded-2xl px-6 py-3 text-base bg-white text-cherry-red border border-cherry-red/20 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-cherry-red focus-visible:ring-offset-2"
            >
              Delete account
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Contact form */}
      <section
        id="contact"
        className="py-16 sm:py-20 bg-rebel-pink-100"
        aria-labelledby="support-contact-heading"
      >
        <Container>
          <div className="max-w-xl mx-auto">
            <SectionHeading
              id="support-contact-heading"
              eyebrow="Contact Us"
              title={<>Still have <Highlight color="brown">questions?</Highlight></>}
              subtitle="Send us a message and we'll get back to you within 1–2 business days."
              centered
              className="mb-10"
            />
            <ContactForm formId="support-contact" />
          </div>
        </Container>
      </section>
    </PageShell>
  )
}
