import { useState } from 'react'
import type {
  BikeProfile,
  ClassificationNote,
  Compliance,
  Gap,
  Remedy,
  USD,
} from '../types'
import { CarrierDirectory } from './CarrierDirectory'
import { buildIcs, downloadIcs, NJ_S4834_DEADLINE_EVENT } from '../lib/calendar'
import { NJ_S4834 } from '../data/statutes/nj'

export function Verdict({
  compliance,
  bike,
  onReset,
}: {
  compliance: Compliance
  bike?: BikeProfile
  onReset: () => void
}) {
  const hasGaps = compliance.status === 'gaps'
  return (
    <div className="space-y-8">
      <PrintHeader />
      <VerdictHeader compliance={compliance} />
      {compliance.classificationNote && (
        <ClassificationCallout note={compliance.classificationNote} />
      )}
      {bike && compliance.status !== 'prohibited' && (
        <PendingExtensionCallout bike={bike} />
      )}
      <Body compliance={compliance} />
      <Citations compliance={compliance} />

      <div className="no-print flex flex-wrap items-center gap-3">
        <ShareButton />
        <SaveAsPdfButton />
        {hasGaps && <AddToCalendarButton />}
        <button type="button" onClick={onReset} className="btn btn-ghost">
          ← Start over
        </button>
      </div>
    </div>
  )
}

// Letterhead shown only when the results page is printed / saved as PDF.
function PrintHeader() {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  return (
    <div className="print-only print-header">
      <strong className="font-rounded text-lg font-bold">MyEBikeLaw.com</strong>
      <span className="text-sm text-[var(--color-ink-soft)]">
        New Jersey S4834 compliance check · generated {today}
      </span>
    </div>
  )
}

function SaveAsPdfButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn btn-ghost"
    >
      Save as PDF
    </button>
  )
}

function PendingExtensionCallout({ bike }: { bike: BikeProfile }) {
  // Only relevant when the NJ engine classified this bike as low-speed-electric —
  // the category currently exempt from insurance, which two pending NJ bills
  // (A2093, S3156) would close.
  const category = NJ_S4834.appliesTo(bike)
  if (category !== 'low-speed-electric') return null
  return (
    <div
      className="rounded-lg border p-5"
      style={{
        background: 'rgba(127, 163, 200, 0.06)',
        borderColor: 'rgba(127, 163, 200, 0.22)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="dot" style={{ background: 'var(--color-ink-soft)' }} />
        <span
          className="eyebrow"
          style={{ color: 'var(--color-ink-soft)' }}
        >
          Heads up · pending NJ legislation
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-soft)]">
        Two pending NJ bills —{' '}
        <strong className="text-[var(--color-ink)]">A2093</strong> and{' '}
        <strong className="text-[var(--color-ink)]">S3156</strong> — would extend
        insurance and registration to low-speed electric bicycles too, closing the
        current exemption that applies to your bike. Both are in their respective
        Transportation Committees. Most committee bills don't advance, but worth
        knowing about so you're not caught off guard if they do.
      </p>
    </div>
  )
}

function ShareButton() {
  const [copied, setCopied] = useState(false)
  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // Clipboard API can fail (insecure context, etc.) — fall back: select URL
      window.prompt('Copy this link:', window.location.href)
    }
  }
  return (
    <button type="button" onClick={onClick} className="btn btn-ghost">
      {copied ? 'Copied ✓' : 'Copy share link'}
    </button>
  )
}

function AddToCalendarButton() {
  const onClick = () => {
    const ics = buildIcs(NJ_S4834_DEADLINE_EVENT)
    downloadIcs('s4834-deadline.ics', ics)
  }
  return (
    <button type="button" onClick={onClick} className="btn btn-ghost">
      Add deadline to calendar
    </button>
  )
}

function ClassificationCallout({ note }: { note: ClassificationNote }) {
  return (
    <div
      className="rounded-lg border p-5"
      style={{
        background: 'rgba(245, 158, 11, 0.08)',
        borderColor: 'rgba(245, 158, 11, 0.35)',
      }}
    >
      <div className="flex items-center gap-2">
        <span className="dot dot-warn" />
        <span className="eyebrow" style={{ color: '#fbbf24' }}>
          Ambiguous classification
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink)]">
        Your bike falls in a statutory gap. We classified it conservatively as{' '}
        <strong>{labelOf(note.chosen)}</strong> ({note.readingTaken} reading) —
        the alternate reading would be <strong>{labelOf(note.alternate)}</strong>.
      </p>
      <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
        {note.reason}
      </p>
      {note.citations.length > 0 && (
        <ul className="mt-3 text-xs">
          {note.citations.map((c, i) => (
            <li key={i}>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--color-brand-soft)' }}
              >
                {c.statute} ↗
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function labelOf(c: string): string {
  return (
    {
      'low-speed-electric': 'low-speed electric bicycle',
      motorized: 'motorized bicycle',
      'electric-motorized': 'electric motorized bicycle',
      standard: 'standard bicycle',
    } as Record<string, string>
  )[c] ?? c
}

function VerdictHeader({ compliance }: { compliance: Compliance }) {
  const { tone, accent, title, sub } = verdictCopy(compliance)
  return (
    <div
      className="rounded-lg border p-7"
      style={{
        background: `linear-gradient(180deg, ${tone}1f 0%, ${tone}0a 100%)`,
        borderColor: `${tone}55`,
      }}
    >
      <div className="flex items-center gap-2">
        <span className="dot" style={{ background: tone, width: 10, height: 10 }} />
        <span
          className="eyebrow"
          style={{ color: accent }}
        >
          {verdictLabel(compliance)}
        </span>
      </div>
      <h2 className="mt-3 text-2xl font-bold sm:text-3xl" style={{ color: accent }}>
        {title}
      </h2>
      <p className="mt-2 text-[var(--color-ink-soft)]">{sub}</p>
    </div>
  )
}

function verdictCopy(c: Compliance): {
  tone: string
  accent: string
  title: string
  sub: string
} {
  switch (c.status) {
    case 'compliant':
      return {
        tone: '#84cc16',
        accent: '#a3e635',
        title: "You appear to be compliant.",
        sub: 'Based on what you told us, you meet the statutory requirements. Verify with your carrier in writing before relying on this.',
      }
    case 'gaps':
      return {
        tone: '#f59e0b',
        accent: '#fbbf24',
        title: 'You have gaps to address.',
        sub: "Here's what would be needed to fully comply with the statute as written.",
      }
    case 'prohibited':
      return {
        tone: '#ef4444',
        accent: '#f87171',
        title: 'You cannot legally operate this bike.',
        sub: c.reason,
      }
    case 'not-applicable':
      return {
        tone: '#a8a29e',
        accent: '#fafaf9',
        title: 'This statute does not apply.',
        sub: c.reason,
      }
    case 'reclassified':
      return {
        tone: '#ea580c',
        accent: '#fb923c',
        title: `Your bike is reclassified as a ${c.targetClassification}.`,
        sub: c.note,
      }
  }
}

function verdictLabel(c: Compliance): string {
  switch (c.status) {
    case 'compliant':
      return 'Compliant'
    case 'gaps':
      return 'Gaps detected'
    case 'prohibited':
      return 'Prohibited'
    case 'not-applicable':
      return 'Not applicable'
    case 'reclassified':
      return 'Reclassified'
  }
}

function Body({ compliance }: { compliance: Compliance }) {
  if (compliance.status !== 'gaps') return null

  const hasInsuranceGap = compliance.gaps.some((g) => g.kind === 'insurance')
  // When the carrier directory will render, hide the "buy-specialty-policy"
  // text remedy — the directory IS that remedy, expanded into actual content.
  const visibleRemedies = hasInsuranceGap
    ? compliance.remedies.filter((r) => r.kind !== 'buy-specialty-policy')
    : compliance.remedies

  return (
    <div className="space-y-8">
      <section>
        <h3
          className="text-xl font-bold sm:text-2xl"
          style={{ color: 'var(--color-brand-soft)' }}
        >
          Gaps
        </h3>
        <ul className="mt-3 space-y-3">
          {compliance.gaps.map((g, i) => (
            <li key={i} className="card">
              <GapItem gap={g} />
            </li>
          ))}
        </ul>
      </section>

      {visibleRemedies.length > 0 && (
        <section>
          <h3
            className="text-xl font-bold sm:text-2xl"
            style={{ color: 'var(--color-brand-soft)' }}
          >
            Suggested remedies
          </h3>
          <ul className="mt-3 space-y-3">
            {visibleRemedies.map((r, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl p-4"
                style={{ background: 'rgba(255, 255, 255, 0.03)' }}
              >
                <span style={{ color: 'var(--color-brand)' }}>→</span>
                <span className="text-[var(--color-ink-soft)]">{renderRemedy(r)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasInsuranceGap && <CarrierDirectory />}
    </div>
  )
}

function GapItem({ gap }: { gap: Gap }) {
  switch (gap.kind) {
    case 'license-required':
      return (
        <>
          <h4 className="text-base font-bold sm:text-lg">License required</h4>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
            Accepted: {gap.accepted.join(' or ')}. Operating without one is a
            statutory violation.
          </p>
        </>
      )
    case 'registration-required':
      return (
        <>
          <h4 className="text-base font-bold sm:text-lg">Registration required</h4>
          <p className="mt-2 text-sm text-[var(--color-ink-soft)]">
            Your bike must be registered with the NJ MVC. Fees are waived through
            Jan 19, 2027.
          </p>
        </>
      )
    case 'insurance':
      return (
        <>
          <h4 className="text-base font-bold sm:text-lg">
            Insurance coverage shortfall
          </h4>
          <ul className="mt-3 space-y-2 text-sm">
            {gap.gaps.map((g, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-0 last:pb-0"
              >
                <span className="text-[var(--color-ink-soft)]">{axisLabel(g.axis)}</span>
                <span>
                  <span className="text-[var(--color-ink)]">
                    <Money v={g.required} />
                  </span>
                  <span className="ml-2 text-xs text-[var(--color-ink-faint)]">
                    have{' '}
                    {g.current === null ? (
                      <em>none</em>
                    ) : (
                      <Money v={g.current} />
                    )}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )
  }
}

function renderRemedy(r: Remedy): string {
  switch (r.kind) {
    case 'buy-specialty-policy':
      return `Get a specialty e-bike policy meeting the statutory minimums. Velosurance, VOOM, and Sundays all offer NJ-compliant plans, typically $75–$200/year.`
    case 'register-with-mvc':
      return `Register your bike with the NJ Motor Vehicle Commission. Fees are waived through Jan 19, 2027.`
    case 'obtain-license':
      return `Obtain one of: ${r.options.join(', ')}.`
    case 'verify-coverage-with-carrier':
      return `Call your existing carrier and ask in writing whether your e-bike is covered to the statutory limits. Most homeowners and renters policies exclude motorized vehicles — don't assume.`
  }
}

function Citations({ compliance }: { compliance: Compliance }) {
  if (compliance.citations.length === 0) return null
  const seen = new Set<string>()
  const unique = compliance.citations.filter((c) => {
    const key = c.statute + c.url
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  return (
    <section className="border-t border-white/5 pt-8">
      <h3
        className="text-xl font-bold sm:text-2xl"
        style={{ color: 'var(--color-brand-soft)' }}
      >
        Citations
      </h3>
      <ul className="mt-4 space-y-4">
        {unique.map((c, i) => (
          <li key={i} className="text-sm">
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium"
            >
              {c.statute} ↗
            </a>
            {c.quote && (
              <p className="mt-1 italic text-[var(--color-ink-faint)]">
                "{c.quote}"
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}

function axisLabel(axis: string): string {
  return {
    bodilyInjuryPerPerson: 'Bodily injury / person',
    bodilyInjuryPerAccident: 'Bodily injury / accident',
    propertyDamage: 'Property damage',
    pip: 'Personal injury protection',
  }[axis] ?? axis
}

function Money({ v }: { v: USD }) {
  return <>${v.toLocaleString('en-US')}</>
}
