/**
 * RENDERED-COPY GUARD
 *
 * The engine suite checks verdicts. It cannot see what the rider actually
 * reads, and three copy defects shipped to production behind a green suite:
 *
 *   1. "Register your bike with the your county's director of finance"
 *      (Hawaii) and "registered with NJ Motor Vehicle Commission" (New Jersey,
 *      no article) — one hardcoded "the" in a component, two jurisdictions,
 *      opposite failures.
 *   2. "We classified it conservatively as class-3 ... would be class-2" —
 *      every Hawaii category fell through a `?? slug` lookup that only had
 *      New Jersey's four entries.
 *   3. "Accepted: basic-drivers or motorized-bicycle." — raw enum ids joined
 *      straight into a sentence.
 *
 * All three are the same failure: a value from data reaching a rider without
 * being translated for the sentence around it. So this file renders the real
 * component for BOTH statutes across every verdict path and asserts on the
 * flattened prose. Anything a rider can read, a test reads first.
 */
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Verdict } from './Verdict'
import { checkCompliance } from '../engine/compliance'
import { STATUTES } from '../data/statutes'
import {
  bikeCategoryProse,
  licenseKindProse,
  mph,
  usd,
  watts,
  years,
} from '../types'
import type {
  BikeProfile,
  ExistingPolicy,
  LicenseKind,
  StatutoryRequirement,
  ThrottleKind,
} from '../types'

function bike(
  throttle: ThrottleKind,
  speed: number,
  w: number,
  extra: Partial<BikeProfile> = {},
): BikeProfile {
  return {
    throttle,
    topMotorAssistedSpeed: mph(speed),
    motorWatts: watts(w),
    isRentalFromSharedSystem: false,
    isRegistered: false,
    ...extra,
  }
}

const SPECIALTY: ExistingPolicy = {
  kind: 'specialty-ebike',
  coverage: {
    bodilyInjuryPerPerson: usd(15_000),
    bodilyInjuryPerAccident: usd(30_000),
    propertyDamage: usd(5_000),
    pip: null,
  },
}

/**
 * Every meaningfully different verdict shape, per statute. Speeds and wattages
 * are chosen to hit each classification branch including the ambiguity paths,
 * which is where the slug leaks lived.
 */
const CASES: ReadonlyArray<{
  name: string
  b: BikeProfile
  age: number
  license: LicenseKind
  policies: ReadonlyArray<ExistingPolicy>
}> = [
  { name: 'no motor', b: bike('none', 0, 0), age: 35, license: 'basic-drivers', policies: [] },
  { name: 'low-speed unregistered', b: bike('pedal-assist-only', 20, 500), age: 35, license: 'basic-drivers', policies: [] },
  { name: 'low-speed registered', b: bike('pedal-assist-only', 20, 500, { isRegistered: true }), age: 35, license: 'basic-drivers', policies: [] },
  { name: 'rental', b: bike('pedal-assist-only', 20, 500, { isRentalFromSharedSystem: true }), age: 22, license: 'basic-drivers', policies: [] },
  { name: 'under-age operator', b: bike('pedal-assist-only', 20, 500), age: 12, license: 'none', policies: [] },
  { name: 'young operator (supervision band)', b: bike('throttle', 20, 500, { isRegistered: true }), age: 14, license: 'none', policies: [] },
  { name: 'throttle, no license, no policy', b: bike('throttle', 25, 750), age: 35, license: 'none', policies: [] },
  { name: 'throttle, insured + registered', b: bike('throttle', 25, 750, { isRegistered: true }), age: 35, license: 'basic-drivers', policies: [SPECIALTY] },
  { name: 'class 3 / ambiguity band', b: bike('pedal-assist-only', 25, 600), age: 35, license: 'basic-drivers', policies: [] },
  { name: 'over both thresholds', b: bike('throttle', 32, 1000), age: 35, license: 'basic-drivers', policies: [] },
  { name: 'over watts only (single-threshold gap)', b: bike('throttle', 22, 1000), age: 35, license: 'basic-drivers', policies: [] },
  { name: 'over speed only (single-threshold gap)', b: bike('pedal-assist-only', 32, 500), age: 35, license: 'basic-drivers', policies: [] },
]

/** Render the real component and flatten it to what a rider would read. */
function renderVerdictText(statute: StatutoryRequirement, c: (typeof CASES)[number]): string {
  const compliance = checkCompliance({
    bike: c.b,
    operator: { age: years(c.age), license: c.license },
    policies: c.policies,
    statute,
  })
  const html = renderToStaticMarkup(
    <Verdict compliance={compliance} bike={c.b} statute={statute} onReset={() => {}} />,
  )
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

const ALL_RENDERS: Array<{ label: string; text: string }> = []
for (const [code, statute] of Object.entries(STATUTES)) {
  for (const c of CASES) {
    ALL_RENDERS.push({ label: `${code} / ${c.name}`, text: renderVerdictText(statute, c) })
  }
}

describe('rendered verdict copy', () => {
  it('covers both live statutes', () => {
    expect(Object.keys(STATUTES).sort()).toEqual(['HI', 'NJ'])
    expect(ALL_RENDERS).toHaveLength(Object.keys(STATUTES).length * CASES.length)
    for (const r of ALL_RENDERS) expect(r.text.length).toBeGreaterThan(50)
  })

  // Defect 2 and 3: an internal identifier reaching the rider verbatim.
  //
  // Scoped to the sentences the APP COMPOSES, not the whole page. Verbatim
  // statutory quotes legitimately contain hyphenated compounds that collide
  // with the enum ids ("your motorized-bicycle policy must carry pedestrian
  // PIP"), and flagging those would train everyone to ignore this test.
  const SLUGS = [
    ...Object.keys(bikeCategoryProse),
    ...Object.keys(licenseKindProse),
  ].filter((s) => s.includes('-'))

  /** The composition seams: prose the app builds by interpolating data. */
  const SEAMS: ReadonlyArray<{ what: string; re: RegExp }> = [
    { what: 'classification callout', re: /We classified it conservatively as[^.]*\./ },
    { what: 'license gap', re: /Accepted:[^.]*\./ },
    { what: 'obtain-license remedy', re: /Obtain (?:one of: )?[^.]*\./ },
    { what: 'registration gap', re: /Your bike must be registered with[^.]*\./ },
    { what: 'register remedy', re: /Register your bike with[^.]*\./ },
    { what: 'verdict disclaimer', re: /Confirm your situation with[^.]*\./ },
  ]

  for (const { label, text } of ALL_RENDERS) {
    it(`${label}: composed sentences leak no internal identifier`, () => {
      for (const seam of SEAMS) {
        const sentence = text.match(seam.re)?.[0]
        if (!sentence) continue // this verdict doesn't render that seam
        for (const slug of SLUGS) {
          expect(
            sentence.includes(slug),
            `the ${seam.what} contains the raw identifier "${slug}" instead of its prose label:\n  ${sentence}`,
          ).toBe(false)
        }
      }
    })

    // Defect 1: an article hardcoded around an interpolated name.
    it(`${label}: has no doubled article`, () => {
      const doubled = text.match(/\b(the|your|a|an) (the|your|a|an)\b/i)
      expect(doubled?.[0] ?? null).toBeNull()
    })

    it(`${label}: never says "with" followed by an unarticled proper name`, () => {
      // "registered with NJ Motor Vehicle Commission" — the authority name has
      // to arrive sentence-ready, article included.
      const bad = text.match(/\bregistered with [A-Z]/)
      expect(bad?.[0] ?? null).toBeNull()
    })
  }
})

describe('label maps stay total', () => {
  // The real guard is the type system: bikeCategoryProse and licenseKindProse
  // are Record<Union, string>, so a new member fails the build. This asserts
  // the values are usable prose, which types cannot express.
  it('every bike category has non-slug prose', () => {
    for (const [key, prose] of Object.entries(bikeCategoryProse)) {
      expect(prose, key).not.toBe(key)
      // Lowercase because these are used mid-sentence, and spaced because a
      // slug reads as machine output. ("low-speed electric bicycle" keeps its
      // one legitimate hyphen, so check for the slug shape, not for hyphens.)
      expect(prose, key).toMatch(/^[a-z]/)
      expect(prose, key).toContain(' ')
    }
  })

  it('every license kind has non-slug prose', () => {
    for (const [key, prose] of Object.entries(licenseKindProse)) {
      expect(prose, key).not.toBe(key)
      expect(prose, key).toMatch(/^[a-z]/)
    }
  })
})

describe('registration authority names are sentence-ready', () => {
  for (const [code, statute] of Object.entries(STATUTES)) {
    it(`${code}: reads correctly in all three sentences that use it`, () => {
      const name = statute.registration.authority.name
      expect(name).toMatch(/^(the|your|a|an) /)
      for (const sentence of [
        `Your bike must be registered with ${name}.`,
        `Register your bike with ${name}.`,
        `This bike is already registered with ${name}`,
      ]) {
        expect(sentence).not.toMatch(/\b(the|your|a|an) (the|your|a|an)\b/i)
      }
    })
  }
})
