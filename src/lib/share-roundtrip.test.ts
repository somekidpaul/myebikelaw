/**
 * SHARE ROUND-TRIP GUARD
 *
 * The app writes the rider's answers into the URL and offers a "Copy share
 * link" button for exactly that URL. If the form can produce a value the
 * decoder rejects, the rider copies a link that opens the splash instead of
 * their result — and nothing in the app tells them.
 *
 * That shipped twice:
 *   - The age input allowed 0 while the decoder required a >= 1.
 *   - Speed/wattage bounds were only checked while the throttle question was
 *     answered "has a throttle". Answering it, typing 100 mph, then switching
 *     to "no motor" unmounted the inputs, bypassed both native validation and
 *     validate(), and encoded s=100 — past the decoder's max of 50.
 *
 * THE INVARIANT: everything FORM_BOUNDS permits must survive a round trip.
 * The decoder may be more permissive (it still accepts s=0 so links shared
 * before these bounds existed keep working); it must never be stricter.
 */
import { describe, expect, it } from 'vitest'
import { decodeAnswers, encodeAnswers, type SharedAnswers } from './share'
import { FORM_BOUNDS } from './field-bounds'
import { mph, usd, watts, years } from '../types'
import type { ExistingPolicy, LicenseKind, ThrottleKind } from '../types'

const THROTTLES: ReadonlyArray<ThrottleKind> = ['none', 'pedal-assist-only', 'throttle']
const LICENSES: ReadonlyArray<LicenseKind> = ['basic-drivers', 'motorized-bicycle', 'none']

function answers(o: {
  jurisdiction?: 'NJ' | 'HI'
  throttle?: ThrottleKind
  speed?: number
  watts?: number
  age?: number
  license?: LicenseKind
  rental?: boolean
  registered?: boolean
  policies?: ReadonlyArray<ExistingPolicy>
}): SharedAnswers {
  return {
    jurisdiction: o.jurisdiction ?? 'NJ',
    bike: {
      throttle: o.throttle ?? 'pedal-assist-only',
      topMotorAssistedSpeed: mph(o.speed ?? 20),
      motorWatts: watts(o.watts ?? 500),
      isRentalFromSharedSystem: o.rental ?? false,
      isRegistered: o.registered ?? false,
    },
    operator: { age: years(o.age ?? 35), license: o.license ?? 'basic-drivers' },
    policies: o.policies ?? [{ kind: 'none' }],
  }
}

/** encode -> decode must come back with the same answers, never null. */
function roundTrip(a: SharedAnswers): SharedAnswers {
  const qs = encodeAnswers(a)
  const back = decodeAnswers(qs)
  expect(back, `this URL does not decode: ?${qs}`).not.toBeNull()
  return back as SharedAnswers
}

describe('every value the form can produce survives the share round trip', () => {
  const { topSpeed, motorWatts, age, coverage } = FORM_BOUNDS

  const numericEdges: ReadonlyArray<[string, SharedAnswers]> = [
    [`speed min ${topSpeed.min}`, answers({ throttle: 'throttle', speed: topSpeed.min })],
    [`speed max ${topSpeed.max}`, answers({ throttle: 'throttle', speed: topSpeed.max })],
    [`watts min ${motorWatts.min}`, answers({ throttle: 'throttle', watts: motorWatts.min })],
    [`watts max ${motorWatts.max}`, answers({ throttle: 'throttle', watts: motorWatts.max })],
    [`age min ${age.min}`, answers({ age: age.min })],
    [`age max ${age.max}`, answers({ age: age.max })],
  ]

  for (const [label, a] of numericEdges) {
    it(label, () => {
      const back = roundTrip(a)
      expect(back.bike.topMotorAssistedSpeed).toBe(a.bike.topMotorAssistedSpeed)
      expect(back.bike.motorWatts).toBe(a.bike.motorWatts)
      expect(back.operator.age).toBe(a.operator.age)
    })
  }

  it('every jurisdiction x throttle x license combination', () => {
    for (const jurisdiction of ['NJ', 'HI'] as const) {
      for (const throttle of THROTTLES) {
        for (const license of LICENSES) {
          const a = answers({ jurisdiction, throttle, license })
          const back = roundTrip(a)
          expect(back.jurisdiction).toBe(jurisdiction)
          expect(back.bike.throttle).toBe(throttle)
          expect(back.operator.license).toBe(license)
        }
      }
    }
  })

  it('both boolean flags in all four combinations', () => {
    for (const rental of [false, true]) {
      for (const registered of [false, true]) {
        const back = roundTrip(answers({ throttle: 'throttle', rental, registered }))
        expect(back.bike.isRentalFromSharedSystem).toBe(rental)
        expect(back.bike.isRegistered).toBe(registered)
      }
    }
  })

  it('specialty coverage limits at both bounds', () => {
    for (const amount of [coverage.min, coverage.max]) {
      const policy: ExistingPolicy = {
        kind: 'specialty-ebike',
        coverage: {
          bodilyInjuryPerPerson: usd(amount),
          bodilyInjuryPerAccident: usd(amount),
          propertyDamage: usd(amount),
          pip: null,
        },
      }
      const back = roundTrip(answers({ throttle: 'throttle', policies: [policy] }))
      const got = back.policies[0]
      expect(got?.kind).toBe('specialty-ebike')
      if (got?.kind !== 'specialty-ebike') return
      expect(got.coverage.bodilyInjuryPerPerson).toBe(amount)
      expect(got.coverage.propertyDamage).toBe(amount)
    }
  })

  it('every non-specialty policy kind', () => {
    for (const kind of ['none', 'auto', 'homeowners', 'renters'] as const) {
      const policy = (
        kind === 'none'
          ? { kind: 'none' }
          : kind === 'auto'
            ? { kind: 'auto', extendsToEbike: 'unknown' }
            : kind === 'homeowners'
              ? { kind: 'homeowners', includesEbike: 'unknown' }
              : { kind: 'renters', includesEbike: 'unknown' }
      ) as ExistingPolicy
      const back = roundTrip(answers({ throttle: 'throttle', policies: [policy] }))
      expect(back.policies[0]?.kind).toBe(kind)
    }
  })
})

describe('the decoder is not stricter than the form', () => {
  // Stated as an explicit, readable table so a future change to either side is
  // an obvious conflict rather than a silent one.
  it('rejects nothing inside FORM_BOUNDS', () => {
    const outOfBounds: string[] = []
    for (const speed of [FORM_BOUNDS.topSpeed.min, FORM_BOUNDS.topSpeed.max]) {
      for (const w of [FORM_BOUNDS.motorWatts.min, FORM_BOUNDS.motorWatts.max]) {
        for (const a of [FORM_BOUNDS.age.min, FORM_BOUNDS.age.max]) {
          const qs = encodeAnswers(answers({ throttle: 'throttle', speed, watts: w, age: a }))
          if (decodeAnswers(qs) === null) outOfBounds.push(qs)
        }
      }
    }
    expect(outOfBounds).toEqual([])
  })

  // Backward compatibility: the decoder deliberately stays looser than the
  // form so links shared before these bounds existed still open.
  it('still accepts legacy links the current form would not produce', () => {
    expect(decodeAnswers('t=p&s=0&w=0&r=0&g=0&a=35&l=b&p=n')).not.toBeNull()
    expect(decodeAnswers('t=x&s=25&w=750&r=0&g=1&a=35&l=b&p=s&bp=15000&ba=30000&pd=5000&pi=250000')).not.toBeNull()
    expect(decodeAnswers('t=x&s=25&w=750&r=0&g=0&a=35&l=b&p=n')).not.toBeNull()
  })
})
