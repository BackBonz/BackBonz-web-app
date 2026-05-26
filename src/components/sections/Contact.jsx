import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { ContactForm } from '../forms/ContactForm'

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-20 sm:py-28 bg-rebel-pink-100/30"
      aria-labelledby="home-contact-heading"
    >
      <Container>
        <div className="max-w-xl mx-auto">
          <SectionHeading
            id="home-contact-heading"
            eyebrow="Stay in Touch"
            title="Get notified at launch"
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
