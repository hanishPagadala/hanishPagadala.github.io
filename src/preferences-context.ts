import { createContext, useContext } from 'react'
export type Preferences = { language: 'en' | 'fr'; textScale: number; highContrast: boolean; reduceMotion: boolean; spacing: boolean; underlineLinks: boolean; simpleMap: boolean }
export const defaultPreferences: Preferences = { language: 'en', textScale: 100, highContrast: false, reduceMotion: false, spacing: false, underlineLinks: false, simpleMap: false }
export const PreferencesContext = createContext({ preferences: defaultPreferences, update: (_: Partial<Preferences>) => { void _ }, reset: () => {} })
export const usePreferences = () => useContext(PreferencesContext)
