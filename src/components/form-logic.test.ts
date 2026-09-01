/**
 * FORM -> SHARE-URL GUARD
 *
 * Written after an adversarial pass proved the first attempt at this guard was
 * hollow. Reverting BOTH bounds fixes left the suite green at 240 passing,
 * because share-roundtrip.test.ts exercised encodeAnswers/decodeAnswers
 * directly and never went through the form's own submit path. The fix was real;
 * the guard was not.
 *
 * THE PROPERTY, and it is the only one that actually matters:
 *
 *     for every FormState the form accepts,
 *     decodeAnswers(encodeAnswers(toFormResult(state))) !== null
 *
 * If the form accepts it, the rider gets a verdict and a "Copy share link"
 * button. If that link does not decode, the button hands them a dead link and
 * nothing anywhere tells them. Both shipped bugs were instances of exactly this.
 */
import { describe, expect, it } from 'vitest'
import {
  initialFormState,
  toFormResult,
  validateFormState,
  type FormSections,
  type FormState,
} from './form-logic'
import { encodeAnswers, decodeAnswers } from '../lib/share'
import { FORM_BOUNDS } from '../lib/field-bounds'
import { STATUTES } from '../data/statutes'

const NJ: FormSections = { asksLicense: true, asksInsurance: true }
const HI: FormSections = { asksLicense: false, asksInsurance: false }

function state(o: Partial<FormState> = {}): FormState {
  return { ...initialFormState, age: '35', ...o }
}

/** The exact chain the app runs on submit, for a state the form accepted. */
function shareUrlFor(s: FormState, sections: FormSections, jurisdiction: 'NJ' | 'HI') {
  const result = toFormResult(s, sections)
  return encodeAnswers({ jurisdiction, ...result })
}

describe('anything the form accepts produces a decodable share link', () => {
  const { topSpeed, motorWatts, age, coverage } = FORM_BOUNDS

  // Values a rider can actually type, including the ones that broke it.
  const speeds = ['1', String(topSpeed.max), '20', '100', '9999', '0', '', '20.5', 'abc', '-5']
  const wattages = ['1', String(motorWatts.max), '500', '9000', '0', '', 'abc', '-100']
  const ages = ['1', String(age.max), '35', '0', '', '121', '-1', 'abc', '14']
  const throttles: FormState['throttle'][] = ['none', 'pedal-assist-only', 'throttle']

  it('speed: every accepted value round-trips, including after switching to "no motor"', () => {
    const dead: string[] = []
    for (const throttle of throttles) {
      for (const topSpeedValue of speeds) {
        const s = state({ throttle, topSpeed: topSpeedValue })
        if (Object.keys(validateFormState(s, NJ)).length > 0) continue // form rejects it
        const qs = shareUrlFor(s, NJ, 'NJ')
        if (decodeAnswers(qs) === null) dead.push(`throttle=${throttle} topSpeed=${topSpeedValue} -> ?${qs}`)
      }
    }
    expect(dead, 'the form accepted these but the decoder rejects their share URL').toEqual([])
  })

  it('wattage: every accepted value round-trips', () => {
    const dead: string[] = []
    for (const throttle of throttles) {
      for (const w of wattages) {
        const s = state({ throttle, motorWatts: w })
        if (Object.keys(validateFormState(s, NJ)).length > 0) continue
        const qs = shareUrlFor(s, NJ, 'NJ')
        if (decodeAnswers(qs) === null) dead.push(`throttle=${throttle} watts=${w} -> ?${qs}`)
      }
    }
    expect(dead).toEqual([])
  })

  it('age: every accepted value round-trips', () => {
    const dead: string[] = []
    for (const a of ages) {
      const s = state({ age: a })
      if (Object.keys(validateFormState(s, NJ)).length > 0) continue
      const qs = shareUrlFor(s, NJ, 'NJ')
      if (decodeAnswers(qs) === null) dead.push(`age=${a} -> ?${qs}`)
    }
    expect(dead).toEqual([])
  })

  it('coverage amounts: every accepted value round-trips', () => {
    const amounts = [
      '0', '15000', String(coverage.max),
      String(Number.MAX_SAFE_INTEGER), '9007199254740993', '99999999999999999999',
      '', 'abc', '-1', '15000.5',
    ]
    const dead: string[] = []
    for (const amount of amounts) {
      const s = state({ policy: 'specialty', bipp: amount, bipa: amount, pd: amount })
      if (Object.keys(validateFormState(s, NJ)).length > 0) continue
      const qs = shareUrlFor(s, NJ, 'NJ')
      if (decodeAnswers(qs) === null) dead.push(`coverage=${amount} -> ?${qs}`)
    }
    expect(dead).toEqual([])
  })

  it('the full cross-product of every categorical answer', () => {
    const dead: string[] = []
    for (const [code, sections] of [['NJ', NJ], ['HI', HI]] as const) {
      for (const throttle of throttles) {
        for (const license of ['basic-drivers', 'motorized-bicycle', 'none'] as const) {
          for (const policy of ['none', 'specialty', 'auto', 'homeowners', 'renters'] as const) {
            for (const isRental of [false, true]) {
              for (const isRegistered of [false, true]) {
                const s = state({
                  throttle, license, policy, isRental, isRegistered,
                  bipp: '15000', bipa: '30000', pd: '5000',
                })
                if (Object.keys(validateFormState(s, sections)).length > 0) continue
                const qs = shareUrlFor(s, sections, code)
                if (decodeAnswers(qs) === null) {
                  dead.push(`${code} ${throttle}/${license}/${policy}/r${+isRental}/g${+isRegistered} -> ?${qs}`)
                }
              }
            }
          }
        }
      }
    }
    expect(dead).toEqual([])
  })
})

describe('the form rejects what it must', () => {
  // Each of these was, at some point, accepted. Named individually so a
  // regression says which rule was dropped.
  const rejected: ReadonlyArray<[string, FormState]> = [
    ['age 0', state({ age: '0' })],
    ['age blank', state({ age: '' })],
    ['age above max', state({ age: '121' })],
    ['age non-numeric', state({ age: 'abc' })],
    ['speed above max, with a motor', state({ throttle: 'throttle', topSpeed: '100' })],
    ['speed 0, with a motor', state({ throttle: 'throttle', topSpeed: '0' })],
    ['speed fractional', state({ throttle: 'throttle', topSpeed: '20.5' })],
    ['wattage above max', state({ throttle: 'throttle', motorWatts: '9000' })],
    ['wattage 0', state({ throttle: 'throttle', motorWatts: '0' })],
    ['coverage above max', state({ policy: 'specialty', bipp: '99999999999999999999', bipa: '30000', pd: '5000' })],
    ['coverage blank', state({ policy: 'specialty', bipp: '', bipa: '30000', pd: '5000' })],
  ]

  for (const [label, s] of rejected) {
    it(`rejects ${label}`, () => {
      expect(Object.keys(validateFormState(s, NJ)).length).toBeGreaterThan(0)
    })
  }

  it('accepts a plain valid answer', () => {
    expect(validateFormState(state(), NJ)).toEqual({})
    expect(validateFormState(state({ throttle: 'none' }), NJ)).toEqual({})
  })

  it('does not ask about coverage on a statute with no insurance rule', () => {
    // Hawaii has no insurance requirement, so a blank coverage field is not an
    // error there even though the same state fails NJ validation.
    const s = state({ policy: 'specialty', bipp: '', bipa: '', pd: '' })
    expect(Object.keys(validateFormState(s, NJ)).length).toBeGreaterThan(0)
    expect(validateFormState(s, HI)).toEqual({})
  })
})

describe('hidden answers never ride along in the URL', () => {
  it('a stale out-of-range speed is dropped when the bike has no motor', () => {
    // Reproduces the exact sequence: pick "has a throttle", type 100, switch
    // to "no motor", submit.
    const s = state({ throttle: 'none', topSpeed: '100', motorWatts: '9000' })
    expect(validateFormState(s, NJ)).toEqual({}) // the form accepts it, correctly
    const result = toFormResult(s, NJ)
    expect(result.bike.topMotorAssistedSpeed).toBeLessThanOrEqual(FORM_BOUNDS.topSpeed.max)
    expect(result.bike.motorWatts).toBeLessThanOrEqual(FORM_BOUNDS.motorWatts.max)
    expect(decodeAnswers(shareUrlFor(s, NJ, 'NJ'))).not.toBeNull()
  })
})

describe('sections match what the statutes actually require', () => {
  it('derives asksLicense/asksInsurance from the statute records', () => {
    expect(STATUTES.NJ.licensing.appliesToCategories.length > 0).toBe(NJ.asksLicense)
    expect(STATUTES.NJ.insurance.appliesToCategories.length > 0).toBe(NJ.asksInsurance)
    expect(STATUTES.HI.licensing.appliesToCategories.length > 0).toBe(HI.asksLicense)
    expect(STATUTES.HI.insurance.appliesToCategories.length > 0).toBe(HI.asksInsurance)
  })
})
