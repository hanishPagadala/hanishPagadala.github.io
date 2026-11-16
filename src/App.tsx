import { useEffect, useState } from 'react'
import Drawing from './Drawing'
import MindMap from './MindMap'
import ReaderNavigation from './ReaderNavigation'
import { categories, projects } from './projects'
import { caseStudies, featuredIds } from './caseStudies'
import type { Category, Project } from './projects'
import './App.css'
import './Readability.css'
import './ProjectCards.css'
import './Polish.css'
import './ProjectMotion.css'
import './InlineDetails.css'
import './Editorial.css'
import './Controls.css'
import './Focus.css'
import './AlwaysVisible.css'

const email = 's_pagad@live.concordia.ca'
const github = 'https://github.com/hanishPagadala/'
const linkedin = 'https://www.linkedin.com/in/sai-hanish-pagadala-a21599379/'
function Arrow() { return <span aria-hidden="true">↗</span> }

function ProjectCard({ project }: { project: Project }) {
  const story = caseStudies[project.id]
  return <article className={`project-card project-${project.id}`} id={`project-${project.id}`}>
    <div className="project-body">
      {project.ongoing && <p className="project-status ongoing"><span className="status-dot" />Work in progress</p>}
      <h3>{project.title}</h3><p className="project-context">{project.context}</p><p>{project.description}</p>
      <ul className="tags" aria-label="Project technologies">{project.tags.slice(0, 3).map(tag => <li key={tag}>{tag}</li>)}</ul>
      <details className="project-inline"><summary>{story ? 'Read the engineering story' : 'Contributions & details'} <span aria-hidden="true">+</span></summary><div className="project-details">{story ? <><dl className="case-study"><div><dt>The problem</dt><dd>{story.problem}</dd></div><div><dt>My responsibility</dt><dd>{story.responsibility}</dd></div><div><dt>The approach</dt><dd>{story.approach}</dd></div><div><dt>The outcome</dt><dd>{story.outcome}</dd></div></dl>{story.link && <a className="evidence-link" href={story.link.href} target="_blank" rel="noreferrer">{story.link.label}<span aria-hidden="true">↗</span></a>}</> : <ul>{project.contributions.map(item => <li key={item}>{item}</li>)}</ul>}</div></details>
    </div>
  </article>
}

function App() {
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('hp-theme') === 'dark' ? 'dark' : 'light' } catch { return 'light' } })
  const [menu, setMenu] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
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
  const [angle, setAngle] = useState(26)
  const [copied, setCopied] = useState(false)
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('hp-theme', theme) } catch { /* Theme works without storage. */ } }, [theme])
  useEffect(() => {
    if (!copied) return
    const timeout = window.setTimeout(() => setCopied(false), 2500)
    return () => window.clearTimeout(timeout)
  }, [copied])
  const featured = featuredIds.map(id => projects.find(project => project.id === id)!)
  const ongoing = projects.filter(project => project.ongoing)
  const additional = projects.filter(project => !project.ongoing && !featuredIds.includes(project.id))
  const archiveCategories = categories.filter(item => item === 'All projects' || additional.some(project => project.category === item))
  const filtered = additional.filter(project => category === 'All projects' || project.category === category)
  async function copyEmail() {
    try { await navigator.clipboard.writeText(email); setCopied(true) } catch { window.location.href = `mailto:${email}` }
  }
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="shell header-inner">
      <a href="#home" className="wordmark" aria-label="Hanish Pagadala home">h<span>p</span><i>.</i></a>
      <nav id="mobile-navigation" aria-label="Main navigation" className={menu ? 'nav open' : 'nav'}>{[['Projects', '#projects'], ['Experience', '#experience'], ['About', '#about'], ['Visualize', '#visualize']].map(([label, href]) => <a key={href} href={href} aria-current={visualize && href === '#visualize' ? 'page' : !visualize && href === '#' + activeSection ? 'location' : undefined} onClick={() => setMenu(false)}>{label}</a>)}<a href="#contact" className="nav-contact" onClick={() => setMenu(false)}>Let’s connect <Arrow /></a></nav>
      <div className="header-actions"><button className="theme-button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>{theme === 'light' ? '☾' : '☀'}</button><button className="menu-button" aria-label="Toggle navigation" aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => setMenu(!menu)}>{menu ? 'Close' : 'Menu'}</button></div>
    </div></header>
    {!visualize && <ReaderNavigation onSectionChange={setActiveSection} />}
    <main id="main">{visualize ? <MindMap /> : <>
      <section className="hero shell" id="home"><div className="hero-copy"><p className="eyebrow"><span className="status-dot" /> COMPUTER ENGINEERING · CONCORDIA UNIVERSITY</p><h1>Hanish Pagadala<span className="hero-specialty">Code. Circuits. Systems.</span></h1><p className="intro">I’m a Computer Engineering student building across embedded systems, robotics, and software. I enjoy connecting the pieces—and making them work together.</p><div className="hero-actions"><a className="button primary" href="#projects">Explore my work <span aria-hidden="true">↓</span></a><a className="text-link" href="./resume.html" target="_blank" rel="noreferrer">View résumé <Arrow /></a></div><div className="hero-footnote"><span>HARDWARE × SOFTWARE</span><span>DIRECTOR OF PROJECTS / IEEE CONCORDIA</span></div></div>
        <div className="hero-visual"><div className="visual-top"><span><span className="status-dot" /> DESIGN EXPLORER</span><span>FIG. 001</span></div><Drawing kind="wing" angle={angle} /><div className="visual-caption"><div><span className="eyebrow">OBLIQUE WING CONCEPT · IN DEVELOPMENT</span><p>A different angle on flight.</p></div><span className="angle-value">{angle}°</span></div><label className="sweep-control"><span>Explore wing sweep <span aria-hidden="true">↔</span></span><input type="range" min="0" max="45" value={angle} onChange={event => setAngle(Number(event.target.value))} aria-label="Illustrative wing sweep angle" /><span>0° — 45°</span></label><p className="visual-note">Interactive concept illustration · not a flight simulation</p></div>
      </section>
      <div className="discipline-strip"><div className="shell"><span>EMBEDDED & ROBOTICS</span><i>+</i><span>AEROSPACE & PHOTONICS</span><i>+</i><span>SOFTWARE & DATA</span></div></div>
      <section className="section shell" id="projects"><div className="section-heading"><div><p className="eyebrow">01 / SELECTED WORK</p><h2>Three builds.<br />A closer look.</h2></div><p>Robotics, embedded control, and connected software.<br />Explore my role, the approach, and the outcome.</p></div>
        <div className="featured-projects" aria-label="Featured engineering projects">{featured.map(project => <ProjectCard project={project} key={project.id} />)}</div>
        <section className="ongoing-work" aria-labelledby="ongoing-heading"><div className="subsection-heading"><div><p className="eyebrow">ON THE WORKBENCH</p><h3 id="ongoing-heading">Currently building</h3></div><p>Ongoing exploration, with implementation and testing still in development.</p></div><div className="ongoing-grid">{ongoing.map(project => <ProjectCard project={project} key={project.id} />)}</div></section>
        <section className="project-archive" aria-labelledby="additional-projects-heading"><div className="archive-heading"><p className="eyebrow">MORE TO EXPLORE</p><h3 id="additional-projects-heading">More projects & experiments</h3></div><div className="archive-body"><p className="archive-intro">Academic work, hackathon prototypes, and personal demonstrations across software, hardware, and data.</p><div className="filters" role="group" aria-label="Filter additional projects">{archiveCategories.map(item => <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><p className="archive-count" role="status">{filtered.length} additional {filtered.length === 1 ? 'project' : 'projects'}</p><div className="projects-grid additional-grid" key={category}>{filtered.map(project => <ProjectCard project={project} key={project.id} />)}</div></div></section>
      </section>

      <section className="experience-section" id="experience"><div className="section shell"><div className="section-heading"><div><p className="eyebrow">02 / EXPERIENCE</p><h2>Engineering, with people.</h2></div><p>Building systems also means connecting teams,<br />understanding workflows, and keeping work moving.</p></div>
        <div className="experience-row"><span className="experience-index">01</span><div><p className="eyebrow">ENGINEERING LEADERSHIP</p><h3>IEEE Concordia</h3><p>Director of Projects</p><span className="subtle">June 2026–present</span></div><div className="experience-description"><p>Coordinate embedded, electrical, mechanical, and software teams. Maintain project roadmaps and technical checkpoints, support design reviews and purchasing decisions, and help teams identify integration issues.</p></div></div>
        <div className="experience-row"><span className="experience-index">02</span><div><p className="eyebrow">PROFESSIONAL EXPERIENCE</p><h3>CMHC</h3><p>Analyst internship</p><span className="subtle">Fall 2026 · Current placement</span></div><div className="experience-description"><p>Develop task-automation solutions, analyze operational data and workflows, and identify process improvements. Support requirements gathering, reporting, documentation, and internal issue tracking with cross-functional stakeholders.</p></div></div>
        <div className="experience-row"><span className="experience-index">03</span><div><p className="eyebrow">INDEPENDENT DEVELOPMENT</p><h3>Roblox</h3><p>Freelance Game Developer</p><span className="subtle">2019–present</span></div><div className="experience-description"><p>Contribute to full-stack game development using Luau, including gameplay systems, interfaces, backend logic, and multiplayer functionality. Coordinate development teams and communicate with external stakeholders.</p></div></div>
      </div></section>
      <section className="section shell about-grid" id="about"><div><p className="eyebrow">03 / A LITTLE ABOUT ME</p><h2>At the intersection<br />of code & circuits.</h2><div className="about-mark" aria-label="Hanish Pagadala initials"><span>HP</span><small>ALWAYS EXPLORING / ALWAYS LEARNING</small></div><div className="education-note"><p className="eyebrow">CONCORDIA UNIVERSITY</p><p>BEng · Computer Engineering</p><span className="subtle">2023–2028 expected · Co-operative Education</span></div></div>
        <div className="about-copy"><p className="large-copy">I like the moment an idea becomes something you can test.</p><p>My work spans autonomous robots, digital hardware, networking, web applications, and data tools. I enjoy understanding how the pieces fit together—then debugging the interfaces, testing assumptions, and making the next iteration better.</p><p>As Director of Projects at IEEE Concordia, I bring that same approach to multidisciplinary teams. Alongside my studies, I work on process improvement at CMHC and continue exploring avionics, reaction-wheel systems, and laser transmission.</p><div className="skills"><p className="eyebrow">TOOLS USED ACROSS MY WORK</p><div className="skill-row"><h3>Languages</h3><p>C / C++ · Python · TypeScript / JavaScript · SQL · VHDL · Luau</p></div><div className="skill-row"><h3>Hardware</h3><p>ESP32 · Arduino · FPGA · Sensors · Soldering & prototyping</p></div><div className="skill-row"><h3>Software</h3><p>React · Flask · Firebase · TCP / UDP · Multithreading</p></div><div className="skill-row"><h3>Data</h3><p>Pandas · Scikit-learn · Selenium</p></div><div className="skill-row"><h3>Workflow</h3><p>Git · Docker · ModelSim · Vivado · Agile / Scrum</p></div></div></div>
      </section>
<section className="shell explore-story" aria-label="Explore the personal mind map"><div><p className="eyebrow">A DIFFERENT WAY TO EXPLORE</p><h2>The connections behind the work.</h2><p>Follow the thread from game development to engineering, meet the interests behind the projects, and see how the pieces connect.</p></div><a className="story-link" href="#visualize">Explore my mind map <span aria-hidden="true">↗</span></a></section>
      <section className="shell resume-section" id="resume"><div><p className="eyebrow">THE DETAILS, IN ONE PLACE</p><h2>A concise look at my experience.</h2><p>View my experience and selected projects in a concise résumé, ready to print or save as PDF.</p></div><a className="button primary" href="./resume.html" target="_blank" rel="noreferrer">View résumé <Arrow /></a></section>
      <section className="contact-section" id="contact"><div className="shell contact-inner"><p className="eyebrow">04 / LET’S CONNECT</p><h2>Good engineering<br />starts with a <em>conversation.</em></h2><p>Let’s talk embedded systems, robotics, software, or the next interesting problem.</p><div className="email-row"><a className="email-link" href={`mailto:${email}`}>{email} <Arrow /></a><button onClick={copyEmail} aria-label="Copy email address">{copied ? 'Copied ✓' : 'Copy email'}</button><span className="sr-only" role="status">{copied ? 'Email address copied.' : ''}</span></div><div className="contact-links"><a href={github} target="_blank" rel="noreferrer">GitHub <Arrow /></a><a href={linkedin} target="_blank" rel="noreferrer">LinkedIn <Arrow /></a></div></div></section>
    </>}</main>{!visualize && <footer className="shell footer"><a className="footer-name" href="#home">Hanish Pagadala<span>Computer Engineering</span></a><p>Thoughtfully designed. Always evolving.</p><a href="#home">Back to top ↑</a></footer>}
  </>
}
export default App
