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

const { PreferencesContext, defaultPreferences } = load('src/preferences-context.ts')
const App = load('src/App.tsx').default
const { translate, french } = load('src/translations.ts')
const { projects } = load('src/projects.ts')
const assert = (condition, message) => { if (!condition) throw new Error(message) }
const render = (language, element = React.createElement(App)) => renderToStaticMarkup(React.createElement(PreferencesContext.Provider, { value: { preferences: { ...defaultPreferences, language }, update() {}, reset() {} } }, element))
const en = render('en')
const fr = render('fr')
assert(fr.includes('Portfolio en génie'), 'French introduction missing')
assert(fr.includes('Roue de réaction'), 'French project title missing')
assert(fr.includes('Mon rôle') && fr.includes('Le résultat'), 'French project stories missing')
assert(fr.includes('./resume-fr.html'), 'French résumé route missing')
assert(!fr.includes('Read the engineering story') && !fr.includes('Skip to content'), 'English UI text leaked into French')
assert(en.includes('./resume.html') && en.includes('Reading preferences'), 'English controls missing')
assert(fr.includes('Préférences de lecture') && fr.includes('Réduire les animations'), 'French preferences missing')
assert(fr.includes('aria-label="Aller au contenu"') || fr.includes('Aller au contenu'), 'French skip link missing')
for(const project of projects) {
  for(const text of [project.description, ...project.contributions]) assert(french[text], 'Untranslated project content: '+text)
}
const map = render('fr', React.createElement(load('src/MindMap.tsx').default))
assert(map.includes('Loisirs et passions') && map.includes('Sélectionnez une branche'), 'French map missing')
const resume = fs.readFileSync('public/resume-fr.html', 'utf8')
assert(resume.includes('lang="fr"') && resume.includes('Expérience professionnelle'), 'French résumé missing')
assert(!resume.includes('438-365') && resume.includes('s_pagad@live.concordia.ca'), 'Résumé privacy regression')
const a11yCss = fs.readFileSync('src/Accessibility.css','utf8')
for(const flag of ['high-contrast','reduce-motion','text-spacing','underline-links','simple-map','large-text']) assert(a11yCss.includes('data-'+flag), 'Missing preference style: '+flag)
assert(fr.includes('value="200"'), '200% text option missing')
assert(fr.includes('aria-controls="accessibility-panel"'), 'Preference disclosure association missing')
console.log('Passed: English/French UI, all project narratives, map labels, translated résumé, privacy, 200% text control, preference selectors, and disclosure labeling.')

assert(en.indexOf('class="theme-button"') < en.indexOf('class="language-switch"'), 'Theme must precede language')
assert(en.indexOf('class="language-switch"') < en.indexOf('class="accessibility-disclosure"'), 'Language must precede settings')
assert(en.includes('class="settings-gear"'), 'Centered gear icon missing')

