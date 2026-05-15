import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary'

// Disable browser scroll restoration on refresh. Without this, the browser
// remembers where you scrolled and jumps back to that position on reload —
// which feels like "the page loaded in the middle." Refresh should always
// start at the top. URL hash anchors (#how-it-works) still work as expected.
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
