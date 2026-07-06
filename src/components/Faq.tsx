import { useEffect, useRef, useState } from 'react'
import {
  buildIcs,
  daysUntil,
  downloadIcs,
  NJ_S4834_DEADLINE_EVENT,
} from '../lib/calendar'

type QA = { readonly q: string; readonly a: React.ReactNode }

function AddToCalendarLink() {
  // Client-side only: the prerendered HTML always includes the link (the
  // pre-deadline state); once the clock says the deadline has passed, the
  // client render drops it — a calendar event in the past helps no one.
  const [past, setPast] = useState(false)
  useEffect(() => {
    // Post-hydration sync (intentional): the prerendered HTML must always ship
    // the link — the server can't know "now" — and we only drop it client-side
    // once the deadline has passed. Doing this during render would hydration-
    // mismatch, so it has to run in an effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPast(daysUntil(NJ_S4834_DEADLINE_EVENT.date) <= 0)
  }, [])
  if (past) return null
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
        New Jersey is the first state to require insurance for e-bikes, and{' '}
        <strong>Hawaii</strong> is the second state with real e-bike
        requirements — HB 2021 (a $30 registration for every e-bike) becomes
        law by July 15, 2026 and has its own checker at the top of this page.
        Elsewhere, there's a wave of related activity:
        <ul className="mt-3 space-y-2 list-disc pl-5">
          <li>
            <strong>California</strong> — AB 1942 would have required DMV
            registration and license plates for Class 2 and Class 3 e-bikes,
            but it stalled: held in committee on the Appropriations suspense
            file (May 14, 2026).
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
        <strong>NJ specifically:</strong> Two identical bill pairs — A2093/S3156
        and A3697/S2070 — would close the one exemption low-speed riders still
        have, by requiring <em>insurance</em> for low-speed electric bicycles
        too (registration and licensing are already required under S4834) —
        A2093/S3156 would extend the requirements to low-speed electric
        scooters as well. All four
        have sat in committee without a hearing since mid-January. Separately,
        S4524 (introduced June 26, 2026) would extend the helmet requirement to
        low-speed e-bike riders of <em>all</em> ages, not just under-17s. Most
        committee bills die there, but worth knowing.
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
            here too rather than under-warning you — and the result is flagged as
            a statutory-gap judgment call, not a certainty, so you can confirm the
            narrower reading with the MVC and your insurer.
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
    q: 'When is the compliance deadline? What if it already passed?',
    a: (
      <>
        <strong>July 19, 2026.</strong> The bill took effect on January 19, 2026
        with a six-month grace period. Registration and licensing fees are{' '}
        <em>waived</em> through January 19, 2027, so the actual out-of-pocket
        cost to comply in 2026 is just insurance (for motorized bicycle riders).
        <br />
        <br />
        <strong>Reading this after July 19?</strong> Nothing in the statute
        stops you from coming into compliance late — register, get licensed,
        and (for motorized bicycles) get covered as soon as you can. The fee
        waiver still applies through January 19, 2027. The longer you ride
        non-compliant, the longer you're exposed to tickets and, after a crash,
        personal liability.
        <br />
        <br />
        <strong>Practical timing note:</strong> MVC e-bike registration is done
        in person, by appointment (form BA-49EB, at a Vehicle Center). The
        e-bike <em>license</em> takes longer: you get a permit (form BA-208,
        exam fee waived until January 2027), then the road test is scheduled
        20–45 days after the permit validates — so a license realistically
        extends past July 19 if you're starting now. Do the registration and
        insurance pieces first.
        <br />
        <AddToCalendarLink />
      </>
    ),
  },
  {
    q: "What are the penalties if I'm caught riding non-compliant?",
    a: (
      <>
        Smaller than most people assume — S4834 itself sets almost no operating
        penalties, so enforcement runs through New Jersey's existing moped
        statutes. For low-speed electric and motorized bicycles that means
        municipal-court fines, not car-level punishment:
        <ul className="mt-3 space-y-2 list-disc pl-5">
          <li>
            <strong>Unregistered</strong> — up to $100 per offense (the moped
            act's catch-all penalty, C.39:4-14.3t).
          </li>
          <li>
            <strong>Uninsured motorized bicycle</strong> — up to $200, up to 15
            days, or both (C.39:4-14.3b). The much harsher uninsured-vehicle
            statute you may have read about ($300–$1,000 + license suspension,
            N.J.S.A. 39:6B-2) is written for <em>motor vehicles</em> — which
            low-speed and motorized bicycles legally are not.
          </li>
          <li>
            <strong>No license</strong> — a municipal fine, roughly $50–$200
            depending on the provision charged (the licensing act has no
            penalty section of its own).
          </li>
          <li>
            <strong>Documents not on you while riding</strong> — up to $50, and
            the judge can dismiss it if you show documents that were valid on
            the day you were charged (C.39:4-14.3(e)).
          </li>
          <li>
            <strong>Under 17</strong> — a second violation suspends your riding
            privilege for 30 days.
          </li>
        </ul>
        The big exception: a bike over 750 W or 28 mph is legally a{' '}
        <strong>motorcycle</strong>, and the full motor-vehicle penalty stack
        applies — including 39:6B-2's $300–$1,000 fine, community service, and
        possible license suspension for riding uninsured. Separately, the MVC
        can suspend or revoke an e-bike registration for violations, and
        knowingly submitting false proof of ownership is a fourth-degree crime.
        <br />
        <br />
        How aggressively any of this gets enforced varies by town — several
        departments signaled education-first during the grace period and
        summonses after July 19. Either way, late compliance beats rolling the
        dice: registration stays open, and fees stay waived through January 19,
        2027.
      </>
    ),
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Hawaii questions — HB 2021 (HD2 SD2 CD1), verified against the CD1 text
// ─────────────────────────────────────────────────────────────────────────────

const HI_QUESTIONS: ReadonlyArray<QA> = [
  {
    q: "What does Hawaii's HB 2021 actually require?",
    a: (
      <>
        One thing, mainly: <strong>registration</strong>. Every e-bike (Class
        1, 2, and 3) gets a one-time <strong>$30</strong> registration with
        your county's director of finance — and once the law is in effect, an
        unregistered e-bike may not be ridden on any public roadway, sidewalk,
        or bicycle facility. Riding unregistered risks a citation or temporary
        impoundment (redeeming an impounded bike costs the fee plus a $25
        penalty; unclaimed bikes can be auctioned after 10 days).
        <ul className="mt-3 space-y-2 list-disc pl-5">
          <li>
            <strong>No license and no insurance</strong> — the bill says
            explicitly that nothing in it requires insurance for a classified,
            road-legal e-bike.
          </li>
          <li>
            <strong>Under 16?</strong> Class 2 and Class 3 e-bikes require
            direct supervision — a parent, guardian, or adult 18+ physically
            present. Class 1 has no age restriction at all.
          </li>
          <li>
            <strong>Helmets under 18</strong> (raised from under 16) on any
            bicycle, including all e-bike classes. $25 fine, chargeable to the
            parent.
          </li>
          <li>
            <strong>Sidewalks are OK at up to 10 mph</strong> for all three
            classes — except in business districts or where a county ordinance
            says otherwise.
          </li>
          <li>
            <strong>High-speed devices</strong> (motor over 750 W{' '}
            <em>and</em> capable of more than 28 mph) are banned from every
            public surface — roads, bike lanes, paths, and sidewalks — at any
            age, and can be seized as non-road-legal.
          </li>
        </ul>
      </>
    ),
  },
  {
    q: 'When does HB 2021 take effect? Is there a grace period?',
    a: (
      <>
        It becomes law <strong>on or before July 15, 2026</strong> — it was
        left off the Governor's June 26 intent-to-veto list, and under
        Hawaii's constitution a bill omitted from that list cannot be vetoed.
        <br />
        <br />
        <strong>There is no grace period.</strong> Unlike New Jersey's
        six-month runway, Hawaii's riding provisions — including the
        you-can't-ride-unregistered rule — take effect the day the bill
        becomes law. Only the retailer labeling and point-of-sale disclosure
        duties are delayed (120 days). If you ride in Hawaii, registering
        before mid-July is the move.
      </>
    ),
  },
  {
    q: 'How do I register my e-bike in Hawaii?',
    a: (
      <>
        Through your <strong>county's director of finance</strong> — Hawaii
        registers bicycles at the county level, and HB 2021 plugs e-bikes into
        that same system at $30, one-time. In Honolulu that means a Satellite
        City Hall or the Kapālama Driver Licensing Center (by appointment) or
        registration by mail, with proof of ownership and the bike's wattage
        on the application; you get a decal for the frame. Hawai'i County,
        Maui, and Kaua'i run their own equivalents through their finance/DMV
        offices. Bike shops often file the paperwork for you at purchase.
        County pages may still describe the pre-HB 2021 rules until guidance
        catches up — the $30 e-bike fee and the register-before-you-ride rule
        are what the new law says.
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
      <FaqGroup label="Hawaii · HB 2021" items={HI_QUESTIONS} className="mt-12" />
    </section>
  )
}

// Smooth open/close on the native <details>, via the Web Animations API.
// CSS can't animate to height:auto, and the pure-CSS ::details-content approach
// is blocked by Tailwind here — so we animate the element's height by hand:
// measure current → target, run the animation, then set `open` and clear the
// inline height. Open is slower than close (500 / 200ms) so the reveal feels
// deliberate and the dismiss gets out of the way. Falls back to the native
// instant toggle under prefers-reduced-motion.
function FaqItem({ item }: { item: QA }) {
  const ref = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const summary = el.querySelector<HTMLElement>('summary')
    const content = el.querySelector<HTMLElement>('.faq-content')
    if (!summary || !content) return

    let animation: Animation | null = null
    let isClosing = false
    let isExpanding = false

    const reduceMotion = () =>
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

    const finish = (open: boolean) => {
      el.open = open
      animation = null
      isClosing = false
      isExpanding = false
      el.style.height = ''
      el.style.overflow = ''
    }

    const shrink = () => {
      isClosing = true
      const start = `${el.offsetHeight}px`
      const end = `${summary.offsetHeight}px`
      animation?.cancel()
      animation = el.animate({ height: [start, end] }, { duration: 200, easing: 'ease' })
      animation.onfinish = () => finish(false)
      animation.oncancel = () => {
        isClosing = false
      }
    }

    const expand = () => {
      isExpanding = true
      const start = `${el.offsetHeight}px`
      const end = `${summary.offsetHeight + content.offsetHeight}px`
      animation?.cancel()
      animation = el.animate({ height: [start, end] }, { duration: 500, easing: 'ease' })
      animation.onfinish = () => finish(true)
      animation.oncancel = () => {
        isExpanding = false
      }
    }

    const openItem = () => {
      el.style.height = `${el.offsetHeight}px`
      el.open = true
      requestAnimationFrame(expand)
    }

    const onClick = (e: MouseEvent) => {
      if (reduceMotion()) return // let the native instant toggle happen
      e.preventDefault()
      el.style.overflow = 'hidden'
      if (isClosing || !el.open) openItem()
      else if (isExpanding || el.open) shrink()
    }

    summary.addEventListener('click', onClick)
    return () => {
      summary.removeEventListener('click', onClick)
      animation?.cancel()
    }
  }, [])

  return (
    <details
      ref={ref}
      className="faq-item group rounded-lg border border-white/5 transition"
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
      <div className="faq-content px-5 pb-5 text-sm leading-relaxed text-[var(--color-ink-soft)]">
        {item.a}
      </div>
    </details>
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
          <FaqItem key={i} item={item} />
        ))}
      </div>
    </div>
  )
}
