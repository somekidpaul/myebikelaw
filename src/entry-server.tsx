import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'

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
