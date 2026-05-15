import type { CarrierEntry } from '../types'
import { NJ_CARRIERS } from '../data/insurance/nj-carriers'

export function CarrierDirectory() {
  const carriers = NJ_CARRIERS
  if (carriers.length === 0) return null

  const lastVerified = carriers
    .map((c) => c.source.lastVerified)
    .sort()
    .reverse()[0]

  return (
    <section className="space-y-5 border-t border-white/5 pt-8">
      <header className="space-y-3">
        <h3
          className="text-xl font-bold sm:text-2xl"
          style={{ color: 'var(--color-brand-soft)' }}
        >
          Where to get an S4834-compliant policy
        </h3>
        <p className="text-sm text-[var(--color-ink-soft)]">
          Carriers don't publish liability limits publicly. When you get a quote,
          verify it covers at least{' '}
          <strong className="text-[var(--color-ink)]">$35,000 / $70,000 / $25,000</strong>{' '}
          bodily injury & property damage + PIP — or it's not S4834-compliant.
        </p>
        {lastVerified && (
          <p
            className="text-[10px] uppercase tracking-[0.18em]"
            style={{ color: 'var(--color-ink-faint)' }}
          >
            Last verified · {formatDate(lastVerified)}
          </p>
        )}
      </header>

      <div className="space-y-4">
        {carriers.map((c) => (
          <CarrierCard key={c.id} carrier={c} />
        ))}
      </div>

      <p className="text-xs leading-relaxed text-[var(--color-ink-faint)]">
        MyEBikeLaw.com does not sell insurance. No referral fees, no affiliate codes.
        Verify all coverage details with the carrier before purchasing.
      </p>
    </section>
  )
}

function CarrierCard({ carrier }: { carrier: CarrierEntry }) {
  const pricingLine =
    carrier.pricing.kind === 'quote-only'
      ? 'Quote required — pricing not published'
      : carrier.pricing.display
  const isWaitlist = carrier.status === 'waitlist'
  const ctaLabel = isWaitlist ? 'Join the waitlist ↗' : 'Get a quote ↗'

  return (
    <article
      className="rounded-lg border border-white/5 p-5"
      style={{ background: 'rgba(255, 255, 255, 0.025)' }}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <h4 className="text-base font-bold sm:text-lg">{carrier.name}</h4>
          {isWaitlist && (
            <span
              className="rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider"
              style={{
                background: 'rgba(245, 158, 11, 0.12)',
                color: 'var(--color-warn)',
              }}
            >
              Waitlist
            </span>
          )}
        </div>
        <a
          href={carrier.quoteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold"
          style={{ color: 'var(--color-brand-soft)' }}
        >
          {ctaLabel}
        </a>
      </div>

      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">{carrier.oneLiner}</p>

      <p className="mt-3 text-xs text-[var(--color-ink-faint)]">
        {pricingLine}
        {carrier.underwriter && (
          <>
            {' '}· Underwritten by {carrier.underwriter}
          </>
        )}
      </p>

      <ul className="mt-4 space-y-1.5 text-sm text-[var(--color-ink-soft)]">
        {carrier.coverageHighlights.map((h, i) => (
          <li key={i} className="flex items-start gap-2">
            <span style={{ color: 'var(--color-brand)' }}>•</span>
            <span>{h}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}

function formatDate(iso: string): string {
  // Parse as local date to avoid UTC-vs-local off-by-one drift
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y!, (m ?? 1) - 1, d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
