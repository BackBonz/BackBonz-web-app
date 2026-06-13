import { motion, useReducedMotion } from 'framer-motion'
import { HeartCrack, ClipboardList, TrendingDown } from 'lucide-react'
import { Container } from '../ui/Container'
import { Card } from '../ui/Card'
import { SectionHeading } from '../ui/SectionHeading'
import { Highlight } from '../ui/Highlight'
import { Fish } from '../ui/illustrations/Fish'
import { staggerContainer, cardReveal } from '../../lib/motion'

const problems = [
  {
    icon: HeartCrack,
    color: 'text-cherry-red',
    bg: 'bg-cherry-red-100',
    title: 'Brace-wearing is emotionally hard',
    body:
      "Teens face social stigma, discomfort, and self-consciousness every single day. Without support and acknowledgement, the emotional weight can feel overwhelming.",
  },
  {
    icon: ClipboardList,
    color: 'text-true-brown',
    bg: 'bg-true-brown-100',
    title: 'Manual tracking is frustrating',
    body:
      "Paper logs and memory-based reporting are unreliable. Clinicians can't get accurate wear-time data, and teens lose motivation without feedback on their progress.",
  },
  {
    icon: TrendingDown,
    color: 'text-denim',
    bg: 'bg-denim-300/20',
    title: 'Motivation drops over time',
    body:
      "Without rewards, streaks, or a reason to keep going, compliance falls off fast — especially during the years when consistent wear matters most.",
  },
]

export default function Problem() {
  const reduce = useReducedMotion()

  return (
    <section
      className="py-20 sm:py-28 bg-rebel-pink-100 relative overflow-hidden"
      aria-labelledby="problem-heading"
    >
      <Fish variant="orange" size={56} delay={0.3} float       className="absolute top-12 left-6 sm:left-16 opacity-30 pointer-events-none" />
      <Fish variant="blue"   size={48} delay={1.4} float flipX className="absolute bottom-10 right-6 sm:right-20 opacity-30 pointer-events-none" />

      <Container className="relative z-10">
        <SectionHeading
          id="problem-heading"
          eyebrow="The Problem"
          title={<>Braces are <Highlight color="red">uncomfortable</Highlight> and <Highlight color="red">consistency</Highlight> is a challenge</>}
          subtitle="Teens with scoliosis face real barriers that current solutions ignore."
          centered
          className="mb-14 "
        />

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer(reduce)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {problems.map((p) => {
            const Icon = p.icon
            return (
              <motion.div key={p.title} variants={cardReveal(reduce)}>
                <Card className="h-full flex flex-col gap-4 hover:shadow-xl transition-shadow duration-300">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${p.bg}`}
                    aria-hidden="true"
                  >
                    <Icon size={22} className={p.color} />
                  </div>
                  <h3 className="font-display text-title-4 text-foreground leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-body text-foreground-secondary leading-relaxed">
                    {p.body}
                  </p>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </Container>
    </section>
  )
}
