import { Helmet } from 'react-helmet-async'
import { SITE } from '../../config/site'

/**
 * @param {{ title?: string, description?: string, image?: string, path?: string }} props
 */
export function Seo({ title, description, image, path }) {
  const fullTitle = title
    ? `${title} — ${SITE.name}`
    : `${SITE.name} — back-brace Tracking for Teens with Scoliosis`
  const desc = description || SITE.description
  const canonical = `${SITE.url}${path || ''}`
  const img = image || `${SITE.url}/og-image.png`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE.name} — back-brace Tracking for Teens`} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@backbonzapp" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:image:alt" content={`${SITE.name} — back-brace Tracking for Teens`} />
    </Helmet>
  )
}
