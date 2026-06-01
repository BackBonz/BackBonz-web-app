import { createContext, useContext, useEffect, useState } from 'react'
import { getSettings } from '../firestore/settingsRepo'
import { DEFAULT_SETTINGS } from './defaults'

const SettingsContext = createContext(DEFAULT_SETTINGS)

/**
 * Loads site settings from Firestore once on mount, seeded with defaults so the
 * UI renders immediately and never breaks if the read fails or hasn't returned.
 */
export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  useEffect(() => {
    let active = true
    getSettings().then((s) => {
      if (active) setSettings(s)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
