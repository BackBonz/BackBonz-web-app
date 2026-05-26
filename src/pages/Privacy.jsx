import { useEffect, useState } from 'react'
import manifest from '../content/manifest.json'
import PageShell from '../components/layout/PageShell'
import { Seo } from '../lib/seo/Seo'
import { DocumentViewer } from '../lib/markdown/DocumentViewer'
import { getActive } from '../lib/uploads/documentsRepo'

export default function Privacy() {
  // Start with the local file immediately — no loading spinner, instant render
  const [doc, setDoc] = useState(manifest.privacy)

  useEffect(() => {
    getActive('privacy')
      .then((active) => { if (active) setDoc(active) })
      .catch(() => {}) // already showing local fallback
  }, [])

  return (
    <PageShell>
      <Seo
        title="Privacy Policy"
        description="Learn how BackBonz collects, uses, and protects your information — including COPPA compliance for children."
        path="/privacy"
      />
      <div className="pt-16">
        <DocumentViewer doc={doc} />
      </div>
    </PageShell>
  )
}
