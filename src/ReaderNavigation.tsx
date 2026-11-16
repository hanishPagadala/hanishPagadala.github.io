import { useEffect, useRef } from 'react'

const sections = [['home', 'Introduction'], ['projects', 'Projects'], ['experience', 'Experience'], ['about', 'About'], ['contact', 'Contact']]

export default function ReaderNavigation({ active, onSectionChange }: { active: string; onSectionChange: (id: string) => void }) {
  const progress = useRef<HTMLProgressElement>(null)
  useEffect(() => {
    let frame = 0
    let previous = ''
    const update = () => {
      frame = 0
      const length = document.documentElement.scrollHeight - window.innerHeight
      if (progress.current) progress.current.value = length > 0 ? Math.min(1, Math.max(0, window.scrollY / length)) : 1
      let current = 'home'
      sections.forEach(([id]) => { const element = document.getElementById(id); if (element && element.getBoundingClientRect().top <= window.innerHeight * .36) current = id })
      if (previous !== current) { previous = current; onSectionChange(current) }
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [onSectionChange])
  return <>
    <progress className="reading-progress" ref={progress} max="1" value="0" aria-label="Page reading progress" />
    <nav className="reading-rail" aria-label="Section navigation">{sections.map(([id, label], index) => <a href={`#${id}`} aria-label={label} aria-current={active === id ? 'location' : undefined} key={id}><span className="rail-label">{label}</span><span className="rail-dot" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span></a>)}</nav>
  </>
}
