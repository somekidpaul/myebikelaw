import { describe, it, expect } from 'vitest'
import { encodeAnswers, decodeAnswers, type SharedAnswers } from './share'
import { mph, usd, watts, years } from '../types'

const baseline: SharedAnswers = {
  bike: {
    throttle: 'pedal-assist-only',
    topMotorAssistedSpeed: mph(20),
    motorWatts: watts(500),
    isRentalFromSharedSystem: false,
  },
  operator: { age: years(35), license: 'basic-drivers' },
  policies: [{ kind: 'none' }],
}

describe('share encode/decode', () => {
  it('round-trips a baseline state', () => {
    const encoded = encodeAnswers(baseline)
    const decoded = decodeAnswers(encoded)
    expect(decoded).toEqual(baseline)
  })

  it('round-trips a specialty-ebike policy with all four limits', () => {
    const input: SharedAnswers = {
      ...baseline,
      policies: [
        {
          kind: 'specialty-ebike',
          coverage: {
            bodilyInjuryPerPerson: usd(35_000),
            bodilyInjuryPerAccident: usd(70_000),
            propertyDamage: usd(25_000),
            pip: usd(15_000),
          },
        },
      ],
    }
    const decoded = decodeAnswers(encodeAnswers(input))
    expect(decoded).toEqual(input)
  })

  it('returns null for invalid input (missing age)', () => {
    expect(decodeAnswers('t=p&s=20')).toBe(null)
  })

  it('falls back to defaults for missing optional fields', () => {
    const decoded = decodeAnswers('a=35')
    expect(decoded?.bike.throttle).toBe('pedal-assist-only')
    expect(decoded?.bike.topMotorAssistedSpeed).toBe(20)
    expect(decoded?.operator.age).toBe(35)
  })

  it('rejects out-of-range values', () => {
    expect(decodeAnswers('a=500')).toBe(null)
    expect(decodeAnswers('a=35&s=999')).toBe(null)
    expect(decodeAnswers('a=35&w=-100')).toBe(null)
  })
})
