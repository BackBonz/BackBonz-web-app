import { useEffect, useState } from 'react'
import manifest from '../content/manifest.json'
import PageShell from '../components/layout/PageShell'
import { Seo } from '../lib/seo/Seo'
import { DocumentViewer } from '../lib/markdown/DocumentViewer'
import { getActive } from '../lib/uploads/documentsRepo'

export default function UserAgreement() {
  // Start with the local file immediately — no loading spinner, instant render
  const [doc, setDoc] = useState(manifest.userAgreement)

  useEffect(() => {
    getActive('userAgreement')
      .then((active) => { if (active) setDoc(active) })
      .catch(() => {}) // already showing local fallback
  }, [])

  return (
    <PageShell>
      <Seo
        title="User Agreement"
        description="BackBonz terms of use — eligibility, parental consent, account deletion, data export, and health disclaimer."
        path="/user-agreement"
      />
      <div className="pt-16">
        <DocumentViewer doc={doc} />
      </div>
    </PageShell>
  )
}
