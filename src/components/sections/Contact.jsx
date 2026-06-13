import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Highlight } from '../ui/Highlight'
import { Fish } from '../ui/illustrations/Fish'
import { ContactForm } from '../forms/ContactForm'

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-20 sm:py-28 bg-rebel-pink-100 relative overflow-hidden"
      aria-labelledby="home-contact-heading"
    >
      <Fish variant="blue"  size={58} delay={0.5} float       className="absolute top-10 left-6 sm:left-16 opacity-30 pointer-events-none" />
      <Fish variant="white" size={48} delay={1.6} float flipX className="absolute bottom-10 right-6 sm:right-20 opacity-30 pointer-events-none" />

      <Container className="relative z-10">
        <div className="max-w-xl mx-auto">
          <SectionHeading
            id="home-contact-heading"
            eyebrow="Stay in Touch"
            title={<>Get notified <Highlight color="pink">at launch</Highlight></>}
            subtitle="Drop us your info and we'll reach out the moment BackBonz goes live."
            centered
            className="mb-10"
          />
          <ContactForm formId="home-contact" />
        </div>
      </Container>
    </section>
  )
}
