import { useEffect, useRef } from 'react'
import { usePreferences } from './preferences-context'
import Localize from './Localize'

export default function AccessibilityControls() {
  const { preferences, update, reset } = usePreferences()
  const disclosure = useRef<HTMLDetailsElement>(null)
  const french = preferences.language === 'fr'
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (disclosure.current && !disclosure.current.contains(event.target as Node)) disclosure.current.open = false }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [])
  const switches = [
    ['highContrast', 'High contrast'], ['reduceMotion', 'Reduce all motion'], ['spacing', 'More text spacing'], ['underlineLinks', 'Underline links'], ['simpleMap', 'Simple mind-map layout'],
  ] as const
  return <Localize>
    <button className="language-switch" lang={french ? 'en-CA' : 'fr-CA'} aria-label={french ? 'Switch to English' : 'Passer au français canadien'} onClick={() => update({ language: french ? 'en' : 'fr' })}><span className="language-symbol" key={preferences.language}>{french ? 'EN' : 'FR'}</span></button>
    <details ref={disclosure} className="accessibility-disclosure" onKeyDown={event => { if (event.key === 'Escape' && disclosure.current) { disclosure.current.open = false; disclosure.current.querySelector('summary')?.focus(); event.stopPropagation() } }}>
      <summary aria-label="Accessibility and reading preferences" aria-controls="accessibility-panel"><svg className="settings-gear" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M18.929 9.130L19.244 10.059L21.877 10.436L21.877 13.564L19.244 13.941L18.929 14.870L18.929 14.870L18.495 15.750L20.090 17.878L17.878 20.090L15.750 18.495L14.870 18.929L14.870 18.929L13.941 19.244L13.564 21.877L10.436 21.877L10.059 19.244L9.130 18.929L9.130 18.929L8.250 18.495L6.122 20.090L3.910 17.878L5.505 15.750L5.071 14.870L5.071 14.870L4.756 13.941L2.123 13.564L2.123 10.436L4.756 10.059L5.071 9.130L5.071 9.130L5.505 8.250L3.910 6.122L6.122 3.910L8.250 5.505L9.130 5.071L9.130 5.071L10.059 4.756L10.436 2.123L13.564 2.123L13.941 4.756L14.870 5.071L14.870 5.071L15.750 5.505L17.878 3.910L20.090 6.122L18.495 8.250L18.929 9.130Z M16.2 12a4.2 4.2 0 1 0-8.4 0a4.2 4.2 0 1 0 8.4 0Z" fill="currentColor" fillRule="evenodd" stroke="currentColor" strokeWidth="0.35" strokeLinejoin="round" /></svg><span className="sr-only">Reading preferences</span></summary>
      <div className="accessibility-panel" id="accessibility-panel"><div className="accessibility-scroll"><h2>Reading preferences</h2><p>Choose what makes this portfolio easier to use. Your preferences are saved on this device.</p><fieldset><legend>Text size</legend><div className="text-size-options">{[[100, 'Default'], [115, 'Comfortable'], [130, 'Large'], [150, 'Larger'], [200, 'Maximum']].map(([size, label]) => <label className="text-size-choice" key={size}><input type="radio" name="text-size" value={size} checked={preferences.textScale === size} onChange={() => update({ textScale: Number(size) })} /><span className="text-size-tile"><strong>{size}%</strong><span>{label}</span></span></label>)}</div></fieldset><fieldset><legend>Display and motion</legend>{switches.map(([key, label]) => <label key={key}><span>{label}</span><span className="preference-toggle"><input type="checkbox" role="switch" checked={preferences[key]} onChange={event => update({ [key]: event.target.checked })} /><span className="preference-track" aria-hidden="true" /></span></label>)}</fieldset><p className="accessibility-note">Keyboard: Tab to move, Enter or Space to activate, Escape to close. Browser zoom remains available. System reduced-motion preferences are respected.</p><button className="reset-preferences" onClick={() => { if (disclosure.current) disclosure.current.open = false; window.dispatchEvent(new Event('portfolio-tour-start')) }}>{french ? 'Relancer la visite guidée' : 'Replay quick tour'}</button><button className="reset-preferences" onClick={reset}>Reset reading preferences</button></div></div>
    </details>
  </Localize>
}

