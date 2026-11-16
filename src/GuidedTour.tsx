import { useCallback, useEffect, useRef, useState } from 'react'
import { usePreferences } from './preferences-context'
import './GuidedTour.css'

const steps = [
  ['.wordmark', 'Your starting point', 'This is Hanish’s engineering portfolio. The hp. logo always takes you back to the introduction.', 'Votre point de départ', 'Voici le portfolio de génie de Hanish. Le logo hp. vous ramène toujours à la présentation.'],
  ['.nav', 'Find your way', 'Jump to Projects, Experience, About, or Let’s connect. On a smaller screen, open Menu to find these links.', 'Explorez le portfolio', 'Accédez aux projets, à l’expérience, à la présentation ou au contact. Sur petit écran, ces liens se trouvent dans Menu.'],
  ['.header-actions', 'Make yourself comfortable', 'From left to right: switch theme, change English or French, and open reading preferences. Adjust text size, contrast, motion, spacing, and more. You can replay this tour there too.', 'Adaptez votre lecture', 'De gauche à droite : thème, langue et préférences de lecture. Réglez la taille du texte, le contraste, les animations et l’espacement. Vous pouvez aussi y relancer cette visite.'],
  ['.hero-actions', 'Explore or read the résumé', 'Explore my work takes you to the projects. View résumé opens a clean, printable résumé in a new tab.', 'Projets ou curriculum vitæ', 'Explorez mon travail mène aux projets. Le curriculum vitæ s’ouvre dans un nouvel onglet, prêt à imprimer.'],
  ['.featured-projects .project-inline summary', 'Go a little deeper', 'Contributions & details expands inside each project. Read about my role, the engineering approach, and the outcome without leaving the page.', 'Découvrez les détails', 'Contributions et détails se déplie dans chaque projet. Découvrez mon rôle, la démarche et les résultats sans quitter la page.'],
  ['.project-archive .filters', 'Browse your interests', 'All additional projects are shown by default. Use these filters to focus on a discipline; the ongoing builds sit just above.', 'Suivez vos intérêts', 'Tous les projets supplémentaires sont affichés par défaut. Filtrez par discipline; les projets en cours se trouvent juste au-dessus.'],
  ['.story-link', 'A different view of the journey', 'Visualize opens an interactive mind map: explore project disciplines, experience, and hobbies around Hanish. Hover for summaries or select a branch to explore.', 'Un autre regard sur le parcours', 'Visualiser ouvre une carte interactive des projets, de l’expérience et des passions de Hanish. Survolez pour un résumé ou sélectionnez une branche pour explorer.'],
  ['.email-row', 'Start a conversation', 'Click the email address to write, or Copy email to save it to your clipboard. GitHub and LinkedIn are just below. Thanks for exploring!', 'Entamons la conversation', 'Cliquez sur l’adresse pour écrire ou copiez-la dans le presse-papiers. GitHub et LinkedIn sont juste en dessous. Merci de votre visite !'],
]
const storageKey = 'hp-tour-v1'
export default function GuidedTour() {
  const { preferences } = usePreferences()
  const fr = preferences.language === 'fr'
  const say = (en: string, french: string) => fr ? french : en
  const [phase, setPhase] = useState<'travel' | 'ready' | 'leaving'>('travel')
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [invite, setInvite] = useState(false)
  const [step, setStep] = useState<number | null>(null)
  const [rect, setRect] = useState({ x: 12, y: 12, width: 0, height: 0 })
  const displayedRect = useRef(rect)
  const dialog = useRef<HTMLDialogElement>(null)
  const card = useRef<HTMLDivElement>(null)
  const origin = useRef({ hash: '', scroll: 0, focus: null as HTMLElement | null })
  const remember = () => { try { localStorage.setItem(storageKey, 'seen') } catch { /* Storage may be unavailable. */ } }
  const start = useCallback(() => {
    origin.current = { hash: location.hash, scroll: window.scrollY, focus: document.activeElement as HTMLElement }
    setInvite(false); remember()
    if (location.hash === '#visualize') location.hash = '#home'
    setPhase('travel'); setStep(0)
  }, [])
  const reducedMotion = () => preferences.reduceMotion || matchMedia('(prefers-reduced-motion: reduce)').matches
  const changeStep = (next: number) => {
    if (phase !== 'ready') return
    setPhase('travel')
    clearTimeout(transitionTimer.current)
    transitionTimer.current = setTimeout(() => setStep(next), reducedMotion() ? 0 : 240)
  }
  const finish = () => {
    setPhase('leaving')
    clearTimeout(transitionTimer.current)
    transitionTimer.current = setTimeout(() => closeTour(), reducedMotion() ? 0 : 380)
  }
  const closeTour = () => {
    setStep(null); dialog.current?.close(); remember()
    if (location.hash !== origin.current.hash) {
      if (origin.current.hash === '#visualize') location.hash = origin.current.hash
      else history.replaceState(null, '', location.pathname + location.search + origin.current.hash)
    }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      window.scrollTo({ top: origin.current.scroll, behavior: reducedMotion() ? 'instant' : 'smooth' })
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
    let scrollFrame = 0
    let readyTimer: ReturnType<typeof setTimeout> | undefined
    let target: Element | null = null
    let attempts = 0
    let travelling = false
    const updateRect = (next: typeof rect) => { displayedRect.current = next; setRect(next) }
    // Measure visible controls, rather than the empty space in their flex rows.
    const targetBounds = () => {
      if (!target) return undefined
      const grouped = target.matches('.nav, .hero-actions, .filters, .email-row, .header-actions')
      const controls = grouped ? [...target.querySelectorAll<HTMLElement>('a, button, summary')].filter(item => item.getClientRects().length && !item.closest('.accessibility-panel') && !item.closest('details:not([open]) > :not(summary)') && getComputedStyle(item).display !== 'none' && getComputedStyle(item).visibility !== 'hidden') : []
      const bounds = controls.map(item => item.getBoundingClientRect())
      if (!bounds.length) return target.getBoundingClientRect()
      const left = Math.min(...bounds.map(item => item.left)), top = Math.min(...bounds.map(item => item.top))
      const right = Math.max(...bounds.map(item => item.right)), bottom = Math.max(...bounds.map(item => item.bottom))
      return { left, top, right, bottom, width: right - left, height: bottom - top }
    }
    const measure = () => {
      if (travelling) return
      const bounds = targetBounds()
      if (bounds) {
        const x = Math.max(8, bounds.left - 8), y = Math.max(8, bounds.top - 8)
        updateRect({ x, y, width: Math.max(0, Math.min(innerWidth - 8, bounds.right + 8) - x), height: Math.max(0, Math.min(innerHeight - 8, bounds.bottom + 8) - y) })
      }
    }
    const find = () => {
      target = document.querySelector(steps[step][0])
      if (!target && attempts++ < 30) { frame = requestAnimationFrame(find); return }
      if (!target?.getClientRects().length) target = document.querySelector('.menu-button')
      target ??= document.querySelector('.wordmark')
      const reduced = preferences.reduceMotion || matchMedia('(prefers-reduced-motion: reduce)').matches
      const bounds = targetBounds()
      const from = window.scrollY
      const stickyHeader = target?.closest('.site-header')
      const destination = stickyHeader ? from : Math.max(0, Math.min(document.documentElement.scrollHeight - innerHeight, from + (bounds?.top ?? 0) - (innerHeight - (bounds?.height ?? 0)) / 2))
      const distance = destination - from
      const duration = reduced ? 0 : Math.min(1600, 850 + Math.abs(distance) * .12)
      const startRect = displayedRect.current
      const finalTop = (bounds?.top ?? 8) - (stickyHeader ? 0 : distance)
      const x = Math.max(8, (bounds?.left ?? 16) - 8)
      const y = Math.max(8, finalTop - 8)
      const endRect = { x, y, width: Math.max(0, Math.min(innerWidth - 8, (bounds?.right ?? 16) + 8) - x), height: Math.max(0, Math.min(innerHeight - 8, finalTop + (bounds?.height ?? 0) + 8) - y) }
      travelling = true
      const started = performance.now()
      const animate = (now: number) => {
        const progress = duration ? Math.min(1, (now - started) / duration) : 1
        const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
        window.scrollTo({ top: from + distance * eased, behavior: 'instant' })
        updateRect({ x: startRect.x + (endRect.x - startRect.x) * eased, y: startRect.y + (endRect.y - startRect.y) * eased, width: startRect.width + (endRect.width - startRect.width) * eased, height: startRect.height + (endRect.height - startRect.height) * eased })
        if (progress < 1) scrollFrame = requestAnimationFrame(animate)
        else readyTimer = setTimeout(() => { travelling = false; measure(); setPhase('ready'); card.current?.focus({ preventScroll: true }) }, reduced ? 0 : 180)
      }
      scrollFrame = requestAnimationFrame(animate)
    }
    find()
    window.addEventListener('scroll', measure, true); window.addEventListener('resize', measure)
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(scrollFrame); clearTimeout(readyTimer); window.removeEventListener('scroll', measure, true); window.removeEventListener('resize', measure) }
  }, [step, preferences.reduceMotion])
  useEffect(() => () => clearTimeout(transitionTimer.current), [])
  const current = step === null ? null : steps[step]
  const below = rect.y + rect.height + 20
  const viewportHeight = typeof window === 'undefined' ? 800 : window.innerHeight
  const viewportWidth = typeof window === 'undefined' ? 1200 : window.innerWidth
  const roomBelow = viewportHeight - below
  const position = roomBelow > 260 ? { top: below } : rect.y > 300 ? { bottom: viewportHeight - rect.y + 20 } : { bottom: 16 }
  return <>
    {invite && <aside className="tour-invite" aria-label={say('Quick tour invitation', 'Invitation à une visite guidée')}><p role="status">{say('A quick look around?', 'Une petite visite ?')}</p><span>{say('Discover the projects, mind map, and reading controls in a short guided tour.', 'Découvrez les projets, la carte et les préférences de lecture grâce à une courte visite guidée.')}</span><div><button className="tour-primary" onClick={start}>{say('Start tour', 'Commencer')}</button><button onClick={() => { setInvite(false); remember() }}>{say('Not now', 'Pas maintenant')}</button></div></aside>}
    <dialog ref={dialog} className="tour-dialog" data-phase={phase} aria-labelledby="tour-heading" aria-describedby="tour-description" onCancel={event => { event.preventDefault(); finish() }}>
      {current && <><svg className="tour-shade" width="100%" height="100%" aria-hidden="true"><defs><mask id="tour-cutout"><rect width="100%" height="100%" fill="white" /><rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} rx="14" fill="black" /></mask></defs><rect width="100%" height="100%" fill="rgba(9,15,30,.7)" mask="url(#tour-cutout)" /><rect className="tour-outline" x={rect.x} y={rect.y} width={rect.width} height={rect.height} rx="14" /></svg><div ref={card} className="tour-card" tabIndex={-1} style={{ ...position, left: Math.max(16, Math.min(rect.x, viewportWidth - 436)) }}><div className="tour-meta"><span>{(step ?? 0) + 1} / {steps.length}</span><button onClick={finish}>{say('Skip tour', 'Quitter la visite')} ×</button></div><h2 id="tour-heading">{current[fr ? 3 : 1]}</h2><p id="tour-description">{current[fr ? 4 : 2]}</p><div className="tour-progress" aria-hidden="true"><span style={{ width: `${((step ?? 0) + 1) / steps.length * 100}%` }} /></div><div className="tour-buttons"><button disabled={step === 0 || phase !== 'ready'} onClick={() => changeStep((step ?? 1) - 1)}>{say('Back', 'Retour')}</button><button className="tour-primary" disabled={phase !== 'ready'} onClick={() => step === steps.length - 1 ? finish() : changeStep((step ?? 0) + 1)}>{step === steps.length - 1 ? say('Finish', 'Terminer') : say('Next', 'Suivant')} →</button></div></div></>}
    </dialog>
  </>
}

