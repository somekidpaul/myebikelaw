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

const ITEMS: ReadonlyArray<QA> = [
  {
    q: 'What is S4834?',
    a: (
      <>
        New Jersey Senate Bill <strong>S4834 / P.L.2025, c.285</strong>, signed by
        outgoing Governor Murphy on January 19, 2026. It updates how electric bicycles
        are regulated — defining three categories and assigning different combinations
        of license, registration, and insurance requirements to each. Compliance
        deadline is <strong>July 19, 2026</strong>. New Jersey is the first state in the
        U.S. to require all three of those for any e-bike category.
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
            <strong>Electric motorized bicycle</strong> — motor &gt;750 W{' '}
            <em>or</em> assist &gt;28 mph. <strong>Reclassified as a motorcycle</strong>{' '}
            under New Jersey law — motorcycle license, registration, and insurance
            rules apply instead.
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
        bicycle" sub-definitions explicitly cover (a) gas helper motors at 21–28 mph
        and (b) electric <em>throttle</em> bikes up to 28 mph — but a Class 3 e-bike is
        electric and <em>pedal-assist only</em> at 21–28 mph, which doesn't cleanly fit
        any sub-type. This tool reads it conservatively as a motorized bicycle (the
        more restrictive interpretation, so you don't accidentally ride uninsured).
        Cycling advocates have argued it should remain in the low-speed-electric
        bucket. Until the bill is amended or a court clarifies, ask your insurance
        agent before relying on either reading.
      </>
    ),
  },
  {
    q: "Why doesn't my homeowners or renters policy cover my e-bike?",
    a: (
      <>
        Most standard homeowners and renters policies have a{' '}
        <strong>motorized-vehicle exclusion</strong>. As soon as a bike has a motor,
        it's likely excluded from the policy's liability and property protection. Some
        carriers offer a rider or endorsement that extends coverage to e-bikes, but
        you have to ask explicitly and confirm in writing — and most do not bring
        coverage anywhere near the $35k / $70k / $25k statutory minimums S4834
        requires for motorized bicycles. Don't assume; verify with your carrier.
      </>
    ),
  },
  {
    q: 'When is the compliance deadline?',
    a: (
      <>
        <strong>July 19, 2026.</strong> The bill took effect on January 19, 2026 with
        a six-month grace period. Registration and licensing fees are{' '}
        <em>waived</em> through January 19, 2027, so the actual out-of-pocket cost to
        comply in 2026 is just insurance (for motorized bicycle riders).
        <br />
        <AddToCalendarLink />
      </>
    ),
  },
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
            The statute itself —{' '}
            <a
              href="https://pub.njleg.gov/Bills/2024/S5000/4834_R1a.HTM"
              target="_blank"
              rel="noopener noreferrer"
            >
              S4834 text from the NJ Legislature
            </a>
          </li>
          <li>
            The dollar minimums — official{' '}
            <a
              href="https://www.nj.gov/dobi/bulletins/blt25_06.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              NJ Department of Banking and Insurance bulletin
            </a>
          </li>
          <li>
            Compliance details —{' '}
            <a
              href="https://www.nj.gov/mvc/vehicletopics/ebike.htm"
              target="_blank"
              rel="noopener noreferrer"
            >
              NJ MVC e-bike requirements page
            </a>
          </li>
        </ul>
        Carrier information is curated by hand from each carrier's public product
        pages, with a "last verified" date stamp on the directory.
      </>
    ),
  },
  {
    q: 'What if the law amends? Bike advocates are pushing for changes.',
    a: (
      <>
        The engine is built so that amendments are a data update — not a rewrite. The
        statute is stored as effective-dated data; when the rules change, an updated
        entry gets dropped in and the engine routes new visitors through the new
        rules. The verdict date you see reflects the law as of the verification
        timestamp at the bottom of the page.
      </>
    ),
  },
  {
    q: 'What about other states? Are similar laws coming?',
    a: (
      <>
        New Jersey is the first state to require insurance for e-bikes. A small wave
        of related bills was introduced in early 2026 but none has passed yet:
        <ul className="mt-3 space-y-2 list-disc pl-5">
          <li>
            <strong>California</strong> — AB 1942 would require registration and
            license plates for Class 2 and Class 3 e-bikes. Currently in Appropriations.
          </li>
          <li>
            <strong>Hawaii</strong> — a bill near final vote would require a one-time
            $30 registration for all e-bikes.
          </li>
          <li>
            <strong>Florida</strong> — SB 382 / HB 243 would require a license for
            Class 3 e-bikes. Proposed effective date July 1, 2027.
          </li>
        </ul>
        This tool's engine is multi-state-ready by design — when one of those bills
        passes, adding it is a data change, not a rewrite.
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

      <div className="mt-10 space-y-3">
        {ITEMS.map((item, i) => (
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
    </section>
  )
}
