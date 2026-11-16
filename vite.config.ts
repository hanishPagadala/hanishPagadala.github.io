import { createHash } from 'node:crypto'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss(), {
    name: 'production-security-policy',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        const hashes = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
          .filter(match => match[1].trim())
          .map(match => `'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`)
        const policy = `default-src 'self'; script-src 'self' ${hashes.join(' ')}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'`
        return html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`)
      },
    },
  }],
})
