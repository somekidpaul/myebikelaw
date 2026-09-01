/**
 * The form's pure logic, lifted out of the component so it can be tested.
 *
 * It lived inside Form() as closures, which meant nothing could reach it: the
 * bounds bug and the age bug both survived a "fix" plus a new round-trip test,
 * because the test exercised encodeAnswers/decodeAnswers directly and never
 * went through the form's own submit path. Reverting either fix left the suite
 * green. Everything here is now reachable, and form-logic.test.ts asserts the
 * one property that matters:
 *
 *   ANY state that validate() accepts must produce a share URL that decodes.
 *
 * That single invariant covers both bugs and the ones not thought of yet.
 */
import type {
  BikeProfile,
  ExistingPolicy,
  LicenseKind,
  OperatorProfile,
  ThrottleKind,
} from '../types'
import { mph, usd, watts, years } from '../types'
import { FORM_BOUNDS, FORM_DEFAULTS } from '../lib/field-bounds'

export type FormState = {
  throttle: ThrottleKind
  topSpeed: string
  motorWatts: string
  isRental: boolean
  isRegistered: boolean
  age: string
  license: LicenseKind
  policy: 'specialty' | 'homeowners' | 'renters' | 'auto' | 'none'
  bipp: string
  bipa: string
  pd: string
}

export type FormResult = {
  bike: BikeProfile
  operator: OperatorProfile
  policies: ReadonlyArray<ExistingPolicy>
}

export const initialFormState: FormState = {
  throttle: 'pedal-assist-only',
  topSpeed: FORM_DEFAULTS.topSpeed,
  motorWatts: FORM_DEFAULTS.motorWatts,
  isRental: false,
  isRegistered: false,
  age: '',
  license: 'basic-drivers',
  policy: 'none',
  bipp: '',
  bipa: '',
  pd: '',
}

export type FormErrors = Partial<Record<keyof FormState, string>>

/** Which questions a statute actually asks. */
export type FormSections = {
  asksLicense: boolean
  asksInsurance: boolean
}

function checkNumber(
  raw: string,
  { min, max }: { min: number; max: number },
  unit: string,
): string | undefined {
  const n = Number(raw)
  if (raw.trim() === '' || !Number.isFinite(n) || !Number.isInteger(n) || n < min) {
    return `Enter a whole number of at least ${min} ${unit}.`
  }
  if (n > max) return `Enter ${max.toLocaleString('en-US')} ${unit} or less.`
  return undefined
}

export function validateFormState(s: FormState, sections: FormSections): FormErrors {
  const next: FormErrors = {}

  // Speed and wattage are only asked when the bike has a motor.
  if (s.throttle !== 'none') {
    next.topSpeed = checkNumber(s.topSpeed, FORM_BOUNDS.topSpeed, 'mph')
    next.motorWatts = checkNumber(s.motorWatts, FORM_BOUNDS.motorWatts, 'W')
  }

  // Age is asked on every path. It used to lean entirely on the input's
  // `required` attribute, which let a typed 0 through into a share URL the
  // decoder then rejected.
  next.age = checkNumber(s.age, FORM_BOUNDS.age, 'years')

  if (sections.asksInsurance && s.policy === 'specialty') {
    next.bipp = checkNumber(s.bipp, FORM_BOUNDS.coverage, 'dollars')
    next.bipa = checkNumber(s.bipa, FORM_BOUNDS.coverage, 'dollars')
    next.pd = checkNumber(s.pd, FORM_BOUNDS.coverage, 'dollars')
  }

  for (const k of Object.keys(next) as Array<keyof FormState>) {
    if (next[k] === undefined) delete next[k]
  }
  return next
}

export function buildPolicy(s: FormState): ExistingPolicy {
  if (s.policy === 'none') return { kind: 'none' }
  if (s.policy === 'specialty') {
    return {
      kind: 'specialty-ebike',
      coverage: {
        bodilyInjuryPerPerson: usd(Number(s.bipp) || 0),
        bodilyInjuryPerAccident: usd(Number(s.bipa) || 0),
        propertyDamage: usd(Number(s.pd) || 0),
        pip: null,
      },
    }
  }
  if (s.policy === 'auto') {
    return {
      kind: 'auto',
      extendsToEbike: 'unknown',
      coverage: {
        bodilyInjuryPerPerson: usd(0),
        bodilyInjuryPerAccident: usd(0),
        propertyDamage: usd(0),
        pip: null,
      },
    }
  }
  return {
    kind: s.policy,
    includesEbike: 'unknown',
    coverage: {
      bodilyInjuryPerPerson: null,
      bodilyInjuryPerAccident: null,
      propertyDamage: null,
      pip: null,
    },
  }
}

/**
 * Turn validated form state into the answers the engine and the share URL both
 * consume.
 *
 * A bike with no motor has no speed or wattage ANSWER. Those inputs unmount
 * when the rider picks "no motor", but their last typed values stay in state
 * and used to be encoded anyway: type 100 mph, switch to "no motor", and the
 * app emitted s=100, past the decoder's max of 50. The rider got a verdict and
 * a dead "Copy share link". Falling back to the defaults is what keeps the
 * emitted URL inside the bounds validate() actually enforced.
 */
export function toFormResult(s: FormState, sections: FormSections): FormResult {
  const hasMotor = s.throttle !== 'none'
  const speedRaw = hasMotor ? s.topSpeed : FORM_DEFAULTS.topSpeed
  const wattsRaw = hasMotor ? s.motorWatts : FORM_DEFAULTS.motorWatts
  return {
    bike: {
      motorWatts: watts(Number(wattsRaw) || 0),
      topMotorAssistedSpeed: mph(Number(speedRaw) || 0),
      throttle: s.throttle,
      isRentalFromSharedSystem: s.isRental,
      isRegistered: s.isRegistered,
    },
    operator: {
      age: years(Number(s.age) || 0),
      license: sections.asksLicense ? s.license : 'none',
    },
    policies: [sections.asksInsurance ? buildPolicy(s) : { kind: 'none' }],
  }
}
