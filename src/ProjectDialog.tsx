import { useEffect, useRef } from 'react'
import type { Project } from './projects'

export default function ProjectDialog({ project }: { project: Project }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const previousOverflow = useRef('')
  const closing = useRef(false)
  useEffect(() => {
    const element = dialog.current
    return () => { if (element?.open) document.body.style.overflow = previousOverflow.current }
  }, [])
  function open() {
    if (!dialog.current || dialog.current.open) return
    previousOverflow.current = document.body.style.overflow
    dialog.current.showModal()
    document.body.style.overflow = 'hidden'
  }
  async function close() {
    const element = dialog.current
    if (!element?.open || closing.current) return
    closing.current = true
    try {
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches && element.animate) {
        await element.animate([{ opacity: 1, translate: '0 0' }, { opacity: 0, translate: '0 12px' }], { duration: 180, easing: 'ease-in' }).finished
      }
    } catch { /* A cancelled animation must still release the dialog. */ }
    element.close()
    closing.current = false
  }
  return <>
    <button className="project-open" aria-haspopup="dialog" aria-controls={`project-dialog-${project.id}`} onClick={open}>Contributions & details <span aria-hidden="true">↗</span></button>
    <dialog ref={dialog} id={`project-dialog-${project.id}`} className="project-dialog" aria-labelledby={`project-title-${project.id}`} onCancel={event => { event.preventDefault(); void close() }} onClose={() => { document.body.style.overflow = previousOverflow.current }} onClick={event => { if (event.target === event.currentTarget) void close() }}>
      <div className="project-dialog-panel"><div className="project-dialog-top"><span className="eyebrow">PROJECT / {project.id}</span><button className="dialog-close" aria-label="Close project details" onClick={() => void close()} autoFocus>Close <span aria-hidden="true">×</span></button></div>
        <p className="dialog-status">{project.status}</p><h2 id={`project-title-${project.id}`}>{project.title}</h2><p className="dialog-context">{project.context}</p><p className="dialog-intro">{project.description}</p><ul className="tags" aria-label="Project technologies">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
        <div className="dialog-contributions"><h3>Contributions & details</h3><ul>{project.contributions.map((item, index) => <li key={item} style={{ '--item-index': index } as React.CSSProperties}>{item}</li>)}</ul></div>
        <div className="dialog-footer"><span>Hanish Pagadala · {project.category}</span><button onClick={() => void close()}>Back to projects <span aria-hidden="true">↙</span></button></div>
      </div>
    </dialog>
  </>
}
