import { describe, it, expect } from 'vitest'
import { encodeAnswers, decodeAnswers, type SharedAnswers } from './share'
import { mph, usd, watts, years } from '../types'

const baseline: SharedAnswers = {
  jurisdiction: 'NJ',
  bike: {
    throttle: 'pedal-assist-only',
    topMotorAssistedSpeed: mph(20),
    motorWatts: watts(500),
    isRentalFromSharedSystem: false,
    isRegistered: false,
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

  it('round-trips the Hawaii jurisdiction via the st param', () => {
    const input: SharedAnswers = { ...baseline, jurisdiction: 'HI' }
    const encoded = encodeAnswers(input)
    expect(encoded).toContain('st=hi')
    expect(decodeAnswers(encoded)?.jurisdiction).toBe('HI')
  })

  it('omits st for NJ so new NJ links match the pre-multi-state format', () => {
    const encoded = encodeAnswers(baseline)
    expect(encoded).not.toContain('st=')
    expect(decodeAnswers(encoded)?.jurisdiction).toBe('NJ')
  })

  it('decodes legacy links (no st param) as New Jersey', () => {
    const decoded = decodeAnswers('t=x&s=25&w=750&r=0&g=0&a=35&l=b&p=h')
    expect(decoded?.jurisdiction).toBe('NJ')
  })

  it('rejects an unknown st value', () => {
    expect(decodeAnswers('st=zz&a=35')).toBe(null)
  })

  it('round-trips the isRegistered flag', () => {
    const input: SharedAnswers = {
      ...baseline,
      bike: { ...baseline.bike, isRegistered: true },
    }
    const decoded = decodeAnswers(encodeAnswers(input))
    expect(decoded?.bike.isRegistered).toBe(true)
  })

  it('defaults isRegistered to false when the g param is absent', () => {
    const decoded = decodeAnswers('a=35')
    expect(decoded?.bike.isRegistered).toBe(false)
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
