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
assert(html.includes('Work in progress only'), 'Ongoing-work control missing')
assert(html.includes('./resume.html'), 'Résumé link missing')
const anchors = [...html.matchAll(/href="#([^"]+)"/g)].map(m => m[1])
for (const anchor of anchors) assert(anchor === 'visualize' || html.includes(`id="${anchor}"`), `Broken anchor: ${anchor}`)
console.log('Passed: 13 rendered project cards; four populated disciplines; three ongoing projects; approved contact details only; social and résumé links; valid section links; unique SVG IDs.')

assert(html.includes('max="45"'), 'Wing sweep must stop at 45 degrees')
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

