import { useEffect, useState } from 'react'
import Drawing from './Drawing'
import MindMap from './MindMap'
import { categories, projects } from './projects'
import type { Category, Project } from './projects'
import './App.css'
import './Readability.css'

const email = 's_pagad@live.concordia.ca'
const github = 'https://github.com/hanishPagadala/'
const linkedin = 'https://www.linkedin.com/in/sai-hanish-pagadala-a21599379/'
function Arrow() { return <span aria-hidden="true">↗</span> }

function ProjectCard({ project }: { project: Project }) {
  return <article className={`project-card project-${project.id}`}>
    {project.drawing && <div className="project-art"><div className="project-art-label"><span>{project.category.toUpperCase()}</span><span>PROJECT / {project.id}</span></div><Drawing kind={project.drawing} /><span className="illustration-label">CONCEPT ILLUSTRATION</span></div>}
    <div className="project-body">
      <div className="project-meta"><span className={project.ongoing ? 'project-status ongoing' : 'project-status'}>{project.ongoing && <span className="status-dot" />}{project.status}</span><span className="project-number">{project.id}</span></div>
      <h3>{project.title}</h3><p className="project-context">{project.context}</p><p>{project.description}</p>
      <ul className="tags" aria-label="Project technologies">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
      <details><summary>Contributions & details <span aria-hidden="true">+</span></summary><div className="project-details"><ul>{project.contributions.map(item => <li key={item}>{item}</li>)}</ul></div></details>
    </div>
  </article>
}

function App() {
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('hp-theme') === 'dark' ? 'dark' : 'light' } catch { return 'light' } })
  const [menu, setMenu] = useState(false)
  const [visualize, setVisualize] = useState(() => typeof window !== 'undefined' && window.location.hash === '#visualize')
  useEffect(() => {
    const navigate = () => setVisualize(window.location.hash === '#visualize')
    window.addEventListener('hashchange', navigate)
    return () => window.removeEventListener('hashchange', navigate)
  }, [])
  useEffect(() => {
    if (visualize || !window.location.hash) return
    const frame = requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView())
    return () => cancelAnimationFrame(frame)
  }, [visualize])
  const [category, setCategory] = useState<Category>('All projects')
  const [ongoingOnly, setOngoingOnly] = useState(false)
  const [angle, setAngle] = useState(26)
  const [copied, setCopied] = useState(false)
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('hp-theme', theme) } catch { /* Theme works without storage. */ } }, [theme])
  useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopied(false), 2500)
    return () => window.clearTimeout(timeout)
  }, [copied])
  const filtered = projects.filter(project => (category === 'All projects' || project.category === category) && (!ongoingOnly || project.ongoing))
  async function copyEmail() {
    try { await navigator.clipboard.writeText(email); setCopied(true) } catch { window.location.href = `mailto:${email}` }
  }
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="shell header-inner">
      <a href="#home" className="wordmark" aria-label="Hanish Pagadala home">h<span>p</span><i>.</i></a>
      <nav id="mobile-navigation" aria-label="Main navigation" className={menu ? 'nav open' : 'nav'}>{[['Projects', '#projects'], ['Experience', '#experience'], ['About', '#about'], ['Visualize', '#visualize']].map(([label, href]) => <a key={href} href={href} aria-current={visualize && href === '#visualize' ? 'page' : undefined} onClick={() => setMenu(false)}>{label}</a>)}<a href="#contact" className="nav-contact" onClick={() => setMenu(false)}>Let’s connect <Arrow /></a></nav>
      <div className="header-actions"><button className="theme-button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? '☾' : '☀'}</button><button className="menu-button" aria-label="Toggle navigation" aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => setMenu(!menu)}>{menu ? 'Close' : 'Menu'}</button></div>
    </div></header>
    <main id="main">{visualize ? <MindMap /> : <>
      <section className="hero shell" id="home"><div className="hero-copy"><p className="eyebrow"><span className="status-dot" /> COMPUTER ENGINEERING · CONCORDIA UNIVERSITY</p><h1>Ideas take shape.<br />Engineering makes<br /><em>them work.</em></h1><p className="intro">I’m Hanish Pagadala. I build across code, circuits, and physical systems—from autonomous robots and avionics to connected software and data-driven tools.</p><div className="hero-actions"><a className="button primary" href="#projects">Explore my work <span aria-hidden="true">↓</span></a><a className="text-link" href="./resume.html" target="_blank" rel="noreferrer">View résumé <Arrow /></a></div><div className="hero-footnote"><span>HARDWARE × SOFTWARE</span><span>DIRECTOR OF PROJECTS / IEEE CONCORDIA</span></div></div>
        <div className="hero-visual"><div className="visual-top"><span><span className="status-dot" /> DESIGN EXPLORER</span><span>FIG. 001</span></div><Drawing kind="wing" angle={angle} /><div className="visual-caption"><div><span className="eyebrow">OBLIQUE WING CONCEPT · IN DEVELOPMENT</span><p>A different angle on flight.</p></div><span className="angle-value">{angle}°</span></div><label className="sweep-control"><span>Explore wing sweep <span aria-hidden="true">↔</span></span><input type="range" min="0" max="45" value={angle} onChange={event => setAngle(Number(event.target.value))} aria-label="Illustrative wing sweep angle" /><span>0° — 45°</span></label><p className="visual-note">Interactive concept illustration · not a flight simulation</p></div>
      </section>
      <div className="discipline-strip"><div className="shell"><span>EMBEDDED & ROBOTICS</span><i>+</i><span>AEROSPACE & PHOTONICS</span><i>+</i><span>SOFTWARE & DATA</span></div></div>
      <section className="section shell" id="projects"><div className="section-heading"><div><p className="eyebrow">01 / PROJECT EXPLORER</p><h2>Different systems.<br />The same curiosity.</h2></div><p>Academic builds, competition prototypes,<br />personal experiments, and work in progress.</p></div>
        <div className="project-overview"><span><strong>{projects.length}</strong> projects & explorations</span><span><strong>04</strong> disciplines</span><span><strong>{projects.filter(p => p.ongoing).length.toString().padStart(2, '0')}</strong> ongoing projects</span></div>
        <div className="filters" role="group" aria-label="Filter projects by discipline">{categories.map(item => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}<span>{item === 'All projects' ? projects.length : projects.filter(p => p.category === item).length}</span></button>)}</div>
        <div className="filter-bottom"><label className="ongoing-filter"><input type="checkbox" checked={ongoingOnly} onChange={event => setOngoingOnly(event.target.checked)} /> Work in progress only</label><p role="status">{filtered.length} {filtered.length === 1 ? 'project' : 'projects'} shown</p></div>
        <div className="project-groups">{categories.filter(group => group !== 'All projects').map(group => { const items = filtered.filter(p => p.category === group); return items.length ? <section className="project-group" key={group} aria-label={`${group} projects`}><div className="group-heading"><h3>{group}</h3><span>{items.length.toString().padStart(2, '0')} / PROJECTS</span></div><div className="projects-grid">{items.map(project => <ProjectCard project={project} key={project.id} />)}</div></section> : null })}</div>
        {!filtered.length && <div className="empty-projects"><h3>No ongoing projects in this discipline.</h3><p>Explore the past work here, or browse all current projects.</p><button className="button primary" onClick={() => { setCategory('All projects'); setOngoingOnly(false) }}>Show all projects</button></div>}
      </section>

      <section className="experience-section" id="experience"><div className="section shell"><div className="section-heading"><div><p className="eyebrow">02 / EXPERIENCE</p><h2>Engineering, with people.</h2></div><p>Building systems also means connecting teams,<br />understanding workflows, and keeping work moving.</p></div>
        <div className="experience-row"><span className="experience-index">01</span><div><p className="eyebrow">ENGINEERING LEADERSHIP</p><h3>IEEE Concordia</h3><p>Director of Projects</p><span className="subtle">June 2026–present</span></div><div className="experience-description"><p>Coordinate multidisciplinary projects across embedded, electrical, mechanical, and software teams. Maintain roadmaps, technical checkpoints, and documentation, and support design reviews and integration troubleshooting.</p></div></div>
        <div className="experience-row"><span className="experience-index">02</span><div><p className="eyebrow">PROFESSIONAL EXPERIENCE</p><h3>CMHC</h3><p>Analyst internship</p><span className="subtle">Fall 2026 · Current placement</span></div><div className="experience-description"><p>Develop task-automation solutions, analyze operational data and workflows, and identify process improvements. Support requirements gathering, reporting, documentation, and internal issue tracking with cross-functional stakeholders.</p></div></div>
        <div className="experience-row"><span className="experience-index">03</span><div><p className="eyebrow">INDEPENDENT DEVELOPMENT</p><h3>Roblox</h3><p>Freelance Game Developer</p><span className="subtle">2019–present</span></div><div className="experience-description"><p>Contribute to full-stack game development using Luau, including gameplay systems, interfaces, backend logic, and multiplayer functionality. Coordinate development teams and communicate with external stakeholders.</p></div></div>
      </div></section>
      <section className="section shell about-grid" id="about"><div><p className="eyebrow">03 / A LITTLE ABOUT ME</p><h2>At the intersection<br />of code & circuits.</h2><div className="about-mark" aria-label="Hanish Pagadala initials"><span>HP</span><small>ALWAYS EXPLORING / ALWAYS LEARNING</small></div><div className="education-note"><p className="eyebrow">CONCORDIA UNIVERSITY</p><p>BEng · Computer Engineering</p><span className="subtle">2023–2028 expected · Co-operative Education</span></div></div>
        <div className="about-copy"><p className="large-copy">I like the moment an idea becomes something you can test.</p><p>My work spans autonomous robots, digital hardware, networking, web applications, and data tools. I enjoy understanding how the pieces fit together—then debugging the interfaces, testing assumptions, and making the next iteration better.</p><p>As Director of Projects at IEEE Concordia, I bring that same approach to multidisciplinary teams. Alongside my studies, I work on process improvement at CMHC and continue exploring avionics, reaction-wheel systems, and laser transmission.</p><div className="skills"><p className="eyebrow">TOOLS USED ACROSS MY WORK</p><div className="skill-row"><h3>Languages</h3><p>C / C++ · Python · TypeScript / JavaScript · SQL · VHDL · Luau</p></div><div className="skill-row"><h3>Hardware</h3><p>ESP32 · Arduino · FPGA · Sensors · Soldering & prototyping</p></div><div className="skill-row"><h3>Software</h3><p>React · Flask · Firebase · TCP / UDP · Multithreading</p></div><div className="skill-row"><h3>Data & vision</h3><p>Pandas · Scikit-learn · OpenCV · Selenium</p></div><div className="skill-row"><h3>Workflow</h3><p>Git · Docker · ModelSim · Vivado · Agile / Scrum</p></div></div></div>
      </section>
      <section className="shell resume-section" id="resume"><div><p className="eyebrow">THE DETAILS, IN ONE PLACE</p><h2>A concise look at my experience.</h2><p>Read a contact-safe résumé, or save a PDF from your browser’s print menu.</p></div><a className="button primary" href="./resume.html" target="_blank" rel="noreferrer">View résumé <Arrow /></a></section>
      <section className="contact-section" id="contact"><div className="shell contact-inner"><p className="eyebrow">04 / LET’S CONNECT</p><h2>Good engineering<br />starts with a <em>conversation.</em></h2><p>Let’s talk embedded systems, robotics, software, or the next interesting problem.</p><div className="email-row"><a className="email-link" href={`mailto:${email}`}>{email} <Arrow /></a><button onClick={copyEmail} aria-label="Copy email address">{copied ? 'Copied ✓' : 'Copy email'}</button><span className="sr-only" role="status">{copied ? 'Email address copied.' : ''}</span></div><div className="contact-links"><a href={github} target="_blank" rel="noreferrer">GitHub <Arrow /></a><a href={linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a></div></div></section>
    </>}</main>{!visualize && <footer className="shell footer"><a className="footer-name" href="#home">Hanish Pagadala<span>Computer Engineering</span></a><p>Thoughtfully designed. Always evolving.</p><a href="#home">Back to top ↑</a></footer>}
  </>
}
export default App
