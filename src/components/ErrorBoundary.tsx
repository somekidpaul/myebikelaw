import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { readonly children: ReactNode }
type State = { readonly error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('MyEBikeLaw crashed:', error, info)
  }

  override render() {
    if (this.state.error) {
      return <Fallback error={this.state.error} />
    }
    return this.props.children
  }
}

function Fallback({ error }: { error: Error }) {
  return (
    <div className="min-h-svh">
      <main className="mx-auto max-w-2xl px-6 py-20">
        <p className="eyebrow">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
          The tool hit an unexpected error.
        </h1>
        <p className="mt-4 text-[var(--color-ink-soft)]">
          Reload the page to start over. If this keeps happening, please report it so it
          can be fixed.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Reload
          </button>
          <a
            href="mailto:somekidpaul@me.com?subject=MyEBikeLaw%20error&body=I%20hit%20this%20error%20on%20the%20site:"
            className="btn btn-ghost"
          >
            Report it
          </a>
        </div>
        <details className="mt-10 text-sm text-[var(--color-ink-faint)]">
          <summary className="cursor-pointer">Error details</summary>
          <pre className="mt-3 overflow-auto rounded-md bg-white/5 p-4 text-xs">
            {error.message}
            {'\n\n'}
            {error.stack}
          </pre>
        </details>
      </main>
    </div>
  )
}
