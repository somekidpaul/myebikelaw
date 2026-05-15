import type { PendingStateBill, RequirementHint } from '../types'
import { PENDING_STATE_BILLS } from '../data/pending-bills'
import { NJ_S4834 } from '../data/statutes/nj'
import { Reveal } from './Reveal'

export function Splash({ onCheckNJ }: { onCheckNJ: () => void }) {
  return (
    <>
      <SplashHero />
      <StateGrid onCheckNJ={onCheckNJ} />
    </>
  )
}

function SplashHero() {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-12 pt-16 sm:pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <span className="eyebrow">E-bike law compliance · by state</span>
        <h1 className="mt-4 text-[36px] font-bold leading-[1.05] tracking-tight sm:text-[64px]">
          Your e-bike is legal.
          <br />
          Are you compliant?
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-ink-soft)] sm:text-xl">
          E-bikes are legal everywhere in the US — but a few states now require
          a license, registration, or insurance to ride one. New Jersey was first.
          Others have bills in motion. Find your state below.
        </p>

        <ul className="trust-row mt-10 mb-10 justify-center">
          <li>
            <span className="dot dot-brand" />
            Cites the statute directly
          </li>
          <li>
            <span className="dot dot-brand" />
            Not a law firm
          </li>
          <li>
            <span className="dot dot-brand" />
            No affiliate links
          </li>
        </ul>
      </div>
    </section>
  )
}

function StateGrid({ onCheckNJ }: { onCheckNJ: () => void }) {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16">
      <Reveal>
        <NJCard onClick={onCheckNJ} />
      </Reveal>

      <div className="mt-16">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="eyebrow">Other states to watch</span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Bills in motion elsewhere
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-[var(--color-ink-soft)]">
              None passed yet. We promote a state to its own compliance tool the
              moment its bill is signed.
            </p>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PENDING_STATE_BILLS.map((b, i) => (
            <Reveal key={b.state} delay={i * 80}>
              <PendingStateCard bill={b} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p
            className="mx-auto mt-10 max-w-2xl text-center text-sm"
            style={{ color: 'var(--color-ink-soft)' }}
          >
            <span className="dot dot-good mr-2 inline-block align-middle" />
            <span className="align-middle">
              Don't see your state? You're in the clear — no other US states
              currently require a license, registration, or insurance to ride
              an e-bike. We're watching all 50 and will add a card the moment
              that changes.
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function NJCard({ onClick }: { onClick: () => void }) {
  const daysLeft = daysUntil(NJ_S4834.complianceDeadline)
  return (
    <div
      className="lift relative overflow-hidden rounded-2xl border p-8 sm:p-10"
      style={{
        background:
          'linear-gradient(135deg, rgba(234,88,12,0.10) 0%, rgba(234,88,12,0.02) 100%)',
        borderColor: 'rgba(234,88,12,0.35)',
      }}
    >
      <div className="flex items-center gap-3">
        <span className="dot" style={{ background: 'var(--color-good)' }} />
        <span
          className="eyebrow"
          style={{ color: 'var(--color-good)' }}
        >
          In effect · {daysLeft > 0 ? `${daysLeft} days to comply` : 'Past deadline'}
        </span>
      </div>

      <h2 className="mt-4 text-[28px] font-bold leading-[1.05] tracking-tight sm:text-[52px]">
        New Jersey
      </h2>

      <p className="mt-3 text-base text-[var(--color-ink-soft)] sm:text-lg">
        <strong className="text-[var(--color-ink)]">S4834 / P.L.2025, c.285</strong>{' '}
        — license, registration, and insurance required. Compliance deadline{' '}
        <strong className="text-[var(--color-ink)]">July 19, 2026</strong>. Rules
        differ by bike category — most riders don't know which one they're in.
      </p>

      <div className="mt-6 grid gap-2 text-sm text-[var(--color-ink-soft)] sm:grid-cols-3">
        <RequirementChip label="License" />
        <RequirementChip label="Registration" />
        <RequirementChip label="Insurance (motorized only)" />
      </div>

      <button
        type="button"
        onClick={onClick}
        className="btn btn-primary mt-8"
      >
        Check my NJ compliance →
      </button>
    </div>
  )
}

function RequirementChip({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-md px-3 py-1.5"
      style={{ background: 'rgba(234,88,12,0.08)', color: 'var(--color-brand-soft)' }}
    >
      <span style={{ fontSize: 12 }}>●</span>
      <span style={{ fontSize: 13 }}>{label}</span>
    </span>
  )
}

function PendingStateCard({ bill }: { bill: PendingStateBill }) {
  // If a bill passed but doesn't add license/registration/insurance, render it
  // with a neutral "informational" treatment instead of the amber "pending compliance" treatment.
  const isInformational = bill.requirementHints.length === 0
  const dotColor = isInformational
    ? 'var(--color-ink-soft)'
    : 'var(--color-warn)'
  const labelColor = dotColor

  return (
    <article
      className="lift flex h-full flex-col rounded-lg border p-5"
      style={{
        background: 'rgba(255,255,255,0.025)',
        borderColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="dot" style={{ background: dotColor }} />
        <span className="eyebrow" style={{ color: labelColor }}>
          {bill.statusLabel}
        </span>
      </div>

      <h3 className="mt-2 text-xl font-bold sm:text-2xl">{bill.stateName}</h3>
      <p
        className="mt-1 text-xs uppercase tracking-wider"
        style={{ color: 'var(--color-ink-faint)' }}
      >
        {bill.billId}
      </p>

      <p className="mt-4 text-sm text-[var(--color-ink-soft)]">{bill.oneLiner}</p>

      {(bill.requirementHints.length > 0 || bill.proposedEffectiveDate) && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {bill.requirementHints.map((r) => (
            <span
              key={r}
              className="rounded px-2 py-0.5 text-[10px] uppercase tracking-wider"
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--color-ink-soft)',
              }}
            >
              {labelFor(r)}
            </span>
          ))}
          {bill.proposedEffectiveDate && (
            <span
              className="rounded px-2 py-0.5 text-[10px] uppercase tracking-wider"
              style={{
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--color-ink-soft)',
              }}
            >
              {isInformational ? 'Effective: ' : 'If signed: '}
              {formatProposed(bill.proposedEffectiveDate)}
            </span>
          )}
        </div>
      )}

      <div className="mt-auto pt-5">
        <a
          href={bill.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold"
          style={{ color: 'var(--color-brand-soft)' }}
        >
          Read the bill ↗
        </a>
        <p
          className="mt-2 text-[10px] uppercase tracking-[0.18em]"
          style={{ color: 'var(--color-ink-faint)' }}
        >
          Last verified · {formatVerified(bill.lastVerified)}
        </p>
      </div>
    </article>
  )
}

function labelFor(r: RequirementHint): string {
  return r === 'license' ? 'License' : r === 'registration' ? 'Registration' : 'Insurance'
}

function daysUntil(iso: string): number {
  const target = new Date(iso + 'T00:00:00Z').getTime()
  return Math.ceil((target - Date.now()) / (1000 * 60 * 60 * 24))
}

function formatProposed(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y!, (m ?? 1) - 1, d).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

function formatVerified(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y!, (m ?? 1) - 1, d).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
