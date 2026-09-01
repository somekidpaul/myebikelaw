import { StrictMode } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ALL_FAQ } from './components/Faq'
import { LAST_REVIEWED } from './data/site-meta'

/** Re-exported so scripts/prerender.mjs can stamp sitemap.xml from the same
 *  constant the footer renders, instead of a hand-maintained second copy. */
export { LAST_REVIEWED }

/**
 * Build-time entry point. Renders the app's initial (splash) state to a
 * static HTML string so crawlers — including JS-blind ones — get real
 * content instead of an empty <div id="root">. The client still boots
 * normally via main.tsx and re-renders on top.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
}

/** Flatten a rendered FAQ answer to the plain text Google expects in JSON-LD. */
function answerToText(answer: React.ReactNode): string {
  return renderToStaticMarkup(<>{answer}</>)
    // Drop interactive controls CONTENT AND ALL, before the generic tag strip.
    // Stripping only the tags kept the label as a text node, so the FAQPage
    // schema for the deadline question ended "...Add deadline to calendar ↗" —
    // a UI affordance quoted to Google as part of the legal answer. (It also
    // never disappears server-side: the button's "past" flag flips in an
    // effect, which does not run during renderToStaticMarkup.)
    .replace(/<button\b[^>]*>[\s\S]*?<\/button>/gi, ' ')
    .replace(/<[^>]+>/g, ' ') // strip remaining tags (links, lists, <br>)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Build the FAQPage `mainEntity` array from the SAME source that renders the
 * visible FAQ (ALL_FAQ), so the structured data and the page can't diverge.
 * Returns a JSON string that scripts/prerender.mjs injects into index.html.
 */
export function renderFaqJsonLd(): string {
  return JSON.stringify(
    ALL_FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: answerToText(a) },
    })),
  )
}
