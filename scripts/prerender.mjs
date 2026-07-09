// Post-build step: inject the server-rendered splash markup into the
// client build's index.html, so the page ships with real content in the
// HTML body instead of an empty <div id="root">.
import { readFileSync, writeFileSync } from 'node:fs'
import { render, renderFaqJsonLd } from '../dist-ssr/entry-server.js'

const TEMPLATE = 'dist/index.html'
const ROOT = '<div id="root"></div>'
// Placeholder in index.html's FAQPage node, replaced with JSON-LD derived from
// the same source that renders the visible FAQ (no hand-maintained duplicate).
const FAQ_TOKEN = '"__FAQ_MAINENTITY__"'

let html = readFileSync(TEMPLATE, 'utf-8')
if (!html.includes(ROOT)) {
  throw new Error(`prerender: "${ROOT}" not found in ${TEMPLATE}`)
}
if (!html.includes(FAQ_TOKEN)) {
  throw new Error(`prerender: FAQ placeholder ${FAQ_TOKEN} not found in ${TEMPLATE}`)
}

const appHtml = render()
html = html.replace(ROOT, `<div id="root">${appHtml}</div>`)

// Inject the auto-derived FAQ structured data, with a sanity guard so a broken
// generation fails the build instead of shipping empty/garbage schema.
const faqJson = renderFaqJsonLd()
const faqItems = JSON.parse(faqJson)
if (!Array.isArray(faqItems) || faqItems.length < 8) {
  throw new Error(`prerender: FAQ JSON-LD looks wrong (${faqItems.length} items)`)
}
if (faqItems.some((it) => !it.name || !it.acceptedAnswer?.text)) {
  throw new Error('prerender: a FAQ JSON-LD entry is missing its question or answer text')
}
html = html.replace(FAQ_TOKEN, faqJson)

writeFileSync(TEMPLATE, html)
console.log(
  `prerender: injected ${appHtml.length} chars of markup + ${faqItems.length} FAQ schema entries into ${TEMPLATE}`,
)
