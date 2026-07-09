import { StrictMode } from 'react'
import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ALL_FAQ } from './components/Faq'

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
    .replace(/<[^>]+>/g, ' ') // strip tags (links, lists, <br>, the calendar button)
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
