const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const cache = new Map()
function load(file) {
  const resolved = path.resolve(file)
  if (cache.has(resolved)) return cache.get(resolved).exports
  const module = { exports: {} }
  cache.set(resolved, module)
  const js = ts.transpileModule(fs.readFileSync(resolved, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText
  const localRequire = name => name.endsWith('.css') ? {} : name.startsWith('.') ? load(path.resolve(path.dirname(resolved), name + (name.endsWith('.ts') || name.endsWith('.tsx') ? '' : fs.existsSync(path.resolve(path.dirname(resolved), name + '.tsx')) ? '.tsx' : '.ts'))) : require(name)
  new Function('require', 'module', 'exports', js)(localRequire, module, module.exports)
  return module.exports
}
const { projects, categories } = load('src/projects.ts')
const App = load('src/App.tsx').default
const html = renderToStaticMarkup(React.createElement(App))
const resume = fs.readFileSync('public/resume.html', 'utf8')
const assert = (condition, message) => { if (!condition) throw new Error(message) }
assert(projects.length === 13, 'Expected 13 projects')
assert(new Set(projects.map(p => p.id)).size === 13, 'Project IDs must be unique')
assert(projects.filter(p => p.ongoing).length === 3, 'Expected three ongoing projects')
for (const title of ['Oblique Wing Drone', 'Reaction Wheel', 'Lumentum/IEEE: Laser Transmission']) assert(projects.find(p => p.title === title)?.ongoing, `${title} must be ongoing`)
for (const category of categories.slice(1)) assert(projects.some(p => p.category === category), `Empty category: ${category}`)
assert((html.match(/<article/g) || []).length === 13, 'Render must include all 13 project cards')
const patternIds = [...html.matchAll(/<pattern id="([^"]+)"/g)].map(m => m[1])
assert(patternIds.length === new Set(patternIds).size, 'SVG IDs must be unique')
for (const content of [html, resume]) {
  assert(!/hand tracking|chess|438[\s.-]*365|[0-9]{3}[- ]?[0-9]{3}[- ]?[0-9]{4}/i.test(content.replace(/<[^>]+>/g, ' ')), 'Excluded project or phone number found')
  const emails = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []
  assert(emails.length > 0 && emails.every(e => e === 's_pagad@live.concordia.ca'), 'Only approved email may appear')
  assert(content.includes('https://github.com/hanishPagadala/'), 'GitHub link missing')
  assert(content.includes('https://www.linkedin.com/in/sai-hanish-pagadala-a21599379/'), 'LinkedIn link missing')
}
assert(html.includes('June 2026–present'), 'IEEE role date missing')
assert(html.includes('Currently building'), 'Separate ongoing-work section missing')
assert(html.includes('./resume.html'), 'Résumé link missing')
const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1])
for (const anchor of anchors) assert(anchor === 'visualize' || html.includes(`id="${anchor}"`), `Broken anchor: ${anchor}`)
console.log('Passed: 13 rendered project cards; four populated disciplines; three ongoing projects; approved contact details only; social and résumé links; valid section links; unique SVG IDs.')

assert(html.includes('alt="Portrait of Hanish Pagadala"'), 'Hero portrait missing')
assert(!html.includes('Illustrative wing sweep angle'), 'Aircraft interaction must be removed')
assert(!html.includes('55°'), 'Old wing limit must be absent')

assert(html.includes('href="#visualize"'), 'Visualize navigation link missing')
const mapHtml = renderToStaticMarkup(React.createElement(load('src/MindMap.tsx').default))
assert(mapHtml.includes('id="visualize"'), 'Full map page missing')
assert(mapHtml.includes('aria-controls="map-detail"'), 'Map detail controls missing')


global.window = { location: { hash: '#visualize' } }
const visualPage = renderToStaticMarkup(React.createElement(App))
assert(visualPage.includes('map-center'), 'Direct Visualize route must render mind map')
assert(!visualPage.includes('PROJECT EXPLORER'), 'Visualize must be a full page rather than an inline section')
assert(visualPage.includes('aria-current="page"'), 'Visualize navigation must indicate active page')
delete global.window


assert(!html.includes('project-art'), 'Project illustrations must stay removed')
assert(!/<article[^>]*>[\s\S]*?<svg[\s\S]*?<\/article>/.test(html), 'Project cards must not contain illustrations')




assert((html.match(/class="project-inline"/g) || []).length === 13, 'Each project needs inline details')
assert(!html.includes('<dialog'), 'Project overlays must be absent')

assert(html.includes('aria-label="Page reading progress"'), 'Reading progress missing')
assert(html.includes('Explore my mind map'), 'Exploration invitation missing')
for (const id of ['04', '07', '11']) assert(html.includes('id="project-' + id + '"'), 'Featured destination missing: ' + id)

const orderedProjects = [...html.matchAll(/<article[^>]*id="project-([0-9]+)"/g)].map(match => match[1])
assert(orderedProjects.slice(0, 3).join(',') === '04,05,07', 'Featured stories must lead with robot, hovercraft, and protocol')
assert(orderedProjects.slice(3, 6).join(',') === '01,02,03', 'WIP projects must be grouped separately')
assert(new Set(orderedProjects).size === 13, 'Projects must appear once each')
assert((html.match(/class="case-study"/g) || []).length === 3, 'Three engineering stories required')
assert(!html.includes('reading-rail') && !html.includes('project-overview') && !html.includes('start-points'), 'Redundant navigation and counters must be absent')
assert(html.includes('class="project-archive"'), 'Additional project section missing')
assert(html.includes('CommuncationProtocols_NewsSharingProtocol'), 'Resume-provided source link missing')
assert(html.includes('<section class="project-archive"'), 'Additional projects must be a permanently visible section')
assert(!html.includes('<details class="project-archive"'), 'Additional projects must not require expansion')
