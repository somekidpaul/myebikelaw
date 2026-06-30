import { buildIcs, downloadIcs, NJ_S4834_DEADLINE_EVENT } from '../lib/calendar'

type QA = { readonly q: string; readonly a: React.ReactNode }

function AddToCalendarLink() {
  const onClick = () => {
    const ics = buildIcs(NJ_S4834_DEADLINE_EVENT)
    downloadIcs('s4834-deadline.ics', ics)
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 text-sm font-semibold"
      style={{ color: 'var(--color-brand-soft)' }}
    >
      Add deadline to calendar ↗
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// General questions — apply across the whole site / all states
// ─────────────────────────────────────────────────────────────────────────────

const GENERAL: ReadonlyArray<QA> = [
  {
    q: 'Is this legal advice?',
    a: (
      <>
        No. MyEBikeLaw.com is an informational tool — not a law firm, not an insurance
        broker. The output is a good-faith reading of the cited statutes and is not a
        substitute for advice from your own attorney or insurance agent. Every claim
        in the verdict links back to the source so you can verify it yourself.
      </>
    ),
  },
  {
    q: "Where does this tool's data come from?",
    a: (
      <>
        Every requirement traces back to a citation:
        <ul className="mt-3 space-y-2 list-disc pl-5">
          <li>
            Statute text — direct link to each state legislature's bill page
          </li>
          <li>
            Dollar minimums and insurance specifics — official state government
            sources (e.g., NJ DOBI bulletin for the $35k/$70k/$25k figures)
          </li>
          <li>
            Carrier information — curated by hand from each carrier's public
            product pages, with a "last verified" date stamp on the directory
          </li>
        </ul>
        Pending-bill cards on the splash page show a "Last verified" date so you
        know how fresh the information is.
      </>
    ),
  },
  {
    q: 'What about other states? Are similar laws coming?',
    a: (
      <>
        New Jersey is the first state to require insurance for e-bikes — but
        there's a small wave of related activity elsewhere:
        <ul className="mt-3 space-y-2 list-disc pl-5">
          <li>
            <strong>California</strong> — AB 1942 would have required DMV
            registration and license plates for Class 2 and Class 3 e-bikes,
            but it stalled: held in committee on the Appropriations suspense
            file (May 14, 2026).
          </li>
          <li>
            <strong>Hawaii</strong> — HB 2021 (HD2 SD2 CD1) passed both chambers
            and was left off Governor Green's June 2026 intent-to-veto list, so
            it becomes law by July 15, 2026. $30 one-time registration for all
            e-bikes; higher-speed class restricted from public roads.
          </li>
          <li>
            <strong>Illinois</strong> — the e-bike framework first rode on SB
            3336, but that bill stalled at Senate concurrence (its May 29, 2026
            concurrence vote was never taken) and is dead for the session. The
            final language was carried by SB 3484, which passed both chambers on
            June 1, 2026 (House 84-16; Senate 48-7) and now awaits Governor
            Pritzker. Despite news reports, it does NOT require a license,
            registration, or insurance for normal e-bikes — for Class 1/2/3 it
            adds only a minimum riding age (15, or 16 for Class 3). Those
            vehicle rules apply only to devices over 28 mph (or over 750 W),
            which Illinois already treats as motor-driven cycles. Effective
            January 1, 2027 if signed.
          </li>
          <li>
            <strong>Massachusetts</strong> — S 3077 (Ride Safe Act), filed by
            Governor Healey May 4, 2026. Speed-based tier framework. Despite the
            press framing, the bill text does NOT mandate registration or
            insurance for any e-bike — those are left to future Registrar of
            Motor Vehicles rulemaking. For Class 3 (21–30 mph) it mandates only
            a helmet and a minimum age of 16; Class 1 & 2 (≤20 mph) are
            unaffected. In the Joint Committee on Transportation (hearing held
            May 28, 2026).
          </li>
          <li>
            <strong>New York</strong> — S08573 (RIDERS Act). Would require
            registration and operator licensure for all e-bikes, e-scooters, and
            e-skateboards. In Senate Transportation Committee.
          </li>
        </ul>
        See the splash page state grid for current status on each. The engine is
        multi-state-ready by design — when a bill passes, adding a compliance
        tool for it is a data change, not a rewrite.
      </>
    ),
  },
  {
    q: "What about Florida's recent e-bike bill?",
    a: (
      <>
        Florida's CS/SB 382 (and companion HB 243) passed both chambers but was{' '}
        <strong>vetoed by Governor DeSantis on June 25, 2026</strong>, so it
        never became law. <strong>You may have heard it would require a Class 3
        license — that requirement was removed before final passage anyway.</strong>{' '}
        Even as passed it did NOT add license, registration, or insurance for any
        e-bike class. What the vetoed bill would have done:
        <ul className="mt-3 space-y-2 list-disc pl-5">
          <li>10 mph speed limit on sidewalks when pedestrians are within 50 ft</li>
          <li>Audible signal required before passing pedestrians</li>
          <li>Creates a Micromobility Device Safety Task Force (report Oct 2026)</li>
          <li>Statewide e-bike crash data collection</li>
        </ul>
        With the veto, none of these took effect — and none was a license,
        registration, or insurance requirement to begin with, which is why this
        tool doesn't include a Florida compliance checker.
      </>
    ),
  },
  {
    q: 'What if the law amends? Bike advocates are pushing for changes.',
    a: (
      <>
        The engine is built so amendments are a data update — not a rewrite. The
        statute is stored as effective-dated data; when rules change, an updated
        entry drops in and the engine routes new visitors through the new rules.
        The "Last verified" timestamps on every card show how fresh the
        information is.
        <br /><br />
        <strong>NJ specifically:</strong> A2093 and S3156 are pending NJ bills
        that would extend the insurance + registration requirements to low-speed
        electric bicycles too — closing the current "low-speed exemption" that
        this tool relies on. Both are in their respective Transportation
        Committees. Most committee bills die there, but worth knowing.
      </>
    ),
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// New Jersey questions — state-specific to S4834
// ─────────────────────────────────────────────────────────────────────────────

const NJ_QUESTIONS: ReadonlyArray<QA> = [
  {
    q: 'What is S4834?',
    a: (
      <>
        New Jersey Senate Bill <strong>S4834 / P.L.2025, c.285</strong>, signed by
        outgoing Governor Murphy on January 19, 2026. It updates how electric
        bicycles are regulated — defining three categories and assigning
        different combinations of license, registration, and insurance
        requirements to each. Compliance deadline is{' '}
        <strong>July 19, 2026</strong>. New Jersey is the first state in the U.S.
        to require all three of those for any e-bike category.
      </>
    ),
  },
  {
    q: "What's the difference between low-speed electric, motorized, and electric motorized bicycles?",
    a: (
      <>
        S4834 creates three categories with sharply different rules:
        <ul className="mt-3 space-y-2 list-disc pl-5">
          <li>
            <strong>Low-speed electric bicycle</strong> — pedal-assist only, motor
            cuts at 20 mph. Needs a license and registration.{' '}
            <em>Insurance is not required under the bill.</em>
          </li>
          <li>
            <strong>Motorized bicycle</strong> — has a throttle, or assists past
            20 mph up to 28 mph, motor ≤750 W. Needs license + registration{' '}
            <em>+ insurance</em>.
          </li>
          <li>
            <strong>Electric motorized bicycle</strong> — the statute defines
            this as a motor &gt;750 W <em>and</em> an assisted speed &gt;28 mph.{' '}
            <strong>Reclassified as a motorcycle</strong> under New Jersey law —
            motorcycle license, registration, and insurance rules apply instead.
            This tool is deliberately conservative: a bike that crosses only one
            of those thresholds (very powerful but ≤28 mph, or ≤750 W but faster
            than 28 mph) doesn't fit any other category cleanly, so it's routed
            here too rather than under-warning you.
          </li>
        </ul>
      </>
    ),
  },
  {
    q: 'I have a Class 3 e-bike (pedal-assist 21–28 mph). Which category am I?',
    a: (
      <>
        Honestly: there's a real statutory ambiguity here. The bill's "motorized
        bicycle" sub-definitions explicitly cover (a) gas helper motors at 21–28
        mph and (b) electric <em>throttle</em> bikes up to 28 mph — but a Class 3
        e-bike is electric and <em>pedal-assist only</em> at 21–28 mph, which
        doesn't cleanly fit any sub-type. This tool reads it conservatively as a
        motorized bicycle (the more restrictive interpretation, so you don't
        accidentally ride uninsured). Cycling advocates have argued it should
        remain in the low-speed-electric bucket. Until the bill is amended or a
        court clarifies, ask your insurance agent before relying on either
        reading.
      </>
    ),
  },
  {
    q: "Why doesn't my homeowners or renters policy cover my e-bike?",
    a: (
      <>
        Most standard homeowners and renters policies have a{' '}
        <strong>motorized-vehicle exclusion</strong>. As soon as a bike has a
        motor, it's likely excluded from the policy's liability and property
        protection. Some carriers offer a rider or endorsement that extends
        coverage to e-bikes, but you have to ask explicitly and confirm in
        writing — and most do not bring coverage anywhere near the $35k / $70k /
        $25k statutory minimums S4834 requires for motorized bicycles. Don't
        assume; verify with your carrier.
      </>
    ),
  },
  {
    q: 'When is the compliance deadline?',
    a: (
      <>
        <strong>July 19, 2026.</strong> The bill took effect on January 19, 2026
        with a six-month grace period. Registration and licensing fees are{' '}
        <em>waived</em> through January 19, 2027, so the actual out-of-pocket
        cost to comply in 2026 is just insurance (for motorized bicycle riders).
        <br />
        <AddToCalendarLink />
      </>
    ),
  },
]

export function Faq() {
  return (
    <section
      id="faq"
      className="mx-auto max-w-3xl px-6 pt-12 pb-12 sm:pt-16 sm:pb-16"
    >
      <div className="text-center">
        <span className="eyebrow">FAQ</span>
        <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
          Common questions, direct answers.
        </h2>
      </div>

      <FaqGroup label="General" items={GENERAL} />
      <FaqGroup label="New Jersey · S4834" items={NJ_QUESTIONS} className="mt-12" />
    </section>
  )
}

function FaqGroup({
  label,
  items,
  className,
}: {
  label: string
  items: ReadonlyArray<QA>
  className?: string
}) {
  return (
    <div className={className}>
      <p
        className="mt-10 mb-4 text-xs uppercase tracking-[0.18em]"
        style={{ color: 'var(--color-ink-faint)' }}
      >
        {label}
      </p>
      <div className="space-y-3">
        {items.map((item, i) => (
          <details
            key={i}
            className="group rounded-lg border border-white/5 transition"
            style={{ background: 'rgba(255, 255, 255, 0.025)' }}
          >
            <summary
              className="flex cursor-pointer items-center justify-between gap-4 p-5 text-left font-display text-base font-semibold sm:text-lg"
              style={{ listStyle: 'none' }}
            >
              {item.q}
              <span
                className="shrink-0 text-xl transition-transform group-open:rotate-45"
                style={{ color: 'var(--color-brand-soft)' }}
              >
                +
              </span>
            </summary>
            <div className="px-5 pb-5 text-sm leading-relaxed text-[var(--color-ink-soft)]">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}
