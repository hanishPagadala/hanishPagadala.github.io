const fs = require('node:fs')
const { createHash } = require('node:crypto')
const assert = require('node:assert/strict')
for (const file of ['dist/index.html', 'public/resume.html', 'public/resume-fr.html']) {
  const html = fs.readFileSync(file, 'utf8')
  const policy = html.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)?.[1]
  assert(policy, `${file}: missing policy`)
  assert(policy.includes("base-uri 'none'") && policy.includes("form-action 'none'"), `${file}: unsafe navigation defaults`)
  assert(!/script-src[^;]*'unsafe-(inline|eval)'/.test(policy), `${file}: permissive scripts`)
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (/\bsrc=/.test(match[1]) || !match[2].trim()) continue
    const hash = createHash('sha256').update(match[2]).digest('base64')
    assert(policy.includes(`'sha256-${hash}'`), `${file}: inline script hash mismatch`)
  }
}
for (const file of fs.readdirSync('src').filter(file => /\.(ts|tsx)$/.test(file))) {
  assert(!/dangerouslySetInnerHTML|\.innerHTML\s*=|\beval\s*\(/.test(fs.readFileSync(`src/${file}`, 'utf8')), `${file}: unsafe execution or HTML insertion`)
}
console.log('Passed production and résumé security policies, exact inline script hashes, and unsafe HTML/execution source checks.')
