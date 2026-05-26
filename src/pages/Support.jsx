import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Mail, Clock, Sparkles } from 'lucide-react'
import PageShell from '../components/layout/PageShell'
import { Seo } from '../lib/seo/Seo'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Badge } from '../components/ui/Badge'
import { ContactForm } from '../components/forms/ContactForm'
import { SITE } from '../config/site'

// ── FAQ data ──────────────────────────────────────────────────────────

const faqs = [
  {
    q: 'How do I use the brace timer?',
    a: (
      <>
        <p>Using the brace timer is simple! Here's how:</p>
        <ol className="list-decimal list-inside mt-2 space-y-1 text-foreground-secondary">
          <li>Open BackBonz and tap the big <strong>Start Timer</strong> button on your dashboard.</li>
          <li>Put on your brace. The timer runs in the background — you don't need to keep the app open.</li>
          <li>When you take your brace off, open the app and tap <strong>Stop Timer</strong>.</li>
          <li>Your session is automatically saved and added to your daily progress.</li>
        </ol>
        <p className="mt-3">Forgot to start the timer? No problem — you can also add sessions manually from the <strong>Sessions</strong> tab by entering the start and end times.</p>
      </>
    ),
  },
  {
    q: 'How does parental consent work?',
    a: (
      <>
        <p>BackBonz is designed for teens with scoliosis, and we take children's privacy seriously. Here's how parental consent works:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-foreground-secondary">
          <li>When a user under 13 signs up, they enter their parent or guardian's email address.</li>
          <li>A consent email is automatically sent to that address with a verification link.</li>
          <li>The account is only activated after the parent or guardian clicks <strong>Confirm Consent</strong>.</li>
          <li>Parents can review, update, or revoke consent at any time by emailing us.</li>
        </ul>
        <p className="mt-3">This process complies with the Children's Online Privacy Protection Act (COPPA). For more details, see our <a href="/privacy" className="text-denim underline underline-offset-2">Privacy Policy</a>.</p>
      </>
    ),
  },
  {
    q: 'How do I request account deletion?',
    a: (
      <>
        <p>You can delete your account at any time. Here's how:</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-foreground-secondary">
          <li><strong>In the app:</strong> Go to Settings → Account → Delete Account and follow the prompts.</li>
          <li><strong>By email:</strong> Send "Delete My Account" to <a href={`mailto:${SITE.contactEmail}`} className="text-denim underline underline-offset-2">{SITE.contactEmail}</a> from the email associated with your account.</li>
        </ul>
        <p className="mt-3">For accounts belonging to children under 13, the parent or guardian must submit the deletion request. All personal data is deleted within <strong>30 days</strong>. This action is permanent and cannot be undone.</p>
      </>
    ),
  },
  {
    q: 'How do I request a copy of my data?',
    a: (
      <>
        <p>You have the right to a copy of all data we hold about you ("data portability").</p>
        <p className="mt-2">To request your data export:</p>
        <ol className="list-decimal list-inside mt-1 space-y-1 text-foreground-secondary">
          <li>Email <a href={`mailto:${SITE.contactEmail}`} className="text-denim underline underline-offset-2">{SITE.contactEmail}</a></li>
          <li>Use the subject line: <strong>"Data Export Request"</strong></li>
          <li>Include the email address associated with your account</li>
        </ol>
        <p className="mt-3">We will send a downloadable copy of your data in a common format within <strong>30 days</strong>. The export includes: account information, brace session logs, journal entries, and activity history.</p>
      </>
    ),
  },
  {
    q: 'What are your privacy and data practices?',
    a: (
      <>
        <p>We built BackBonz with privacy as a priority, especially because our users are mostly teens and young people.</p>
        <ul className="list-disc list-inside mt-2 space-y-1 text-foreground-secondary">
          <li>We <strong>never sell</strong> your data to advertisers or third parties.</li>
          <li>The contact form <strong>does not store</strong> your message — it's delivered directly to our email and then discarded.</li>
          <li>Brace session and journal data is stored securely and only accessible to you (and a parent/guardian for accounts under 13).</li>
          <li>We use Firebase (Google) for secure data storage, subject to their privacy policies.</li>
        </ul>
        <p className="mt-3">For full details, read our <a href="/privacy" className="text-denim underline underline-offset-2">Privacy Policy</a> and <a href="/user-agreement" className="text-denim underline underline-offset-2">User Agreement</a>.</p>
      </>
    ),
  },
]

// ── FAQ Item ──────────────────────────────────────────────────────────

function FaqItem({ q, a, index }) {
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
          {q}
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
            <div className="pb-5 text-body text-foreground-secondary leading-relaxed space-y-2">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────

export default function Support() {
  return (
    <PageShell>
      <Seo
        title="Support"
        description="Get help with BackBonz — FAQ, brace timer guide, contact form, and data requests."
        path="/support"
      />

      {/* Hero */}
      <section
        className="bg-gradient-to-br from-rebel-pink-100/60 to-yoke-100/40 pt-28 pb-14"
        aria-labelledby="support-hero-heading"
      >
        <Container className="text-center flex flex-col items-center gap-4">
          <Badge variant="pink">
            <Sparkles size={12} aria-hidden="true" />
            We're here to help
          </Badge>
          <h1
            id="support-hero-heading"
            className="font-display text-title-2 sm:text-title-1 text-foreground leading-tight max-w-2xl"
          >
            Support &amp; Help Center
          </h1>
          <p className="text-body-lg text-foreground-secondary max-w-xl leading-relaxed">
            Have a question about BackBonz, your brace tracker, or your account? We've got you
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
                  href={`mailto:${SITE.contactEmail}`}
                  className="text-sm font-medium text-denim hover:text-denim-400 transition-colors"
                >
                  {SITE.contactEmail}
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
                <p className="text-sm font-medium text-foreground">Coming June 2026</p>
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
            title="Frequently asked questions"
            subtitle="Quick answers for teens, parents, and clinicians."
            centered
            className="mb-12"
          />

          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-divider px-6 sm:px-8 divide-y-0">
            {faqs.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} index={i} />
            ))}
          </div>
        </Container>
      </section>

      {/* Contact form */}
      <section
        id="contact"
        className="py-16 sm:py-20 bg-rebel-pink-100/30"
        aria-labelledby="support-contact-heading"
      >
        <Container>
          <div className="max-w-xl mx-auto">
            <SectionHeading
              id="support-contact-heading"
              eyebrow="Contact Us"
              title="Still have questions?"
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
