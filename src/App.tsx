import { useEffect, useRef, useState } from 'react'
import { Form, type FormResult } from './components/Form'
import { Verdict } from './components/Verdict'
import { Faq } from './components/Faq'
import { Splash } from './components/Splash'
import { Reveal } from './components/Reveal'
import { checkCompliance } from './engine/compliance'
import { NJ_S4834 } from './data/statutes/nj'
import { decodeAnswers, encodeAnswers } from './lib/share'
import type { BikeProfile, Compliance } from './types'

type AppState =
  | { phase: 'splash' }
  | { phase: 'form' }
  | { phase: 'result'; compliance: Compliance; bike: BikeProfile }

function App() {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window === 'undefined') return { phase: 'splash' }
    const answers = decodeAnswers(window.location.search.slice(1))
    if (!answers) return { phase: 'splash' }
    const compliance = checkCompliance({ ...answers, statute: NJ_S4834 })
    return { phase: 'result', compliance, bike: answers.bike }
  })
  const workRef = useRef<HTMLDivElement | null>(null)
  const isFirstRender = useRef(true)

  const handleSubmit = (r: FormResult) => {
    const compliance = checkCompliance({ ...r, statute: NJ_S4834 })
    const qs = encodeAnswers(r)
    window.history.pushState({}, '', `?${qs}`)
    setState({ phase: 'result', compliance, bike: r.bike })
  }

  const handleReset = () => {
    window.history.pushState({}, '', window.location.pathname)
    setState({ phase: 'splash' })
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (state.phase !== 'splash') workRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.phase])

  useEffect(() => {
    const onPop = () => {
      const answers = decodeAnswers(window.location.search.slice(1))
      if (!answers) {
        setState({ phase: 'splash' })
        return
      }
      const compliance = checkCompliance({ ...answers, statute: NJ_S4834 })
      setState({ phase: 'result', compliance, bike: answers.bike })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return (
    <div className="min-h-svh">
      <a href="#main" className="skip-link">Skip to content</a>
      <SiteHeader />

      <main id="main">
      {state.phase === 'splash' && (
        <Splash onCheckNJ={() => setState({ phase: 'form' })} />
      )}

      <div ref={workRef}>
        {state.phase === 'form' && (
          <section className="mx-auto max-w-2xl px-6 py-16 lift-in">
            <button
              type="button"
              onClick={() => setState({ phase: 'splash' })}
              className="text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
            >
              ← Back
            </button>
            <div className="mt-6">
              <SectionEyebrow>Step 2 · Your situation</SectionEyebrow>
            </div>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              A few questions about your bike.
            </h2>
            <p className="mt-3 text-[var(--color-ink-soft)]">
              All answers stay in your browser. We never store, share, or sell anything.
            </p>
            <div className="mt-10">
              <Form onSubmit={handleSubmit} />
            </div>
          </section>
        )}

        {state.phase === 'result' && (
          <section className="mx-auto max-w-2xl px-6 py-16 lift-in">
            <Verdict
              compliance={state.compliance}
              bike={state.bike}
              onReset={handleReset}
            />
          </section>
        )}
      </div>

      {state.phase === 'splash' && (
        <>
          <HowItWorks />
          <Reveal>
            <Faq />
          </Reveal>
        </>
      )}
      </main>

      <SiteFooter />
    </div>
  )
}

function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-6 pt-6">
      <a href="/" className="flex items-center gap-2 text-[var(--color-ink)]">
        <Logo />
        <span className="font-rounded text-lg font-bold tracking-tight">
          MyEBikeLaw
        </span>
      </a>
      <nav className="hidden gap-6 text-sm text-[var(--color-ink-soft)] sm:flex">
        <a href="#how-it-works">How it works</a>
        <a
          href="https://www.nj.gov/mvc/vehicletopics/ebike.htm"
          target="_blank"
          rel="noopener noreferrer"
        >
          The law (NJ MVC)
        </a>
      </nav>
    </header>
  )
}

function Logo() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="14" cy="14" r="13" stroke="currentColor" strokeOpacity="0.18" />
      <circle cx="14" cy="14" r="6" stroke="var(--color-brand)" strokeWidth="2" />
      <circle cx="14" cy="14" r="1.5" fill="var(--color-brand)" />
    </svg>
  )
}

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-5xl px-6 pt-20 pb-12 sm:pt-24 sm:pb-16"
    >
      <div className="mx-auto max-w-3xl text-center">
        <span className="eyebrow">How it works</span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          Reads the actual law. Checks your situation.
        </h2>
        <p className="mt-4 text-[var(--color-ink-soft)]">
          Blogs say "you need insurance now" — but the statute is more nuanced
          than that. Different rules apply based on your bike's motor power, top
          speed, throttle, and your age.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-3">
        <Reveal delay={0}>
          <Step
            n="1"
            title="Tell us about your bike"
            body="Motor wattage, top assisted speed, throttle or pedal-assist. We classify it under the statutory categories."
          />
        </Reveal>
        <Reveal delay={100}>
          <Step
            n="2"
            title="Tell us about your coverage"
            body="Specialty e-bike policy, auto, homeowners, renters, or nothing. Most homeowners policies exclude motorized vehicles — we say so."
          />
        </Reveal>
        <Reveal delay={200}>
          <Step
            n="3"
            title="Get the verdict"
            body="Compliant, gaps, prohibited, or out-of-scope — with every claim linked back to the statute. No sales pitch."
          />
        </Reveal>
      </div>
    </section>
  )
}

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="card lift flex h-full flex-col text-center">
      <span
        className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full text-base font-bold"
        style={{
          background: 'rgba(234, 88, 12, 0.12)',
          color: 'var(--color-brand)',
        }}
      >
        {n}
      </span>
      <h3 className="mt-7 text-xl font-bold sm:text-2xl">{title}</h3>
      <p className="mt-4 text-sm text-[var(--color-ink-soft)]">{body}</p>
    </div>
  )
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <span className="eyebrow">{children}</span>
}

function SiteFooter() {
  return (
    <footer className="mx-auto mt-16 max-w-5xl px-6 pb-10 pt-6 text-xs leading-relaxed text-[var(--color-ink-faint)]">
      <p className="border-t border-white/5 pt-6">
        <strong className="text-[var(--color-ink-soft)]">
          MyEBikeLaw.com is an informational tool, not a law firm or insurance broker.
        </strong>{' '}
        It does not provide legal or insurance advice. The output reflects a
        good-faith reading of the cited statutes, last reviewed{' '}
        <strong className="text-[var(--color-ink-soft)]">May 14, 2026</strong>;
        verify details with your insurance agent and{' '}
        <a
          href="https://www.nj.gov/mvc/vehicletopics/ebike.htm"
          target="_blank"
          rel="noopener noreferrer"
        >
          the NJ MVC
        </a>{' '}
        before relying on it. No affiliate links — recommendations are neutral.
      </p>
      <p className="mt-3">
        <a
          href="mailto:somekidpaul@me.com?subject=MyEBikeLaw.com%20%E2%80%94%20possible%20inaccuracy&body=I%20noticed%20something%20that%20might%20be%20wrong%3A%0A%0A"
          className="text-[var(--color-ink-soft)]"
        >
          Report an inaccuracy ↗
        </a>
      </p>
    </footer>
  )
}

export default App
