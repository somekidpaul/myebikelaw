import { useEffect, useRef, useState } from 'react'
import {
  buildIcs,
  daysUntil,
  downloadIcs,
  NJ_S4834_DEADLINE_EVENT,
} from '../lib/calendar'

export type QA = { readonly q: string; readonly a: React.ReactNode }

// Stable, human-readable anchor from a question so each FAQ entry is
// deep-linkable (e.g. #faq-do-all-e-bikes-need-insurance).
function slugify(q: string): string {
  return (
    'faq-' +
    q
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60)
  )
}

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
            sources (e.g., N.J.A.C. 11:3-11.1, the regulation that fixes NJ's
            $15k/$30k/$5k motorized-bicycle limits)
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
        requirements — HB 2021 (a $30 registration for every e-bike) took
        effect July 15, 2026 (Act 259) and has its own checker at the top of
        this page.
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
            Governor Healey May 4, 2026, was <strong>sent to study</strong> on
            July 22, 2026: the Joint Committee on Transportation reported it out
            to a study order (S 3194) under Joint Rule 10, which in
            Massachusetts practice means the bill does not advance this session.
            It would have to be refiled to move again. Even as filed, and
            despite the press framing, the bill text did NOT mandate
            registration or insurance for any e-bike — those were left to future
            Registrar of Motor Vehicles rulemaking. For Class 3 (21–30 mph) it
            required only a helmet and a minimum age of 16; Class 1 & 2 (≤20
            mph) were unaffected.
          </li>
          <li>
            <strong>New York</strong> — S08573 (RIDERS Act). Would require
            registration and operator licensure for all e-bikes, e-scooters, and
            e-skateboards. In Senate Transportation Committee.
          </li>
          <li>
            <strong>Utah</strong> — HB 381 (Electric Mobility Device
            Amendments) was signed March 24, 2026 and took effect May 6, 2026.
            Despite "new e-bike law" headlines, it does NOT add a license,
            registration, or insurance requirement for normal e-bikes. It keeps
            the Class 1/2/3 (≤750 W) framework and excludes an "electric
            assisted bicycle" from the "motor vehicle" definition; only
            reclassified "high power electric devices" and "electric
            motorcycles" (over 750 W, or capable of over 20 mph on the motor
            alone — including a tampered e-bike) fall under motorcycle rules,
            which already require all three. Utah's driver-licensing statute
            says so outright: a rider 16 or older may ride an e-bike on a
            highway without a driver license, a motorcycle endorsement, or a
            safety certificate. What HB 381 does add for ordinary riders is
            safety rules, not vehicle paperwork: a helmet under 21 on highways
            and a ban on riding while drinking, both in effect now, and then
            from May 5, 2027 a minimum age of 8 to ride on a highway plus a
            rule that riders under 16 either earn a safety certificate (online,
            fee capped at $10) or ride under direct adult supervision.
          </li>
          <li>
            <strong>Washington</strong> — ESSB 6110 (Chapter 159, Laws of 2026)
            took effect June 11, 2026. Despite the "new e-bike law" headlines, it
            does NOT add a license, registration, or insurance requirement for
            normal e-bikes. It keeps the Class 1/2/3 (≤750 W) framework and only
            narrows the definition, so a device that can exceed 20 mph on its
            motor alone — or is built to be easily derestricted — is no longer an
            "electric-assisted bicycle" and instead falls under Washington's
            existing motorcycle/moped rules, which already require all three.
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
  {
    q: 'What do you do with my answers? Do you track me?',
    a: (
      <>
        <strong>Your answers never leave your browser.</strong> The compliance
        engine is plain JavaScript running on your device. Nothing you type
        about your bike, your age, your license, or your insurance is
        transmitted to a server, stored, or sold. There is no account, no
        database, and no ad tech on this site. The "copy share link" button
        encodes your answers into the URL so <em>you</em> can share the result
        if you want to, and that link only goes wherever you paste it.
        <br /><br />
        For traffic, this site uses <strong>Cloudflare Web Analytics</strong>,
        which counts page views. Cloudflare states that it uses no client-side
        state (no cookies, no localStorage) and does not track visitors over
        time via IP address, User Agent, or any other immutable attribute. It
        tells us that a page was viewed. It does not tell us who you are, and
        it cannot follow you to another site.
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
    q: 'How much insurance do I actually need for a motorized bicycle?',
    a: (
      <>
        <strong>$15,000 / $30,000 / $5,000</strong>. That's bodily injury per
        person, bodily injury per accident, and property damage. Your policy
        must also provide personal injury protection for pedestrians your bike
        injures, which your insurer builds in at the statutory schedule, so
        there's no limit for you to choose there.
        <br />
        <br />
        Where those numbers come from matters, because they are widely
        misreported. S4834 itself names no dollar figures. It leans on{' '}
        <strong>C.39:4-14.3e</strong>, which requires a motorized-bicycle
        liability policy and then hands the amounts to the Commissioner of
        Insurance "by regulation." That regulation is{' '}
        <strong>N.J.A.C. 11:3-11.1</strong>, and it sets $15k / $30k / $5k for
        any policy on "a motorized bicycle as defined in N.J.S.A. 39:1-1."
        <br />
        <br />
        You will see the higher figures <strong>$35k / $70k / $25k</strong>{' '}
        quoted for e-bikes in a lot of places. Those are New Jersey's standard{' '}
        <em>automobile</em> minimums under N.J.S.A. 39:6B-1, which rose on
        January 1, 2026. They apply to cars, not to motorized bicycles. DOBI's
        bulletin announcing the increase is addressed to auto insurers and says
        nothing about mopeds or motorized bicycles. This site previously quoted
        the auto figures; that was our error, and it overstated what you need.
        Buying more coverage than the minimum is still a reasonable choice, but
        it isn't what the law asks of you.
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
        writing, and an endorsement that does exist still has to meet the $15k /
        $30k / $5k liability minimums, and carry pedestrian PIP, before it
        satisfies S4834 for a motorized bicycle. Don't assume; verify with your
        carrier.
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
        The big exception: a bike over 750 W <em>and</em> capable of more than
        28 mph is legally a <strong>motorcycle</strong>, and the full
        motor-vehicle penalty stack applies, including 39:6B-2's $300–$1,000
        fine, community service, and possible license suspension for riding
        uninsured. (The statute's definition is conjunctive, so both thresholds
        have to be crossed. A bike over only one of them sits in the statutory
        gap described in the classification answer above: this tool routes it to
        the motorcycle rules so you are not under-warned, but that is a
        conservative reading rather than settled law.) Separately, the MVC
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
    q: 'When did HB 2021 take effect? Is there a grace period?',
    a: (
      <>
        It's already in effect. Governor Green signed HB 2021 into law on{' '}
        <strong>July 15, 2026</strong> as <strong>Act 259</strong>.
        <br />
        <br />
        <strong>There is no grace period.</strong> Unlike New Jersey's
        six-month runway, Hawaii's riding provisions — including the
        you-can't-ride-unregistered rule — took effect the day the bill was
        signed. Only the retailer labeling and point-of-sale disclosure duties
        are delayed (120 days). If you ride in Hawaii, registering your e-bike
        is now the move.
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

// Single source of truth for the FAQ, in render order. The visible accordion
// AND the FAQPage JSON-LD are both built from this — the JSON-LD is generated
// at build time from these exact entries (see entry-server renderFaqJsonLd +
// scripts/prerender.mjs), so the structured data can never drift from what a
// visitor actually reads. Colocated with the component that renders it on
// purpose; the build-time JSON-LD generator is the only other consumer.
// eslint-disable-next-line react-refresh/only-export-components
export const ALL_FAQ: ReadonlyArray<QA> = [
  ...GENERAL,
  ...NJ_QUESTIONS,
  ...HI_QUESTIONS,
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

  const id = slugify(item.q)
  return (
    <details
      ref={ref}
      id={id}
      className="faq-item group rounded-lg border border-white/5 transition"
      style={{ background: 'rgba(255, 255, 255, 0.025)' }}
    >
      <summary
        className="flex cursor-pointer items-center justify-between gap-4 p-5 text-left font-display text-base font-semibold sm:text-lg"
        style={{ listStyle: 'none' }}
      >
        {/* Real heading so screen-reader users can navigate questions via the
            rotor and Google reads them as headings. Reset the base heading
            styles so it looks identical to the previous plain text. */}
        <h4 className="m-0 font-[inherit] text-[length:inherit] font-semibold normal-case tracking-normal leading-snug">
          {item.q}
        </h4>
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
      <h3
        className="mt-10 mb-4 text-xs font-normal uppercase tracking-[0.18em]"
        style={{ color: 'var(--color-ink-faint)' }}
      >
        {label}
      </h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <FaqItem key={i} item={item} />
        ))}
      </div>
    </div>
  )
}
