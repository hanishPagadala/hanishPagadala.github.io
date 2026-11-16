import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { projects } from './projects'
import './MindMap.css'

type Entry = { id: string; title: string; summary: string; detail: string[]; status?: string }
type Branch = { id: string; title: string; short: string; symbol: string; color: string; summary: string; entries: Entry[] }
const projectEntries = (category: string): Entry[] => projects.filter(p => p.category === category).map(p => ({ id: p.id, title: p.title, summary: p.description, detail: p.contributions, status: p.status }))
const branches: Branch[] = [
  { id: 'embedded', title: 'Embedded & robotics', short: 'Code → motion', symbol: '⌘', color: 'var(--map-teal)', summary: 'Making software work in the physical world through sensors, digital logic, autonomous navigation, and control.', entries: projectEntries('Embedded & robotics') },
  { id: 'aerospace', title: 'Aerospace & photonics', short: 'Flight & light', symbol: '↗', color: 'var(--map-blue)', summary: 'Exploring avionics and optical communication through the oblique-wing drone and laser transmission. Both are work in progress.', entries: projectEntries('Aerospace & photonics') },
  { id: 'software', title: 'Software & games', short: 'Ideas → experiences', symbol: '{ }', color: 'var(--map-violet)', summary: 'Building connected software, useful applications, and playful experiences—from concurrent servers to hackathon prototypes.', entries: projectEntries('Software & games') },
  { id: 'data', title: 'Data & automation', short: 'Patterns → processes', symbol: '∿', color: 'var(--map-amber)', summary: 'Working with data models, machine learning, and automation to understand information and simplify repetitive work.', entries: projectEntries('Data & automation') },
  { id: 'experience', title: 'Experience & growth', short: 'Building with people', symbol: '↔', color: 'var(--map-rose)', summary: 'A path from independent game development to engineering studies, multidisciplinary leadership, and professional process improvement.', entries: [
    { id: 'roblox', title: 'Roblox development', status: '2019–present', summary: 'Freelance game development, team coordination, and stakeholder collaboration.', detail: ['Develop gameplay, interfaces, backend logic, and multiplayer systems using Luau.', 'A creative starting point that also developed teamwork, delivery, and communication skills.'] },
    { id: 'concordia', title: 'Computer Engineering', status: '2023–2028 expected', summary: 'Studying Computer Engineering at Concordia University through the co-operative education program.', detail: ['Connect programming with digital hardware, networks, control systems, and databases.', 'Build practical experience through academic projects, hackathons, and multidisciplinary teams.'] },
    { id: 'ieee', title: 'IEEE Concordia', status: 'Director of Projects · June 2026–present', summary: 'Supporting multidisciplinary teams as Director of Projects.', detail: ['Coordinate roadmaps, technical checkpoints, documentation, and design reviews.', 'Help embedded, electrical, mechanical, and software teams work through integration challenges.'] },
    { id: 'cmhc', title: 'CMHC', status: 'Analyst internship · Fall 2026', summary: 'Applying automation and process analysis to professional workflows.', detail: ['Analyze operational data, document processes, and identify improvement opportunities.', 'Support automation, reporting, internal issue tracking, and cross-functional collaboration.'] },
  ] },
  { id: 'passions', title: 'Hobbies & passions', short: 'Beyond the workbench', symbol: '✳', color: 'var(--map-green)', summary: 'Space, avionics, cars, PC building, travel, cooking, food, tennis, and volleyball—the interests that sit alongside my engineering work.', entries: [
    { id: 'space', title: 'Space & avionics', summary: 'An interest in space and the electronics that make flight possible.', detail: ['Space and avionics are recurring interests in my résumés, alongside robotics and embedded systems.'] },
    { id: 'machines', title: 'Cars & PC building', summary: 'An interest in machines, components, and how systems fit together.', detail: ['Cars and PC building are personal interests that complement my curiosity about hardware and integrated systems.'] },
    { id: 'food', title: 'Cooking & food', summary: 'Curiosity extends beyond engineering to cooking and food.', detail: ['Cooking and food are personal interests listed in my résumés.'] },
    { id: 'travel', title: 'Travel', summary: 'An interest in exploring places beyond the everyday routine.', detail: ['Travelling is one of the personal interests I include alongside my technical work.'] },
    { id: 'sports', title: 'Tennis & volleyball', summary: 'Two sports I enjoy outside my engineering work.', detail: ['Tennis and volleyball are both listed among my interests.'] },
  ] },
]
const overviewPositions = [[26, 22], [74, 22], [17, 50], [83, 50], [28, 80], [72, 80]]
const leafPositions = [[24, 22], [76, 22], [18, 67], [82, 67], [50, 84]]
const initialSummary = 'I’m Hanish—a Computer Engineering student connecting code, circuits, and people. Explore the branches to see the projects, experiences, and interests that shape my work.'

export default function MindMap() {
  const [branchId, setBranchId] = useState<string | null>(null)
  const [entryId, setEntryId] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [motion, setMotion] = useState(() => typeof matchMedia === 'undefined' || !matchMedia('(prefers-reduced-motion: reduce)').matches)
  const active = branches.find(branch => branch.id === branchId)
  const entry = active?.entries.find(item => item.id === entryId)
  const nodes = active ? active.entries : branches
  const positions = active ? leafPositions : overviewPositions
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [])
  useEffect(() => {
    if (!motion || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const panel = document.getElementById('map-detail')
    const animation = panel?.animate?.([{ opacity: 0.4, translate: '0 8px' }, { opacity: 1, translate: '0 0' }], { duration: 350, easing: 'cubic-bezier(.22,1,.36,1)' })
    return () => animation?.cancel()
  }, [branchId, entryId, motion])
  function reset() { setBranchId(null); setEntryId(null); setHovered(null) }
  return <section className={`mindmap-page ${motion ? 'motion-on' : ''}`} id="visualize" aria-labelledby="mindmap-title">
    <div className="map-topbar"><div><p className="eyebrow">AN EXPLORABLE PORTRAIT</p><h1 id="mindmap-title">A few worlds. <em>One Hanish.</em></h1></div><div className="map-actions"><button onClick={() => setMotion(!motion)} aria-pressed={motion}>{motion ? 'Pause motion' : 'Enable motion'}</button><a href="#home">Back to portfolio <span aria-hidden="true">↗</span></a></div></div>
    <div className="map-breadcrumb"><button onClick={reset} aria-label="Show all mind map branches">Hanish</button>{active && <><span aria-hidden="true">/</span><button onClick={() => setEntryId(null)}>{active.title}</button></>}{entry && <><span aria-hidden="true">/</span><span>{entry.title}</span></>}</div>
    <div className="map-layout"><div className="map-stage"><div className="map-canvas" role="group" aria-label={active ? `${active.title}: select a bubble to explore` : 'Hanish at the center of six connected branches'} style={{ '--branch-color': active?.color || 'var(--accent)' } as CSSProperties}>
      <div className="map-flow" aria-hidden="true"><span /><span /></div>
      <div className="map-rings" aria-hidden="true" />
      <svg className="map-wires" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">{nodes.map((node, i) => { const [x, y] = positions[i]; const selected = entryId === node.id || hovered === node.id; return <g key={`${active?.id || 'root'}-${node.id}`} style={{ '--wire': active?.color || branches[i].color, '--wire-delay': `${i * -.7}s` } as CSSProperties}><path d={`M50 50 C50 ${y} ${x} 50 ${x} ${y}`} className={selected ? 'selected' : ''} /><path d={`M50 50 C50 ${y} ${x} 50 ${x} ${y}`} className="map-signal" /></g> })}</svg>
      <button className="map-center" onClick={reset} aria-label="Hanish: return to all branches"><span className="center-orbit" aria-hidden="true" /><strong>Hanish</strong><span>{active ? active.short : 'CODE · CIRCUITS · CURIOSITY'}</span></button>
      {nodes.map((node, i) => { const [x, y] = positions[i]; const isBranch = 'entries' in node; const selected = entryId === node.id; const showTooltip = hovered === node.id; return <div className={`map-node-position ${y > 60 ? 'lower-node' : ''}`} key={`${active?.id || 'root'}-${node.id}`} data-level={active ? 'leaf' : 'branch'} data-index={i} style={{ left: `${x}%`, top: `${y}%`, '--node-color': active?.color || (node as Branch).color, '--delay': `${i * 65}ms` } as CSSProperties}>
        <button className={`map-bubble ${selected ? 'selected' : ''} ${isBranch ? 'branch-bubble' : 'leaf-bubble'}`} aria-expanded={isBranch ? false : undefined} aria-pressed={!isBranch ? selected : undefined} aria-controls="map-detail" aria-describedby={showTooltip ? 'map-hover-summary' : undefined} onMouseEnter={() => setHovered(node.id)} onMouseLeave={() => setHovered(null)} onFocus={() => setHovered(node.id)} onBlur={() => setHovered(null)} onClick={() => { setHovered(null); if (isBranch) { setBranchId(node.id); setEntryId(null) } else setEntryId(node.id) }}>
          <span className="bubble-symbol" aria-hidden="true">{isBranch ? (node as Branch).symbol : '↗'}</span><span className="bubble-title">{node.title}</span><span className="bubble-caption">{isBranch ? `${(node as Branch).entries.length} ${node.id === 'passions' ? 'interests' : node.id === 'experience' ? 'chapters' : 'projects'}` : (node as Entry).status || 'Explore interest'}</span>
        </button>{showTooltip && <div className="map-tooltip" id="map-hover-summary" role="tooltip">{node.summary}</div>}
      </div> })}
      </div><div className="map-instructions"><p><span className="status-dot" />{active ? 'Select a satellite to read more.' : 'Hover for a summary. Select a branch to explore.'}</p>{active && <button onClick={reset}>← Back to all branches</button>}</div></div>
    <aside className="map-detail" id="map-detail" aria-live="polite" aria-atomic="true" style={{ '--detail-color': active?.color || 'var(--accent)' } as CSSProperties}>
      <p className="eyebrow">{entry ? 'A CLOSER LOOK' : active ? 'CONNECTED BY CURIOSITY' : 'MEET THE PERSON'}</p><h2>{entry?.title || active?.title || 'More than a project list.'}</h2>{entry?.status && <span className="map-detail-status">{entry.status}</span>}<p>{entry?.summary || active?.summary || initialSummary}</p>
      {entry ? <ul className="map-detail-list">{entry.detail.map(item => <li key={item}>{item}</li>)}</ul> : active ? <div className="map-entry-list">{active.entries.map(item => <button key={item.id} onClick={() => { setEntryId(item.id); setHovered(null) }}><span>{item.title}</span><span aria-hidden="true">↗</span></button>)}</div> : <div className="map-welcome"><p className="eyebrow">WHERE IT STARTED → WHERE IT’S GOING</p><p>Game development → Computer Engineering → multidisciplinary projects, leadership, and new explorations.</p><p className="eyebrow">OUTSIDE THE WORKBENCH</p><p>Space, cars, building PCs, cooking, travel, tennis, and volleyball.</p><button className="map-explore-button" onClick={() => setBranchId('experience')}>Explore my story <span aria-hidden="true">↗</span></button></div>}
      {active && <button className="map-reset" onClick={reset}>← All connections</button>}
    </aside></div>
    <div className="map-footer"><p>Every branch is part of the same curiosity. Connections represent interests and shared skills.</p><a href="mailto:s_pagad@live.concordia.ca">Start a conversation ↗</a></div>
  </section>
}
