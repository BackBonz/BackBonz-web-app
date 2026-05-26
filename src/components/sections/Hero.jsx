import { motion, useReducedMotion } from 'framer-motion'
import { Apple, Smartphone, Sparkles } from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Container } from '../ui/Container'
import { useCountdown } from '../../hooks/useCountdown'
import { Fish } from '../ui/illustrations/Fish'
import { fadeUp, fadeIn } from '../../lib/motion'

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

function CountdownMini() {
  const { days, hours, minutes, seconds, isLive } = useCountdown()

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

/* ── App store placeholders ──────────────────────────────────────── */
function AppBadge({ store }) {
  const isApple = store === 'apple'
  return (
    <div
      className="flex items-center gap-3 px-5 py-3 rounded-2xl border-2 border-divider bg-white/60 cursor-not-allowed opacity-60"
      title="Coming soon"
      role="img"
      aria-label={`${isApple ? 'App Store' : 'Google Play'} — coming soon`}
    >
      {isApple ? (
        <Apple size={22} className="text-foreground" aria-hidden="true" />
      ) : (
        <Smartphone size={22} className="text-foreground" aria-hidden="true" />
      )}
      <div className="text-left leading-tight">
        <p className="text-[10px] text-foreground-tertiary">Coming soon on</p>
        <p className="text-sm font-semibold text-foreground">
          {isApple ? 'App Store' : 'Google Play'}
        </p>
      </div>
    </div>
  )
}

/* ── Hero ─────────────────────────────────────────────────────────── */
export default function Hero() {
  const reduce = useReducedMotion()

  return (
    <section
      className="hero-gradient relative min-h-screen flex items-center pt-16 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Floating fish */}
      <Fish variant="pink"  size={90} delay={0}   float className="absolute top-10 right-6 sm:right-16 md:right-24 opacity-80 pointer-events-none" />
      <Fish variant="blue"  size={65} delay={1.2} float flipX className="absolute bottom-28 left-4 sm:left-12 opacity-70 pointer-events-none" />
      <Fish variant="yellow" size={52} delay={0.7} float className="absolute top-36 left-8 sm:left-24 md:left-40 opacity-70 pointer-events-none" />

      <Container className="relative z-10 py-20 sm:py-28 flex flex-col items-center text-center gap-8">
        {/* Coming soon badge */}
        <motion.div
          variants={fadeIn(reduce)}
          initial="hidden"
          animate="visible"
        >
          <Badge variant="pink">
            <Sparkles size={12} aria-hidden="true" />
            Coming Soon — June 2026
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          id="hero-heading"
          variants={fadeUp(reduce)}
          initial="hidden"
          animate="visible"
          className="font-display text-title-1 sm:text-4xl md:text-5xl text-foreground leading-tight max-w-3xl"
        >
          Helping teens with scoliosis build{' '}
          <span className="text-rebel-pink">confidence</span> and healthy
          brace-wear habits.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp(reduce)}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="text-body-lg text-foreground-secondary max-w-xl leading-relaxed"
        >
          BackBonz transforms brace tracking into a rewarding daily routine
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
          <CountdownMini />
        </motion.div>

        {/* App badges */}
        <motion.div
          variants={fadeUp(reduce)}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <AppBadge store="apple" />
          <AppBadge store="google" />
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp(reduce)}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Button
            as="a"
            href="#contact"
            variant="primary"
            size="lg"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
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
