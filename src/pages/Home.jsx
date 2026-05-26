import { Helmet } from 'react-helmet-async'
import PageShell from '../components/layout/PageShell'
import { Seo } from '../lib/seo/Seo'
import Hero from '../components/sections/Hero'
import Problem from '../components/sections/Problem'
import HowItWorks from '../components/sections/HowItWorks'
import Features from '../components/sections/Features'
import CountdownSection from '../components/sections/Countdown'
import Contact from '../components/sections/Contact'
import { SITE } from '../config/site'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'BackBonz',
      applicationCategory: 'HealthApplication',
      operatingSystem: 'iOS, Android',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: SITE.description,
      url: SITE.url,
      image: `${SITE.url}/og-image.png`,
      datePublished: '2026-06-10',
      author: { '@type': 'Organization', name: 'BackBonz', url: SITE.url },
      audience: { '@type': 'PeopleAudience', suggestedMinAge: 8, suggestedMaxAge: 18 },
    },
    {
      '@type': 'Organization',
      name: 'BackBonz',
      url: SITE.url,
      logo: `${SITE.url}/favicon.svg`,
      contactPoint: {
        '@type': 'ContactPoint',
        email: SITE.contactEmail,
        contactType: 'customer support',
      },
      sameAs: [],
    },
  ],
}

export default function Home() {
  return (
    <PageShell>
      <Seo path="/" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <CountdownSection />
      <Contact />
    </PageShell>
  )
}
