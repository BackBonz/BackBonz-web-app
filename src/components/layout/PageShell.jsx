import Navbar from './Navbar'
import Footer from './Footer'

/**
 * @param {{ children: React.ReactNode }} props
 */
export default function PageShell({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  )
}
