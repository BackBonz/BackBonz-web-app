import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Container } from '../ui/Container'
import { Highlight } from '../ui/Highlight'
import { withBase } from '../../lib/format'
import { fadeUp } from '../../lib/motion'

const founder = (n) => withBase(`images/Founder_${n}.png`)

export default function Founder() {
  const reduce = useReducedMotion()

  return (
    <section
      className="py-20 sm:py-28 bg-background relative overflow-hidden"
      aria-labelledby="founder-heading"
    >
      <Container>
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Left: scrapbook photo stack */}
          <motion.div
            variants={fadeUp(reduce)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="w-full md:w-1/2 relative min-h-[460px] sm:min-h-[560px] flex items-center justify-center"
          >
            <div className="relative w-full max-w-md h-full">
              {/* Secondary photo — top right */}
              <div className="absolute top-6 right-2 w-[58%] z-10 rotate-6 transition-transform duration-500 hover:rotate-2">
                <div className="bg-white p-3 rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-divider">
                  <img
                    src={founder(1)}
                    alt=""
                    className="w-full aspect-[4/5] object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Secondary photo — bottom left */}
              <div className="absolute bottom-4 left-0 w-[52%] z-10 -rotate-6 transition-transform duration-500 hover:-rotate-2">
                <div className="bg-white p-3 rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-divider">
                  <img
                    src={founder(3)}
                    alt=""
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Secondary photo — upper left, tucked behind */}
              <div className="absolute top-0 left-6 w-[46%] z-0 -rotate-3 transition-transform duration-500 hover:rotate-0">
                <div className="bg-white p-2.5 rounded-sm shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-divider">
                  <img
                    src={founder(4)}
                    alt=""
                    className="w-full aspect-square object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Primary headshot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[68%] z-30 -rotate-1 transition-transform duration-500 hover:rotate-0">
                <div className="bg-white p-4 rounded-sm shadow-[0_24px_50px_rgba(0,0,0,0.12)] border border-divider">
                  <img
                    src={founder(2)}
                    alt="Charlie, founder of BackBonz"
                    className="w-full aspect-[4/5] object-cover"
                  />
                  <div className="pt-5 pb-1 text-center">
                    <span className="font-fun font-bold text-xl text-rebel-pink block leading-none">
                      Charlie
                    </span>
                    <span className="font-display text-xs font-semibold uppercase tracking-widest text-foreground-secondary mt-2 block">
                      Founder, BackBonz
                    </span>
                  </div>
                </div>
                {/* "My story" taped label */}
                <div className="absolute -bottom-3 left-6 z-40 -rotate-2">
                  <span className="inline-block bg-rebel-pink text-white font-display text-xs font-semibold uppercase tracking-widest px-3 py-1">
                    My story
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: copy */}
          <motion.div
            variants={fadeUp(reduce)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="w-full md:w-1/2 flex flex-col gap-6"
          >
            <p className="font-display text-sm font-semibold uppercase tracking-widest text-rebel-pink">
              Meet the Founder
            </p>
            <h2
              id="founder-heading"
              className="font-fun font-bold text-3xl sm:text-4xl text-foreground leading-tight"
            >
              I created BackBonz to help kids and teens with scoliosis{' '}
              <Highlight color="yoke">feel more confident</Highlight>, supported, and in control of
              their back-brace treatment.
            </h2>

            <div className="space-y-4 text-body-lg text-foreground-secondary leading-relaxed max-w-lg">
              <p>
                Growing up with a scoliosis back-brace wasn't just about the physical adjustments — it was
                about the mental hurdles. I realized that the journey doesn't have to be clinical or
                lonely.
              </p>
              <p>
                BackBonz is a space where we swap the hospital-white sterile feeling for something
                that feels like home. It's a collage of experiences, tips, and a supportive community
                that understands exactly what you're going through.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-widest text-rebel-pink hover:opacity-70 transition-opacity"
              >
                Read the full story
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
