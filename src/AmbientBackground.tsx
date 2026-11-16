import { usePreferences } from './preferences-context'
import Localize from './Localize'
import { useEffect, useState, useId } from 'react'
import './AmbientBackground.css'

export default function AmbientBackground() {
  const { preferences } = usePreferences()
  const patternId = useId()
  const [moving, setMoving] = useState(() => {
    if (typeof window === 'undefined' || typeof matchMedia === 'undefined') return false
    try { return !matchMedia('(prefers-reduced-motion: reduce)').matches && localStorage.getItem('hp-background-motion') !== 'paused' } catch { return !matchMedia('(prefers-reduced-motion: reduce)').matches }
  })
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)')
    const stop = () => { if (preference.matches) setMoving(false) }
    preference.addEventListener('change', stop)
    return () => preference.removeEventListener('change', stop)
  }, [])
  useEffect(() => {
    const pauseHiddenTab = () => { document.documentElement.dataset.pageHidden = String(document.hidden) }
    pauseHiddenTab()
    document.addEventListener('visibilitychange', pauseHiddenTab)
    return () => document.removeEventListener('visibilitychange', pauseHiddenTab)
  }, [])
  function toggle() {
    const next = !moving
    setMoving(next)
    try { localStorage.setItem('hp-background-motion', next ? 'enabled' : 'paused') } catch { /* Motion remains usable without storage. */ }
  }
  return <Localize><>
    <div className={`site-ambience geometric-ambience ${moving ? 'is-moving' : ''}`} aria-hidden="true"><div className="geometric-field"><svg className="geometric-grid" width="100%" height="100%"><defs><pattern id={patternId} width="120" height="207.846" patternUnits="userSpaceOnUse"><path d="M60 0 120 34.641V103.923L60 138.564 0 103.923V34.641ZM60 69.282 0 34.641M60 69.282 120 34.641M60 69.282V138.564M0 103.923V173.205L60 207.846 120 173.205V103.923M0 173.205 60 138.564 120 173.205M60 207.846V138.564" /></pattern></defs><rect width="100%" height="100%" fill={`url(#${patternId})`} /></svg></div><span className="geometric-wash" /></div>
    <button disabled={preferences.reduceMotion} className="background-motion-toggle" onClick={toggle} aria-pressed={moving} aria-label={moving ? 'Pause background motion' : 'Enable background motion'} title={moving ? 'Pause background motion' : 'Enable background motion'}><span aria-hidden="true">{moving ? 'Ⅱ' : '▷'}</span><span>Background motion</span></button>
  </></Localize>
}
