import { z } from 'zod'
import type {
  BikeProfile,
  ExistingPolicy,
  LicenseKind,
  OperatorProfile,
  ThrottleKind,
} from '../types'
import { mph, usd, watts, years } from '../types'

/**
 * Wire format for the form state in the URL.
 * Short keys so shared links stay compact.
 *
 *   t = throttle:  n (none) | p (pedal-assist) | x (throttle)
 *   s = top motor-assisted speed (mph)
 *   w = motor wattage
 *   r = rental: 0 | 1
 *   g = registered with the state: 0 | 1
 *   a = operator age
 *   l = license: b (basic-drivers) | m (motorized-bicycle) | n (none)
 *   p = policy:  n (none) | s (specialty) | a (auto) | h (homeowners) | r (renters)
 *   For p=s only: bp, ba, pd, pi  (the four coverage limits, USD)
 */
const QuerySchema = z.object({
  t: z.enum(['n', 'p', 'x']).default('p'),
  s: z.coerce.number().int().min(0).max(50).default(20),
  w: z.coerce.number().int().min(0).max(5000).default(500),
  r: z.enum(['0', '1']).default('0'),
  g: z.enum(['0', '1']).default('0'),
  a: z.coerce.number().int().min(1).max(120),
  l: z.enum(['b', 'm', 'n']).default('b'),
  p: z.enum(['n', 's', 'a', 'h', 'r']).default('n'),
  bp: z.coerce.number().int().min(0).optional(),
  ba: z.coerce.number().int().min(0).optional(),
  pd: z.coerce.number().int().min(0).optional(),
  pi: z.coerce.number().int().min(0).optional(),
})

export type SharedAnswers = {
  bike: BikeProfile
  operator: OperatorProfile
  policies: ReadonlyArray<ExistingPolicy>
}

const throttleToWire: Record<ThrottleKind, 'n' | 'p' | 'x'> = {
  none: 'n',
  'pedal-assist-only': 'p',
  throttle: 'x',
}
const throttleFromWire: Record<'n' | 'p' | 'x', ThrottleKind> = {
  n: 'none',
  p: 'pedal-assist-only',
  x: 'throttle',
}

const licenseToWire: Record<LicenseKind, 'b' | 'm' | 'n'> = {
  'basic-drivers': 'b',
  'motorized-bicycle': 'm',
  none: 'n',
}
const licenseFromWire: Record<'b' | 'm' | 'n', LicenseKind> = {
  b: 'basic-drivers',
  m: 'motorized-bicycle',
  n: 'none',
}

export function encodeAnswers(a: SharedAnswers): string {
  const params = new URLSearchParams()
  params.set('t', throttleToWire[a.bike.throttle])
  params.set('s', String(a.bike.topMotorAssistedSpeed))
  params.set('w', String(a.bike.motorWatts))
  params.set('r', a.bike.isRentalFromSharedSystem ? '1' : '0')
  params.set('g', a.bike.isRegistered ? '1' : '0')
  params.set('a', String(a.operator.age))
  params.set('l', licenseToWire[a.operator.license])

  const policy = a.policies[0]
  if (!policy || policy.kind === 'none') {
    params.set('p', 'n')
  } else if (policy.kind === 'specialty-ebike') {
    params.set('p', 's')
    params.set('bp', String(policy.coverage.bodilyInjuryPerPerson))
    params.set('ba', String(policy.coverage.bodilyInjuryPerAccident))
    params.set('pd', String(policy.coverage.propertyDamage))
    if (policy.coverage.pip !== null) params.set('pi', String(policy.coverage.pip))
  } else if (policy.kind === 'auto') {
    params.set('p', 'a')
  } else if (policy.kind === 'homeowners') {
    params.set('p', 'h')
  } else if (policy.kind === 'renters') {
    params.set('p', 'r')
  }
  return params.toString()
}

export function decodeAnswers(query: string): SharedAnswers | null {
  const params = new URLSearchParams(query)
  const raw: Record<string, string> = {}
  params.forEach((v, k) => {
    raw[k] = v
  })
  const parsed = QuerySchema.safeParse(raw)
  if (!parsed.success) return null
  const q = parsed.data

  const bike: BikeProfile = {
    throttle: throttleFromWire[q.t],
    topMotorAssistedSpeed: mph(q.s),
    motorWatts: watts(q.w),
    isRentalFromSharedSystem: q.r === '1',
    isRegistered: q.g === '1',
  }
  const operator: OperatorProfile = {
    age: years(q.a),
    license: licenseFromWire[q.l],
  }
  const policy: ExistingPolicy = buildPolicy(q)
  return { bike, operator, policies: [policy] }
}

function buildPolicy(q: z.infer<typeof QuerySchema>): ExistingPolicy {
  switch (q.p) {
    case 'n':
      return { kind: 'none' }
    case 's':
      return {
        kind: 'specialty-ebike',
        coverage: {
          bodilyInjuryPerPerson: usd(q.bp ?? 0),
          bodilyInjuryPerAccident: usd(q.ba ?? 0),
          propertyDamage: usd(q.pd ?? 0),
          pip: q.pi !== undefined ? usd(q.pi) : null,
        },
      }
    case 'a':
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
    case 'h':
      return {
        kind: 'homeowners',
        includesEbike: 'unknown',
        coverage: {
          bodilyInjuryPerPerson: null,
          bodilyInjuryPerAccident: null,
          propertyDamage: null,
          pip: null,
        },
      }
    case 'r':
      return {
        kind: 'renters',
        includesEbike: 'unknown',
        coverage: {
          bodilyInjuryPerPerson: null,
          bodilyInjuryPerAccident: null,
          propertyDamage: null,
          pip: null,
        },
      }
  }
}
