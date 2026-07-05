import { motion, useReducedMotion } from 'framer-motion'
import { Apple, Smartphone, Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Container } from '../ui/Container'
import { Highlight } from '../ui/Highlight'
import { useCountdown } from '../../hooks/useCountdown'
import { useSettings } from '../../lib/settings'
import { Fish } from '../ui/illustrations/Fish'
import { fadeUp, fadeIn } from '../../lib/motion'

function scrollToContact(e) {
  e?.preventDefault()
  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
}

/* ── Mini countdown unit ─────────────────────────────────────────── */
function CountUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl sm:text-4xl font-display font-bold text-foreground tabular-nums leading-none">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-xs text-foreground-muted mt-1 uppercase tracking-wider">{label}</span>
    </div>
  )
}

function CountdownMini({ launchDate }) {
  const { days, hours, minutes, seconds, isLive } = useCountdown(launchDate)

  if (isLive) {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-yoke-100 border border-yoke-300">
        <Sparkles size={16} className="text-true-brown" aria-hidden="true" />
        <span className="text-sm font-semibold text-true-brown">BackBonz is live!</span>
      </div>
    )
  }

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-rebel-pink">
        Launching in
      </p>
      <div className="flex items-start gap-4">
        <CountUnit value={days} label="Days" />
        <span className="text-2xl font-bold text-foreground-muted mt-1" aria-hidden="true">:</span>
        <CountUnit value={hours} label="Hrs" />
        <span className="text-2xl font-bold text-foreground-muted mt-1" aria-hidden="true">:</span>
        <CountUnit value={minutes} label="Min" />
        <span className="text-2xl font-bold text-foreground-muted mt-1" aria-hidden="true">:</span>
        <CountUnit value={seconds} label="Sec" />
      </div>
    </div>
  )
}

/* ── App store badge ─────────────────────────────────────────────── */
function AppBadge({ store, href }) {
  const isApple = store === 'apple'
  const label = isApple ? 'App Store' : 'Google Play'
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 px-5 py-3 rounded-2xl border-2 border-divider bg-white/80 hover:border-rebel-pink hover:shadow-md transition-all"
      aria-label={`Download on the ${label}`}
    >
      {isApple ? (
        <Apple size={22} className="text-foreground" aria-hidden="true" />
      ) : (
        <Smartphone size={22} className="text-foreground" aria-hidden="true" />
      )}
      <div className="text-left leading-tight">
        <p className="text-[10px] text-foreground-tertiary">
          {isApple ? 'Download on the' : 'Get it on'}
        </p>
        <p className="text-sm font-semibold text-foreground">{label}</p>
      </div>
    </a>
  )
}

/* ── Hero ─────────────────────────────────────────────────────────── */
export default function Hero() {
  const reduce = useReducedMotion()
  const {
    launchDate,
    showAppStore, appStoreUrl,
    showPlayStore, playStoreUrl,
    showBeta,
  } = useSettings()

  const appleVisible = showAppStore && appStoreUrl
  const googleVisible = showPlayStore && playStoreUrl
  const anyBadge = appleVisible || googleVisible

  return (
    <section
      className="bg-yoke-100 relative min-h-screen flex items-center pt-16 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Floating fish */}
      <Fish variant="white"  size={96} delay={0}   float className="absolute top-10 right-6 sm:right-16 md:right-24 opacity-90 pointer-events-none" />
      <Fish variant="blue"   size={96} delay={1.2} float flipX className="absolute bottom-28 left-4 sm:left-12 opacity-80 pointer-events-none" />
      <Fish variant="orange" size={96} delay={0.7} float className="absolute top-36 left-8 sm:left-24 md:left-40 opacity-80 pointer-events-none" />

      <Fish variant="orange"  size={96} delay={0}   float className="absolute top-150 right-6 sm:right-16 md:right-40 opacity-90 pointer-events-none" />
      <Fish variant="blue"   size={96} delay={1.2} float flipX className="absolute bottom-28 left-4 sm:left-280 opacity-80 pointer-events-none" />
      <Fish variant="white" size={96} delay={0.7} float className="absolute top-99 left-8 sm:left-24 md:left-130 opacity-80 pointer-events-none" />

      <Container className="relative z-10 py-20 sm:py-28 flex flex-col items-center text-center gap-8">
        {/* Coming soon badge */}
        <motion.div
          variants={fadeIn(reduce)}
          initial="hidden"
          animate="visible"
        >
          <Badge variant="pink">
            <Sparkles size={12} aria-hidden="true" />
            Coming Soon
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          id="hero-heading"
          variants={fadeUp(reduce)}
          initial="hidden"
          animate="visible"
          className="font-fun font-bold text-4xl sm:text-5xl md:text-6xl max-w-6xl text-foreground leading-tight "
        >
          Helping teens with scoliosis build{' '}
          <Highlight color="pink">confidence</Highlight> and <Highlight color="pink">healthy</Highlight>
          back-brace-wear habits.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp(reduce)}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="text-body-lg text-foreground-secondary max-w-xl leading-relaxed"
        >
          BackBonz transforms back-brace tracking into a rewarding daily routine
          through motivation, progress tracking, and companion-based engagement.
        </motion.p>

        {/* Countdown */}
        <motion.div
          variants={fadeIn(reduce)}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm rounded-3xl px-8 py-5 shadow-lg border border-white"
          aria-live="polite"
          aria-atomic="true"
        >
          <CountdownMini launchDate={launchDate} />
        </motion.div>

        {/* App badges — shown only when enabled from the admin panel */}
        {anyBadge && (
          <motion.div
            variants={fadeUp(reduce)}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {appleVisible && <AppBadge store="apple" href={appStoreUrl} />}
            {googleVisible && <AppBadge store="google" href={playStoreUrl} />}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          variants={fadeUp(reduce)}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {showBeta && (
            <Button
              as="a"
              href="#contact"
              variant="primary"
              size="lg"
              onClick={scrollToContact}
            >
              Join the Beta
            </Button>
          )}
          <Button
            as="a"
            href="#contact"
            variant={showBeta ? 'secondary' : 'primary'}
            size="lg"
            onClick={scrollToContact}
          >
            Get notified at launch
          </Button>
          <Button
            as="a"
            href="#how-it-works"
            variant="ghost"
            size="lg"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            See how it works
          </Button>
        </motion.div>
      </Container>

      {/* Soft bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-background to-transparent pointer-events-none"
        aria-hidden="true"
      />
    </section>
  )
}
