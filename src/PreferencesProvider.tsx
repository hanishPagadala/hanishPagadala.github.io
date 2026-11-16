import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { defaultPreferences, PreferencesContext } from './preferences-context'
import type { Preferences } from './preferences-context'

export default function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('hp-preferences-v1') || '{}')
      return { ...defaultPreferences, language: saved.language === 'fr' ? 'fr' : 'en', textScale: [100, 115, 130, 150, 200].includes(saved.textScale) ? saved.textScale : 100, highContrast: saved.highContrast === true, reduceMotion: saved.reduceMotion === true, spacing: saved.spacing === true, underlineLinks: saved.underlineLinks === true, simpleMap: saved.simpleMap === true }
    } catch { return defaultPreferences }
  })
  useEffect(() => {
    const root = document.documentElement
    root.lang = preferences.language
    document.title = preferences.language === 'fr' ? 'Hanish Pagadala — Portfolio en génie' : 'Hanish Pagadala — Engineering Portfolio'
    root.style.setProperty('--text-scale', String(preferences.textScale / 100))
    root.dataset.highContrast = String(preferences.highContrast)
    root.dataset.reduceMotion = String(preferences.reduceMotion)
    root.dataset.textSpacing = String(preferences.spacing)
    root.dataset.underlineLinks = String(preferences.underlineLinks)
    root.dataset.simpleMap = String(preferences.simpleMap || preferences.textScale > 100 || preferences.spacing)
    root.dataset.largeText = String(preferences.textScale > 100)
    try { localStorage.setItem('hp-preferences-v1', JSON.stringify(preferences)) } catch { /* Preferences still apply for this visit. */ }
    window.dispatchEvent(new Event('portfolio-preferences'))
  }, [preferences])
  const update = useCallback((changes: Partial<Preferences>) => setPreferences(previous => ({ ...previous, ...changes })), [])
  const reset = useCallback(() => setPreferences(previous => ({ ...defaultPreferences, language: previous.language })), [])
  const value = useMemo(() => ({ preferences, update, reset }), [preferences, update, reset])
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}
