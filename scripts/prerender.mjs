// Post-build step: inject the server-rendered splash markup into the
// client build's index.html, so the page ships with real content in the
// HTML body instead of an empty <div id="root">.
import { readFileSync, writeFileSync } from 'node:fs'
import { render } from '../dist-ssr/entry-server.js'

const TEMPLATE = 'dist/index.html'
const ROOT = '<div id="root"></div>'

const html = readFileSync(TEMPLATE, 'utf-8')
if (!html.includes(ROOT)) {
  throw new Error(`prerender: "${ROOT}" not found in ${TEMPLATE}`)
}

const appHtml = render()
writeFileSync(TEMPLATE, html.replace(ROOT, `<div id="root">${appHtml}</div>`))
console.log(`prerender: injected ${appHtml.length} chars of static markup into ${TEMPLATE}`)
