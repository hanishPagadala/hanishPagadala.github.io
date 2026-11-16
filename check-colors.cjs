const fs = require('node:fs')
const css = fs.readFileSync('src/Polish.css', 'utf8')
const rgb = hex => hex.replace('#', '').match(/../g).map(n => parseInt(n, 16) / 255)
const luminance = color => color.map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((a, v, i) => a + v * [.2126, .7152, .0722][i], 0)
const contrast = (a, b) => { const values = [luminance(a), luminance(b)].sort((x, y) => y - x); return (values[0] + .05) / (values[1] + .05) }
const minimums = []
for (const selector of [':root', ':root[data-theme=dark]']) {
  const block = css.slice(css.indexOf(selector + '{')).split('}')[0]
  const tokens = Object.fromEntries([...block.matchAll(/--([a-z-]+):(#[0-9a-f]{6})/g)].map(m => [m[1], rgb(m[2])]))
  for (const text of ['text', 'muted', 'accent', 'teal', 'warm']) {
    for (const surface of ['bg', 'surface', 'soft']) {
      const ratio = contrast(tokens[text], tokens[surface])
      if (ratio < 4.5) throw new Error(`${selector}: ${text} on ${surface} only ${ratio.toFixed(2)}:1`)
      minimums.push(ratio)
    }
  }
  for (const accent of ['accent', 'teal', 'warm']) {
    const tint = tokens[accent].map((v, i) => v * .08 + tokens.bg[i] * .92)
    const ratio = contrast(tokens[accent], tint)
    if (ratio < 4.5) throw new Error(`${selector}: tinted ${accent} only ${ratio.toFixed(2)}:1`)
    minimums.push(ratio)
  }
}
console.log(`Passed ${minimums.length} text/surface contrast pairs; minimum ${Math.min(...minimums).toFixed(2)}:1. This is a palette check, not a full accessibility audit.`)
