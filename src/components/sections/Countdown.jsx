import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Container } from '../ui/Container'
import { useCountdown } from '../../hooks/useCountdown'
import { useSettings } from '../../lib/settings'
import { formatLaunchDate } from '../../lib/format'
import { Highlight } from '../ui/Highlight'
import { fadeUp } from '../../lib/motion'

function Unit({ value, label, reduce }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="bg-white/15 backdrop-blur-sm border border-white/20 rounded-3xl px-6 py-5 min-w-[80px] sm:min-w-[100px] text-center">
        {reduce ? (
          <span className="block text-4xl sm:text-5xl font-display font-bold text-white tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.span
              key={value}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="block text-4xl sm:text-5xl font-display font-bold text-white tabular-nums"
            >
              {String(value).padStart(2, '0')}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
      <span className="text-xs text-white/60 uppercase tracking-widest">{label}</span>
    </div>
  )
}

export default function CountdownSection() {
  const { launchDate } = useSettings()
  const { days, hours, minutes, seconds, isLive } = useCountdown(launchDate)
  const reduce = useReducedMotion()

  return (
    <section
      className="py-20 sm:py-28 bg-denim relative overflow-hidden"
      aria-labelledby="countdown-heading"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Background blobs */}
      <div
        className="absolute top-0 right-0 w-64 h-64 rounded-full bg-rebel-pink/15 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-yoke/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <Container className="relative z-10 text-center">
        <motion.div
          variants={fadeUp(reduce)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-8"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-yoke" aria-hidden="true" />
            <p className="text-sm font-semibold uppercase tracking-widest text-yoke">
              Launch countdown
            </p>
            <Sparkles size={18} className="text-yoke" aria-hidden="true" />
          </div>

          <h2 id="countdown-heading" className="font-fun text-title-2 sm:text-4xl text-white leading-tight">
            {isLive ? (
              'BackBonz is live! 🎉'
            ) : (
              <>BackBonz launches <Highlight color="yoke">{formatLaunchDate(launchDate)}</Highlight></>
            )}
          </h2>

          {!isLive && (
            <div
              className="flex flex-wrap justify-center gap-4 sm:gap-6"
              role="timer"
              aria-label={`${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds until launch`}
            >
              <Unit value={days} label="Days" reduce={reduce} />
              <div className="text-4xl text-white/40 mt-4" aria-hidden="true">:</div>
              <Unit value={hours} label="Hours" reduce={reduce} />
              <div className="text-4xl text-white/40 mt-4" aria-hidden="true">:</div>
              <Unit value={minutes} label="Minutes" reduce={reduce} />
              <div className="text-4xl text-white/40 mt-4" aria-hidden="true">:</div>
              <Unit value={seconds} label="Seconds" reduce={reduce} />
            </div>
          )}

          <p className="text-white/60 text-body max-w-md leading-relaxed">
            Be the first to know when BackBonz goes live.{' '}
            <button
              className="text-yoke underline underline-offset-2 hover:text-yoke-300 transition-colors"
              onClick={() =>
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }
            >
              Sign up for early access.
            </button>
          </p>
        </motion.div>
      </Container>
    </section>
  )
}
