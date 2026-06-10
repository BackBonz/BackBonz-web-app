import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './lib/auth'
import { SettingsProvider } from './lib/settings'
import { ToastProvider } from './components/admin/Toast'
import { startFaviconRotation } from './lib/favicon'
import './index.css'
import App from './App.jsx'

startFaviconRotation()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AuthProvider>
          <SettingsProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </SettingsProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
