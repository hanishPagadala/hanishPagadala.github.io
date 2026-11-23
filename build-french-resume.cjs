const fs = require('node:fs')
const ts = require('typescript')
const moduleData = { exports: {} }
new Function('exports', 'module', ts.transpileModule(fs.readFileSync('src/translations.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)(moduleData.exports,moduleData)
const { translate, french } = moduleData.exports
const decode = value => value.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"')
const escape = value => value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
const source = fs.readFileSync('public/resume.html','utf8')
const missing=[]
let inStyle=false
const result=source.split(/(<[^>]*>)/g).map(part=>{
 if(part.startsWith('<')) {if(part.startsWith('<style'))inStyle=true;if(part.startsWith('</style'))inStyle=false;return part.replace('lang="en"','lang="fr-CA"').replace('aria-label="Résumé navigation"','aria-label="Navigation du CV"')}
 if(inStyle)return part
 const text=decode(part)
 if(text.trim().includes(' ') && /[A-Za-z]/.test(text) && !french[text.trim()] && !/Sai Hanish Pagadala|s_pagad|GitHub|LinkedIn/.test(text))missing.push(text.trim())
 return escape(translate(text))
}).join('')
fs.writeFileSync('public/resume-fr.html',result.replace('href="./resume-fr.html" lang="fr-CA">Français', 'href="./resume.html" lang="en">English').replace('Sai Hanish Pagadala — engineering résumé', 'Sai Hanish Pagadala — CV en génie'))
console.log('French résumé generated. Untranslated phrases:',JSON.stringify([...new Set(missing)],null,2))
