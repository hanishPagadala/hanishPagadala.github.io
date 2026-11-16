import { useCallback, useEffect, useRef, useState } from 'react'
import { usePreferences } from './preferences-context'
import './GuidedTour.css'

const steps = [
  ['.wordmark', 'Your starting point', 'This is Hanish’s engineering portfolio. The hp. logo always takes you back to the introduction.', 'Votre point de départ', 'Voici le portfolio de génie de Hanish. Le logo hp. vous ramène toujours à la présentation.'],
  ['.site-header', 'Find your way', 'Jump to Projects, Experience, About, or Let’s connect. On a smaller screen, open Menu to find these links.', 'Explorez le portfolio', 'Accédez aux projets, à l’expérience, à la présentation ou au contact. Sur petit écran, ces liens se trouvent dans Menu.'],
  ['.hero-actions', 'Explore or read the résumé', 'Explore my work takes you to the projects. View résumé opens a clean, printable résumé in a new tab.', 'Projets ou curriculum vitæ', 'Explorez mon travail mène aux projets. Le curriculum vitæ s’ouvre dans un nouvel onglet, prêt à imprimer.'],
  ['.featured-projects .project-inline summary', 'Go a little deeper', 'Contributions & details expands inside each project. Read about my role, the engineering approach, and the outcome without leaving the page.', 'Découvrez les détails', 'Contributions et détails se déplie dans chaque projet. Découvrez mon rôle, la démarche et les résultats sans quitter la page.'],
  ['.project-archive .filters', 'Browse your interests', 'All additional projects are shown by default. Use these filters to focus on a discipline; the ongoing builds sit just above.', 'Suivez vos intérêts', 'Tous les projets supplémentaires sont affichés par défaut. Filtrez par discipline; les projets en cours se trouvent juste au-dessus.'],
  ['.header-actions', 'Make yourself comfortable', 'From left to right: switch theme, change English or French, and open reading preferences. Adjust text size, contrast, motion, spacing, and more. You can replay this tour there too.', 'Adaptez votre lecture', 'De gauche à droite : thème, langue et préférences de lecture. Réglez la taille du texte, le contraste, les animations et l’espacement. Vous pouvez aussi y relancer cette visite.'],
  ['.story-link', 'A different view of the journey', 'Visualize opens an interactive mind map: explore project disciplines, experience, and hobbies around Hanish. Hover for summaries or select a branch to explore.', 'Un autre regard sur le parcours', 'Visualiser ouvre une carte interactive des projets, de l’expérience et des passions de Hanish. Survolez pour un résumé ou sélectionnez une branche pour explorer.'],
  ['.email-row', 'Start a conversation', 'Click the email address to write, or Copy email to save it to your clipboard. GitHub and LinkedIn are just below. Thanks for exploring!', 'Entamons la conversation', 'Cliquez sur l’adresse pour écrire ou copiez-la dans le presse-papiers. GitHub et LinkedIn sont juste en dessous. Merci de votre visite !'],
]
const storageKey = 'hp-tour-v1'
export default function GuidedTour() {
  const { preferences } = usePreferences()
  const fr = preferences.language === 'fr'
  const say = (en: string, french: string) => fr ? french : en
  const [invite, setInvite] = useState(false)
  const [step, setStep] = useState<number | null>(null)
  const [rect, setRect] = useState({ x: 12, y: 12, width: 0, height: 0 })
  const dialog = useRef<HTMLDialogElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const origin = useRef({ hash: '', scroll: 0, focus: null as HTMLElement | null })
  const remember = () => { try { localStorage.setItem(storageKey, 'seen') } catch { /* Storage may be unavailable. */ } }
  const start = useCallback(() => {
    origin.current = { hash: location.hash, scroll: window.scrollY, focus: document.activeElement as HTMLElement }
    setInvite(false); remember()
    if (location.hash === '#visualize') location.hash = '#home'
    setStep(0)
  }, [])
  const finish = () => {
    setStep(null); dialog.current?.close(); remember()
    if (location.hash !== origin.current.hash) location.hash = origin.current.hash
    requestAnimationFrame(() => requestAnimationFrame(() => {
      window.scrollTo({ top: origin.current.scroll, behavior: 'instant' })
      const previous = origin.current.focus
      const fallback = document.querySelector<HTMLElement>('.accessibility-disclosure > summary')
      ;(previous?.getClientRects().length ? previous : fallback)?.focus({ preventScroll: true })
    }))
  }
  useEffect(() => {
    let seen = false
    try { seen = !!localStorage.getItem(storageKey) } catch { /* Offer without persistence. */ }
    const timer = window.setTimeout(() => { if (!seen) setInvite(true) }, 7000)
    const replay = () => start()
    window.addEventListener('portfolio-tour-start', replay)
    return () => { clearTimeout(timer); window.removeEventListener('portfolio-tour-start', replay) }
  }, [start])
  useEffect(() => {
    if (step === null) return
    if (!dialog.current?.open) dialog.current?.showModal()
    card.current?.focus({ preventScroll: true })
    let frame = 0
    let target: Element | null = null
    let attempts = 0
    const measure = () => {
      const bounds = target?.getBoundingClientRect()
      if (bounds) {
        const x = Math.max(8, bounds.left - 8), y = Math.max(8, bounds.top - 8)
        setRect({ x, y, width: Math.max(0, Math.min(innerWidth - 8, bounds.right + 8) - x), height: Math.max(0, Math.min(innerHeight - 8, bounds.bottom + 8) - y) })
      }
    }
    const find = () => {
      target = document.querySelector(steps[step][0])
      if (!target && attempts++ < 30) { frame = requestAnimationFrame(find); return }
      target ??= document.querySelector('.site-header')
      const reduced = preferences.reduceMotion || matchMedia('(prefers-reduced-motion: reduce)').matches
      target?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'center' })
      measure()
    }
    find()
    window.addEventListener('scroll', measure, true); window.addEventListener('resize', measure)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', measure, true); window.removeEventListener('resize', measure) }
  }, [step, preferences.reduceMotion])
  const current = step === null ? null : steps[step]
  const below = rect.y + rect.height + 20
  const viewportHeight = typeof window === 'undefined' ? 800 : window.innerHeight
  const viewportWidth = typeof window === 'undefined' ? 1200 : window.innerWidth
  const roomBelow = viewportHeight - below
  const position = roomBelow > 260 ? { top: below } : rect.y > 300 ? { bottom: viewportHeight - rect.y + 20 } : { bottom: 16 }
  return <>
    {invite && <aside className="tour-invite" aria-label={say('Quick tour invitation', 'Invitation à une visite guidée')}><p role="status">{say('A quick look around?', 'Une petite visite ?')}</p><span>{say('Discover the projects, mind map, and reading controls in a short guided tour.', 'Découvrez les projets, la carte et les préférences de lecture grâce à une courte visite guidée.')}</span><div><button className="tour-primary" onClick={start}>{say('Start tour', 'Commencer')}</button><button onClick={() => { setInvite(false); remember() }}>{say('Not now', 'Pas maintenant')}</button></div></aside>}
    <dialog ref={dialog} className="tour-dialog" aria-labelledby="tour-heading" aria-describedby="tour-description" onCancel={event => { event.preventDefault(); finish() }}>
      {current && <><svg className="tour-shade" width="100%" height="100%" aria-hidden="true"><defs><mask id="tour-cutout"><rect width="100%" height="100%" fill="white" /><rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} rx="14" fill="black" /></mask></defs><rect width="100%" height="100%" fill="rgba(9,15,30,.7)" mask="url(#tour-cutout)" /><rect className="tour-outline" x={rect.x} y={rect.y} width={rect.width} height={rect.height} rx="14" /></svg><div ref={card} className="tour-card" tabIndex={-1} style={{ ...position, left: Math.max(16, Math.min(rect.x, viewportWidth - 436)) }}><div className="tour-meta"><span>{(step ?? 0) + 1} / {steps.length}</span><button onClick={finish}>{say('Skip tour', 'Quitter la visite')} ×</button></div><h2 id="tour-heading">{current[fr ? 3 : 1]}</h2><p id="tour-description">{current[fr ? 4 : 2]}</p><div className="tour-buttons"><button disabled={step === 0} onClick={() => setStep(value => (value ?? 1) - 1)}>{say('Back', 'Retour')}</button><button className="tour-primary" onClick={() => step === steps.length - 1 ? finish() : setStep(value => (value ?? 0) + 1)}>{step === steps.length - 1 ? say('Finish', 'Terminer') : say('Next', 'Suivant')} →</button></div></div></>}
    </dialog>
  </>
}

