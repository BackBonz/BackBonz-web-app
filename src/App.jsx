import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { RequireAdmin } from './lib/auth'

const Home          = lazy(() => import('./pages/Home'))
const Support       = lazy(() => import('./pages/Support'))
const Privacy       = lazy(() => import('./pages/Privacy'))
const UserAgreement = lazy(() => import('./pages/UserAgreement'))
const AdminLogin    = lazy(() => import('./pages/admin/login'))
const AdminDashboard   = lazy(() => import('./pages/admin/index'))
const AdminDocuments   = lazy(() => import('./pages/admin/documents'))
const AdminMessages    = lazy(() => import('./pages/admin/messages'))
const AdminFaq         = lazy(() => import('./pages/admin/faq'))
const AdminSettings    = lazy(() => import('./pages/admin/settings'))

function RouteLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background" role="status" aria-live="polite">
      <div className="w-8 h-8 rounded-full border-4 border-rebel-pink/30 border-t-rebel-pink animate-spin" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/"               element={<Home />} />
        <Route path="/support"        element={<Support />} />
        <Route path="/privacy"        element={<Privacy />} />
        <Route path="/user-agreement" element={<UserAgreement />} />

        {/* Admin — login is public, everything else requires auth */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<RequireAdmin />}>
          <Route path="/admin"           element={<AdminDashboard />} />
          <Route path="/admin/documents" element={<AdminDocuments />} />
          <Route path="/admin/messages"  element={<AdminMessages />} />
          <Route path="/admin/faq"       element={<AdminFaq />} />
          <Route path="/admin/settings"  element={<AdminSettings />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
