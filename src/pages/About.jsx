import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, LineChart, Users, Sparkles, ArrowRight } from 'lucide-react'
import PageShell from '../components/layout/PageShell'
import { Seo } from '../lib/seo/Seo'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Highlight } from '../components/ui/Highlight'
import { withBase } from '../lib/format'
import { fadeUp, cardReveal, staggerContainer } from '../lib/motion'

// Founder photos used across the page (public/images/Founder_1..5.png).
const founder = (n) => withBase(`images/Founder_${n}.png`)

// Scrapbook collage tiles for the hero backdrop.
const COLLAGE = [
  { src: founder(1), className: 'top-8 left-[4%] w-56 h-72 -rotate-6' },
  { src: founder(2), className: 'bottom-8 left-[14%] w-64 h-64 rotate-3' },
  { src: founder(3), className: 'top-16 right-[8%] w-64 h-80 rotate-6' },
  { src: founder(4), className: 'bottom-16 right-[4%] w-56 h-72 -rotate-3' },
]

const PILLARS = [
  {
    icon: Heart,
    title: 'Confidence',
    tone: 'bg-rebel-pink-100 text-rebel-pink',
    tilt: '',
    body: 'Empowering teens to wear their braces with pride. We provide the tools to celebrate small wins and maintain a positive self-image throughout the journey.',
  },
  {
    icon: LineChart,
    title: 'Control',
    tone: 'bg-denim-300/20 text-denim',
    tilt: 'md:rotate-1',
    body: 'Knowledge is power. By tracking wear-time and symptoms in a simple interface, you take the guesswork out of your treatment plan.',
  },
  {
    icon: Users,
    title: 'Community',
    tone: 'bg-yoke-100 text-true-brown',
    tilt: 'md:-rotate-1',
    body: "No one should go through this alone. We're building a supportive network of peers who understand exactly what you're going through.",
  },
]

export default function About() {
  const reduce = useReducedMotion()

  return (
    <PageShell>
      <Seo
        title="About"
        description="The story behind BackBonz — built by someone right there in the brace with you, to help teens with scoliosis feel confident, supported, and in control."
        path="/about"
      />

      {/* ── 1. Hero: scrapbook collage ─────────────────────────────── */}
      <section
        className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-foreground px-4 sm:px-6 pt-28 pb-20"
        aria-labelledby="about-hero-heading"
      >
        {/* Collage backdrop */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none" aria-hidden="true">
          <div className="relative w-full max-w-[1400px] h-full mx-auto">
            {COLLAGE.map((tile) => (
              <img
                key={tile.src}
                src={tile.src}
                alt=""
                className={`absolute object-cover border-8 border-white shadow-2xl transition-transform duration-300 hover:!rotate-0 hover:scale-105 ${tile.className}`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          variants={fadeUp(reduce)}
          initial="hidden"
          animate="visible"
          className="relative z-10 max-w-4xl text-center text-white"
        >
          <span className="inline-flex items-center gap-1.5 font-display text-sm font-semibold uppercase tracking-widest text-rebel-pink mb-6">
            <Sparkles size={14} aria-hidden="true" />
            Founded by Alayna, Creator &amp; Advocate
          </span>
          <h1
            id="about-hero-heading"
            className="font-fun font-bold text-4xl sm:text-5xl md:text-6xl leading-tight mb-8"
          >
            I created BackBonz to help kids and teens with scoliosis feel more{' '}
            <span className="text-rebel-pink italic">confident</span>,{' '}
            <span className="text-rebel-pink italic">supported</span>, and in{' '}
            <span className="text-rebel-pink italic">control</span> of their brace treatment.
          </h1>
          <p className="text-body-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            It should be simple, encouraging, and stress-free.
          </p>
          <div className="mt-10">
            <Link
              to="/#contact"
              className="inline-flex items-center justify-center gap-2 font-medium rounded-2xl px-8 py-4 text-lg bg-rebel-pink text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Start your journey
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── 2. Founder profile ─────────────────────────────────────── */}
      <section className="py-16 sm:py-24" aria-labelledby="founder-heading">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Photo */}
            <motion.div
              variants={cardReveal(reduce)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="relative flex justify-center"
            >
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[108%] h-[108%] bg-rebel-pink-100 -rotate-2 rounded-3xl" />
              <img
                src={founder(5)}
                alt="Alayna, founder of BackBonz"
                className="w-full max-w-md aspect-[4/5] object-cover rounded-[32px] shadow-lg border-[12px] border-white rotate-1"
              />
              <div className="absolute -bottom-6 right-2 sm:-right-6 bg-white p-5 rounded-3xl shadow-lg border border-divider">
                <span className="font-fun font-bold text-2xl text-rebel-pink leading-none block">
                  Alayna
                </span>
                <span className="font-display text-xs font-semibold uppercase tracking-widest text-foreground-secondary block mt-2">
                  Founder &amp; Advocate
                </span>
              </div>
            </motion.div>

            {/* Story */}
            <motion.div
              variants={fadeUp(reduce)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="flex flex-col"
            >
              <SectionHeading
                id="founder-heading"
                eyebrow="The story behind the brace"
                title={<>More than just a <Highlight color="pink">tracking app.</Highlight></>}
                className="mb-8"
              />
              <div className="space-y-5 text-body-lg text-foreground-secondary leading-relaxed">
                <p>
                  When I was first diagnosed with scoliosis, my world felt like it was
                  shifting — literally. The transition into wearing a brace wasn't just a physical
                  change; it was an emotional journey that felt isolating and overwhelming at times.
                </p>
                <p>
                  I looked for tools that could help me manage my treatment, but everything I found
                  felt clinical, sterile, and complicated.{' '}
                  <Highlight color="yoke" className="font-semibold">
                    I wanted something that felt like a friend, not a medical record.
                  </Highlight>
                </p>
                <p>
                  BackBonz was born out of that need. I wanted to build a space where wearing a
                  brace doesn't define us, but where tracking our progress helps us reclaim our
                  confidence. This community is built for us, by someone who is right there in the
                  brace with you.
                </p>
                <p className="font-fun font-bold text-2xl text-rebel-pink pt-2">
                  You've got this. We've got this.
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ── 3. Core philosophy ─────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-background" aria-labelledby="philosophy-heading">
        <Container>
          <SectionHeading
            id="philosophy-heading"
            eyebrow="Our core philosophy"
            title={<>Three pillars, one <Highlight color="denim">journey.</Highlight></>}
            subtitle="Built on the three pillars of a better treatment experience for every teen navigating scoliosis."
            centered
            className="mb-14 flex flex-col items-center"
          />

          <motion.div
            variants={staggerContainer(reduce)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          >
            {PILLARS.map(({ icon: Icon, title, tone, tilt, body }) => (
              <motion.div
                key={title}
                variants={cardReveal(reduce)}
                className={`bg-white p-8 lg:p-10 rounded-[32px] shadow-lg hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center ${tilt}`}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-7 ${tone}`}>
                  <Icon size={32} aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-2xl text-foreground mb-3">{title}</h3>
                <p className="text-body text-foreground-secondary leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* ── 4. CTA ─────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24" aria-labelledby="about-cta-heading">
        <Container>
          <div className="max-w-4xl mx-auto bg-rebel-pink rounded-[40px] px-8 py-14 sm:px-16 sm:py-20 text-center text-white shadow-lg">
            <h2
              id="about-cta-heading"
              className="font-fun font-bold text-3xl sm:text-4xl md:text-5xl leading-tight mb-5"
            >
              Join the BackBonz family.
            </h2>
            <p className="text-body-lg text-white/90 max-w-xl mx-auto mb-10 leading-relaxed">
              Stay updated on our journey and be the first to know about new features and events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/#contact"
                className="inline-flex items-center justify-center gap-2 font-medium rounded-2xl px-8 py-4 text-lg w-full sm:w-auto bg-yoke text-foreground shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
              >
                Get in touch
              </Link>
              <Link
                to="/support"
                className="inline-flex items-center justify-center gap-2 font-medium rounded-2xl px-8 py-4 text-lg w-full sm:w-auto bg-white/10 text-white border border-white/40 hover:bg-white/20 hover:border-white/60 transition-all duration-200"
              >
                Visit support
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </PageShell>
  )
}
