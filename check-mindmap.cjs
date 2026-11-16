const fs = require('node:fs')
const path = require('node:path')
const ts = require('typescript')
const React = require('react')
const { renderToStaticMarkup } = require('react-dom/server')
const state = []
let cursor = 0
const hooks = { ...React, useEffect() {}, useState(initial) {
  const index = cursor++
  if (!(index in state)) state[index] = typeof initial === 'function' ? initial() : initial
  return [state[index], value => { state[index] = typeof value === 'function' ? value(state[index]) : value }]
} }
const cache = new Map()
function load(file) {
  const resolved = path.resolve(file)
  if (cache.has(resolved)) return cache.get(resolved).exports
  const module = { exports: {} }
  cache.set(resolved, module)
  const js = ts.transpileModule(fs.readFileSync(resolved, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText
  const localRequire = name => name === 'react' ? hooks : name.endsWith('.css') ? {} : name.startsWith('.') ? load(path.resolve(path.dirname(resolved), name + '.ts')) : require(name)
  new Function('require', 'module', 'exports', js)(localRequire, module, module.exports)
  return module.exports
}
const MindMapComponent = load('src/MindMap.tsx').default
const assert = (condition, message) => { if (!condition) throw new Error(message) }
function render() { cursor = 0; return MindMapComponent() }
function walk(element, predicate, output = []) {
  if (!element || typeof element !== 'object') return output
  if (Array.isArray(element)) { element.forEach(child => walk(child, predicate, output)); return output }
  if (predicate(element)) output.push(element)
  walk(element.props?.children, predicate, output)
  return output
}
const buttons = tree => walk(tree, element => element.type === 'button')
const find = (tree, text) => buttons(tree).find(button => renderToStaticMarkup(button).includes(text))
let tree = render()
assert(buttons(tree).filter(b => b.props.className?.includes('branch-bubble')).length === 6, 'Expected six root branches')
find(tree, 'Embedded &amp; robotics').props.onMouseEnter()
tree = render()
assert(renderToStaticMarkup(tree).includes('role="tooltip"'), 'Hover summary must appear')
find(tree, 'Embedded &amp; robotics').props.onClick()
tree = render()
assert(buttons(tree).filter(b => b.props.className?.includes('leaf-bubble')).length === 4, 'Embedded branch must show four projects')
find(tree, 'Reaction Wheel').props.onClick()
tree = render()
assert(renderToStaticMarkup(tree).includes('Work in progress'), 'Project details must preserve WIP status')
find(tree, 'return to all branches').props.onClick()
tree = render()
find(tree, 'Hobbies &amp; passions').props.onClick()
tree = render()
assert(buttons(tree).filter(b => b.props.className?.includes('leaf-bubble')).length === 5, 'Expected five interest bubbles')
find(tree, 'Tennis &amp; volleyball').props.onClick()
tree = render()
assert(renderToStaticMarkup(tree).includes('Two sports I enjoy'), 'Selected hobby details must appear')
find(tree, 'Pause motion').props.onClick()
tree = render()
assert(!tree.props.className.includes('motion-on'), 'Pause motion must stop animation class')
const html = renderToStaticMarkup(tree)
assert(!/chess|hand tracking/i.test(html), 'Excluded projects must stay absent')
console.log('Passed mind-map interactions: six branches, hover summaries, project drill-down, WIP details, reset, five hobbies, hobby detail, and pause motion.')
