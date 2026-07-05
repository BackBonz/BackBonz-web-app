import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Fish } from '../ui/illustrations/Fish'
import { LottiePlayer } from '../ui/LottiePlayer'
import { staggerContainer, cardReveal } from '../../lib/motion'
import { withBase } from '../../lib/format'
import { Highlight } from '../ui/Highlight'

function PhoneFrame({ src, alt }) {
  return (
    <div className="relative mx-auto select-none" style={{ width: 160 }}>
      <div
        className="relative rounded-[2rem] border-[5px] border-foreground/12 bg-foreground/5 shadow-2xl overflow-hidden"
        style={{ aspectRatio: '9 / 19.5' }}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover object-top"
          loading="lazy"
          draggable="false"
        />
      </div>
      {/* notch */}
      <div
        className="absolute top-[6px] left-1/2 -translate-x-1/2 w-12 h-3 bg-foreground/80 rounded-full"
        aria-hidden="true"
      />
      {/* home indicator */}
      <div
        className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-14 h-[3px] rounded-full bg-foreground/20"
        aria-hidden="true"
      />
    </div>
  )
}

const steps = [
  {
    number: '01',
    cardBg: 'bg-rebel-pink-100/70',
    title: 'Put on your back-brace',
    body: 'Tap once the moment you strap in. BackBonz logs your wear time automatically — no journaling, no fuss.',
    visual: <PhoneFrame src={withBase('images/home_screen.png')} alt="BackBonz home screen showing the back-brace timer" />,
  },
  {
    number: '02',
    cardBg: 'bg-denim-300/10',
    title: 'Watch your progress stack up',
    body: 'Daily, weekly, and monthly charts show exactly where you stand — share-ready for your next ortho visit.',
    visual: <PhoneFrame src={withBase('images/entries_screen.png')} alt="BackBonz entries screen showing wear-time history" />,
  },
  {
    number: '03',
    cardBg: 'bg-yoke-100/80',
    title: 'Keep your fish swimming',
    body: 'Your fish companion lives or thrives based on your consistency. Wear your back-brace — watch it glow and level up.',
    visual: (
      <div className="relative flex flex-col items-center justify-center h-[calc(160px*19.5/9)] mx-auto gap-2" style={{ width: 160 }}>
        <LottiePlayer
          src={withBase('lottie/orange_fish_lottie.json')}
          style={{ width: 140, height: 140 }}
          ariaLabel="Animated orange fish companion"
        />
        <LottiePlayer
          src={withBase('lottie/blue_fish_lottie.json')}
          style={{ width: 140, height: 140 }}
          ariaLabel="Animated blue fish companion"
        />
        <LottiePlayer
          src={withBase('lottie/white_fish_lottie.json')}
          style={{ width: 140, height: 140 }}
          ariaLabel="Animated white fish companion"
        />
   
      </div>
    ),
  },
  {
    number: '04',
    cardBg: 'bg-cherry-red-100/50',
    title: 'Build streaks & earn badges',
    body: 'Unlock achievements, maintain streaks, and hit your daily wear goals. back-brace day becomes a game you actually want to play.',
    visual: <PhoneFrame src={withBase('images/account_screen.png')} alt="BackBonz account screen showing badges and streaks" />,
  },
]

export default function HowItWorks() {
  const reduce = useReducedMotion()

  return (
    <section
      id="how-it-works"
      className="relative py-20 sm:py-28 bg-yoke-100 overflow-hidden"
      aria-labelledby="hiw-heading"
    >
      {/* Decorative background fish */}
      <Fish
        variant="blue"
        size={64}
        flipX
        float
        delay={0.4}
        className="absolute top-8 right-6 opacity-30 pointer-events-none"
        aria-hidden="true"
      />
      <Fish
        variant="pink"
        size={52}
        float
        delay={1.2}
        className="absolute bottom-12 left-4 opacity-25 pointer-events-none"
        aria-hidden="true"
      />
      <Fish
        variant="yellow"
        size={44}
        flipX
        float
        delay={2.1}
        className="absolute top-1/2 -translate-y-1/2 left-8 opacity-20 pointer-events-none hidden lg:block"
        aria-hidden="true"
      />

      <Container>
        <SectionHeading
          id="hiw-heading"
          eyebrow="How It Works"
          title={<>From first tap to <Highlight color="denim">first streak</Highlight></>}
          subtitle="BackBonz makes back-brace-wear feel less like a chore and more like a daily adventure."
          centered
          className="mb-16"
        />


        {/* Step grid */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer(reduce)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={cardReveal(reduce)}
              className={`flex flex-col items-center text-center gap-5 rounded-3xl ${step.cardBg} border border-white/60 p-6 shadow-sm`}
            >
              {/* Step number badge */}
              <span
                className="w-8 h-8 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center self-start"
                aria-hidden="true"
              >
                {step.number}
              </span>

              {/* Visual — phone frame or Lottie */}
              <div className="w-full flex items-center justify-center">
                {step.visual}
              </div>

              <div className="flex flex-col gap-2 mt-10">
                <h3 className="font-display text-title-5 text-foreground">{step.title}</h3>
                <p className="text-body text-foreground-secondary leading-relaxed">{step.body}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
