import { motion, useReducedMotion } from 'framer-motion'
import {
  Timer,
  PenLine,
  Fish,
  Flame,
  BookOpen,
  Target,
  LineChart,
  Heart,
} from 'lucide-react'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Highlight } from '../ui/Highlight'
import { Fish as SwimFish } from '../ui/illustrations/Fish'
import { staggerContainer, cardReveal } from '../../lib/motion'

const features = [
  {
    icon: Timer,
    color: 'text-rebel-pink',
    bg: 'bg-rebel-pink-100',
    title: 'Live Timer Tracking',
    body: 'One-tap start/stop back-brace timer that runs in the background. Never miss tracking a minute.',
  },
  {
    icon: PenLine,
    color: 'text-true-brown',
    bg: 'bg-true-brown-100',
    title: 'Manual Session Entry',
    body: 'Forgot to start the timer? Add sessions manually with custom time ranges.',
  },
  {
    icon: Fish,
    color: 'text-denim',
    bg: 'bg-denim-300/20',
    title: 'Fish Companion',
    body: 'Your fish friend grows, changes color, and evolves as your back-brace compliance improves.',
  },
  {
    icon: Flame,
    color: 'text-cherry-red',
    bg: 'bg-cherry-red-100',
    title: 'Streaks & Rewards',
    body: 'Daily and weekly streak counters with fun badges for hitting your wear-time goals.',
  },
  {
    icon: BookOpen,
    color: 'text-true-brown',
    bg: 'bg-yoke-100',
    title: 'Journaling',
    body: 'Optional daily notes to capture how you felt, what was hard, and wins to celebrate.',
  },
  {
    icon: Target,
    color: 'text-rebel-pink',
    bg: 'bg-rebel-pink-100',
    title: 'Daily Goals',
    body: 'Set personalized wear-time targets with your orthotist\'s recommendation pre-loaded.',
  },
  {
    icon: LineChart,
    color: 'text-denim',
    bg: 'bg-denim-300/20',
    title: 'Progress Tracking',
    body: 'Weekly and monthly charts make it easy to see trends and share data at appointments.',
  },
  {
    icon: Heart,
    color: 'text-cherry-red',
    bg: 'bg-cherry-red-100',
    title: 'Emotional Support',
    body: 'In-app encouragement, affirmations, and a community of teens going through the same journey.',
  },
]

export default function Features() {
  const reduce = useReducedMotion()

  return (
    <section
      className="py-20 sm:py-28 bg-background relative overflow-hidden"
      aria-labelledby="features-heading"
    >
      <SwimFish variant="white"  size={56} delay={0.4} float       className="absolute top-10 right-6 sm:right-20 opacity-25 pointer-events-none" />
      <SwimFish variant="orange" size={46} delay={1.5} float flipX className="absolute bottom-12 left-6 sm:left-16 opacity-25 pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          id="features-heading"
          eyebrow="Features"
          title={<>Everything a teen needs to <Highlight color="yoke">succeed</Highlight></>}
          subtitle="BackBonz was built with teens, parents, and clinicians in mind — every feature earns its place."
          centered
          className="mb-14"
        />

        <motion.ul
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          role="list"
          variants={staggerContainer(reduce)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {features.map((f) => {
            const Icon = f.icon
            return (
              <motion.li
                key={f.title}
                variants={cardReveal(reduce)}
                className="bg-white rounded-3xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-lg transition-shadow duration-300 border border-divider"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.bg}`}
                  aria-hidden="true"
                >
                  <Icon size={18} className={f.color} />
                </div>
                <h3 className="font-display text-title-5 text-foreground">{f.title}</h3>
                <p className="text-sm text-foreground-secondary leading-relaxed">{f.body}</p>
              </motion.li>
            )
          })}
        </motion.ul>
      </Container>
    </section>
  )
}
