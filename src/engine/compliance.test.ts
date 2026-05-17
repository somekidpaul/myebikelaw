import { describe, it, expect } from 'vitest'
import { checkCompliance } from './compliance'
import { NJ_S4834 } from '../data/statutes/nj'
import type { BikeProfile, ExistingPolicy, OperatorProfile } from '../types'
import { mph, usd, watts, years } from '../types'

// ─────────────────────────────────────────────────────────────────────────────
// Fixtures
// ─────────────────────────────────────────────────────────────────────────────

const standardBike: BikeProfile = {
  motorWatts: watts(0),
  topMotorAssistedSpeed: mph(0),
  throttle: 'none',
  isRentalFromSharedSystem: false,
}

const lowSpeedPedalAssist: BikeProfile = {
  motorWatts: watts(500),
  topMotorAssistedSpeed: mph(20),
  throttle: 'pedal-assist-only',
  isRentalFromSharedSystem: false,
}

const class3PedalAssist: BikeProfile = {
  // pedal-assist 21–28 mph — the statutory grey area
  motorWatts: watts(750),
  topMotorAssistedSpeed: mph(28),
  throttle: 'pedal-assist-only',
  isRentalFromSharedSystem: false,
}

const throttleBikeFast: BikeProfile = {
  motorWatts: watts(750),
  topMotorAssistedSpeed: mph(25),
  throttle: 'throttle',
  isRentalFromSharedSystem: false,
}

const throttleBikeSlow: BikeProfile = {
  motorWatts: watts(250),
  topMotorAssistedSpeed: mph(15),
  throttle: 'throttle',
  isRentalFromSharedSystem: false,
}

const overpoweredBike: BikeProfile = {
  motorWatts: watts(1500),
  topMotorAssistedSpeed: mph(35),
  throttle: 'throttle',
  isRentalFromSharedSystem: false,
}

const sharedRentalLowSpeed: BikeProfile = {
  ...lowSpeedPedalAssist,
  isRentalFromSharedSystem: true,
}

const adultLicensed: OperatorProfile = {
  age: years(35),
  license: 'basic-drivers',
}

const adultUnlicensed: OperatorProfile = {
  age: years(35),
  license: 'none',
}

const teenWithMotoLicense: OperatorProfile = {
  age: years(16),
  license: 'motorized-bicycle',
}

const teenUnlicensed: OperatorProfile = {
  age: years(16),
  license: 'none',
}

const childOperator: OperatorProfile = {
  age: years(14),
  license: 'none',
}

const compliantSpecialty: ExistingPolicy = {
  kind: 'specialty-ebike',
  coverage: {
    bodilyInjuryPerPerson: usd(35_000),
    bodilyInjuryPerAccident: usd(70_000),
    propertyDamage: usd(25_000),
    pip: usd(15_000),
  },
}

const lowLimitSpecialty: ExistingPolicy = {
  kind: 'specialty-ebike',
  coverage: {
    bodilyInjuryPerPerson: usd(35_000),
    bodilyInjuryPerAccident: usd(70_000),
    propertyDamage: usd(10_000),
    pip: usd(15_000),
  },
}

const unknownHomeowners: ExistingPolicy = {
  kind: 'homeowners',
  includesEbike: 'unknown',
  coverage: {
    bodilyInjuryPerPerson: null,
    bodilyInjuryPerAccident: null,
    propertyDamage: null,
    pip: null,
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Bike classification — must match the bill's three categories
// ─────────────────────────────────────────────────────────────────────────────

describe('bike classification under S4834', () => {
  it('non-electric bike → standard (not applicable)', () => {
    expect(NJ_S4834.appliesTo(standardBike)).toBe('standard')
  })

  it('pedal-assist 20 mph → low-speed electric bicycle', () => {
    expect(NJ_S4834.appliesTo(lowSpeedPedalAssist)).toBe('low-speed-electric')
  })

  it('pedal-assist 28 mph (Class 3) → motorized bicycle (defensive reading)', () => {
    expect(NJ_S4834.appliesTo(class3PedalAssist)).toBe('motorized')
  })

  it('throttle 25 mph → motorized bicycle', () => {
    expect(NJ_S4834.appliesTo(throttleBikeFast)).toBe('motorized')
  })

  it('throttle 15 mph → motorized bicycle (sub-type 2)', () => {
    expect(NJ_S4834.appliesTo(throttleBikeSlow)).toBe('motorized')
  })

  it('1500W / 35 mph → electric motorized bicycle (motorcycle)', () => {
    expect(NJ_S4834.appliesTo(overpoweredBike)).toBe('electric-motorized')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Class 3 statutory ambiguity — must be surfaced to the user
// ─────────────────────────────────────────────────────────────────────────────

describe('classification ambiguity (Class 3 statutory gap)', () => {
  it('attaches a classificationNote to Class 3 e-bikes', () => {
    const result = checkCompliance({
      bike: class3PedalAssist,
      operator: adultLicensed,
      policies: [compliantSpecialty],
      statute: NJ_S4834,
    })
    expect(result.classificationNote).toBeDefined()
    expect(result.classificationNote?.chosen).toBe('motorized')
    expect(result.classificationNote?.alternate).toBe('low-speed-electric')
    expect(result.classificationNote?.readingTaken).toBe('conservative')
  })

  it('does NOT attach a classificationNote to unambiguous low-speed-electric bikes', () => {
    const result = checkCompliance({
      bike: lowSpeedPedalAssist,
      operator: adultLicensed,
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(result.classificationNote).toBeUndefined()
  })

  it('does NOT attach a classificationNote to unambiguous throttle motorized bikes', () => {
    const result = checkCompliance({
      bike: throttleBikeFast,
      operator: adultLicensed,
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(result.classificationNote).toBeUndefined()
  })

  it('does NOT attach a classificationNote to standard bikes', () => {
    const result = checkCompliance({
      bike: standardBike,
      operator: adultLicensed,
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(result.classificationNote).toBeUndefined()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Low-speed electric bicycle — license + registration, NO insurance per statute
// ─────────────────────────────────────────────────────────────────────────────

describe('low-speed electric bicycle compliance', () => {
  it('17+ with driver\'s license + uninsured + unregistered → only registration gap (NO insurance gap)', () => {
    const result = checkCompliance({
      bike: lowSpeedPedalAssist,
      operator: adultLicensed,
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(result.status).toBe('gaps')
    if (result.status !== 'gaps') return
    expect(result.gaps.some((g) => g.kind === 'registration-required')).toBe(true)
    expect(result.gaps.some((g) => g.kind === 'insurance')).toBe(false)
    expect(result.gaps.some((g) => g.kind === 'license-required')).toBe(false)
  })

  it('17+ unlicensed → license gap + registration gap (NO insurance)', () => {
    const result = checkCompliance({
      bike: lowSpeedPedalAssist,
      operator: adultUnlicensed,
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(result.status).toBe('gaps')
    if (result.status !== 'gaps') return
    expect(result.gaps.some((g) => g.kind === 'license-required')).toBe(true)
    expect(result.gaps.some((g) => g.kind === 'insurance')).toBe(false)
  })

  it('16-year-old with motorized-bicycle license → only registration gap', () => {
    const result = checkCompliance({
      bike: lowSpeedPedalAssist,
      operator: teenWithMotoLicense,
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(result.status).toBe('gaps')
    if (result.status !== 'gaps') return
    expect(result.gaps.some((g) => g.kind === 'license-required')).toBe(false)
    expect(result.gaps.some((g) => g.kind === 'registration-required')).toBe(true)
    expect(result.gaps.some((g) => g.kind === 'insurance')).toBe(false)
  })

  it('16-year-old unlicensed on shared rental → fully exempt (compliant)', () => {
    const result = checkCompliance({
      bike: sharedRentalLowSpeed,
      operator: teenUnlicensed,
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(result.status).toBe('compliant')
  })

  it('adult licensed on shared rental → fully compliant (no registration/insurance burden)', () => {
    const result = checkCompliance({
      bike: sharedRentalLowSpeed,
      operator: adultLicensed,
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(result.status).toBe('compliant')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Motorized bicycle — license + registration + insurance
// ─────────────────────────────────────────────────────────────────────────────

describe('motorized bicycle compliance', () => {
  it('adult licensed + uninsured + unregistered → all three gaps', () => {
    const result = checkCompliance({
      bike: throttleBikeFast,
      operator: adultLicensed,
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(result.status).toBe('gaps')
    if (result.status !== 'gaps') return
    expect(result.gaps.some((g) => g.kind === 'registration-required')).toBe(true)
    expect(result.gaps.some((g) => g.kind === 'insurance')).toBe(true)
    expect(result.gaps.some((g) => g.kind === 'license-required')).toBe(false)
  })

  it('compliant specialty policy + license, ignoring registration → compliant', () => {
    const result = checkCompliance({
      bike: throttleBikeFast,
      operator: adultLicensed,
      policies: [compliantSpecialty],
      statute: {
        ...NJ_S4834,
        registration: { ...NJ_S4834.registration, appliesToCategories: [] },
      },
    })
    expect(result.status).toBe('compliant')
  })

  it('low limit on property damage → only that one axis is flagged', () => {
    const result = checkCompliance({
      bike: throttleBikeFast,
      operator: adultLicensed,
      policies: [lowLimitSpecialty],
      statute: {
        ...NJ_S4834,
        registration: { ...NJ_S4834.registration, appliesToCategories: [] },
      },
    })
    expect(result.status).toBe('gaps')
    if (result.status !== 'gaps') return
    const insGap = result.gaps.find((g) => g.kind === 'insurance')
    if (insGap?.kind !== 'insurance') return
    expect(insGap.gaps).toHaveLength(1)
    expect(insGap.gaps[0]?.axis).toBe('propertyDamage')
  })

  it('homeowners with unknown ebike coverage → verify-with-carrier remedy', () => {
    const result = checkCompliance({
      bike: throttleBikeFast,
      operator: adultLicensed,
      policies: [unknownHomeowners],
      statute: NJ_S4834,
    })
    expect(result.status).toBe('gaps')
    if (result.status !== 'gaps') return
    expect(result.remedies.some((r) => r.kind === 'verify-coverage-with-carrier')).toBe(true)
  })

  it('rental exemption does NOT apply to motorized bicycle category', () => {
    // Hypothetical: shared system somehow renting a motorized bike (rare/unlikely IRL)
    const rentalMotorized: BikeProfile = {
      ...throttleBikeFast,
      isRentalFromSharedSystem: true,
    }
    const result = checkCompliance({
      bike: rentalMotorized,
      operator: { age: years(16), license: 'none' },
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    // license + registration + insurance all still apply since rental exemption is low-speed-only
    expect(result.status).toBe('gaps')
    if (result.status !== 'gaps') return
    expect(result.gaps.some((g) => g.kind === 'license-required')).toBe(true)
    expect(result.gaps.some((g) => g.kind === 'registration-required')).toBe(true)
    expect(result.gaps.some((g) => g.kind === 'insurance')).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Registration status (bike.isRegistered) — gates the registration-required gap
// ─────────────────────────────────────────────────────────────────────────────

describe('registration status', () => {
  it('motorized bike registered + insured + licensed → compliant', () => {
    const result = checkCompliance({
      bike: { ...throttleBikeFast, isRegistered: true },
      operator: adultLicensed,
      policies: [compliantSpecialty],
      statute: NJ_S4834,
    })
    expect(result.status).toBe('compliant')
  })

  it('motorized bike registered but uninsured → only insurance gap remains', () => {
    const result = checkCompliance({
      bike: { ...throttleBikeFast, isRegistered: true },
      operator: adultLicensed,
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(result.status).toBe('gaps')
    if (result.status !== 'gaps') return
    expect(result.gaps.some((g) => g.kind === 'registration-required')).toBe(false)
    expect(result.gaps.some((g) => g.kind === 'insurance')).toBe(true)
  })

  it('low-speed bike registered + licensed → compliant (no insurance needed)', () => {
    const result = checkCompliance({
      bike: { ...lowSpeedPedalAssist, isRegistered: true },
      operator: adultLicensed,
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(result.status).toBe('compliant')
  })

  it('isRegistered explicitly false → registration gap still surfaces', () => {
    const result = checkCompliance({
      bike: { ...throttleBikeFast, isRegistered: false },
      operator: adultLicensed,
      policies: [compliantSpecialty],
      statute: NJ_S4834,
    })
    expect(result.status).toBe('gaps')
    if (result.status !== 'gaps') return
    expect(result.gaps.some((g) => g.kind === 'registration-required')).toBe(true)
  })

  it('registered makes no difference when category is exempt (standard bike)', () => {
    const result = checkCompliance({
      bike: { ...standardBike, isRegistered: true },
      operator: adultLicensed,
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(result.status).toBe('not-applicable')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Operator age — universal across categories
// ─────────────────────────────────────────────────────────────────────────────

describe('operator age limits', () => {
  it('under 15 → prohibited regardless of bike or policies', () => {
    const result = checkCompliance({
      bike: lowSpeedPedalAssist,
      operator: childOperator,
      policies: [compliantSpecialty],
      statute: NJ_S4834,
    })
    expect(result.status).toBe('prohibited')
  })

  it('17+ basic driver\'s license works for motorized bicycle', () => {
    const result = checkCompliance({
      bike: throttleBikeFast,
      operator: adultLicensed,
      policies: [compliantSpecialty],
      statute: NJ_S4834,
    })
    // expect license is OK; registration is the only remaining gap
    if (result.status === 'gaps') {
      expect(result.gaps.some((g) => g.kind === 'license-required')).toBe(false)
    }
  })

  it('15-16 with only basic driver\'s license → license gap (basic not accepted in that age bracket)', () => {
    // Realistically unobtainable IRL but tests the rule
    const result = checkCompliance({
      bike: lowSpeedPedalAssist,
      operator: { age: years(15), license: 'basic-drivers' },
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    if (result.status === 'gaps') {
      expect(result.gaps.some((g) => g.kind === 'license-required')).toBe(true)
    }
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Electric motorized bicycle — reclassified as motorcycle
// ─────────────────────────────────────────────────────────────────────────────

describe('electric motorized bicycle (motorcycle reclassification)', () => {
  it('>750W or >28mph → reclassified status', () => {
    const result = checkCompliance({
      bike: overpoweredBike,
      operator: adultLicensed,
      policies: [compliantSpecialty],
      statute: NJ_S4834,
    })
    expect(result.status).toBe('reclassified')
    if (result.status !== 'reclassified') return
    expect(result.targetClassification).toBe('motorcycle')
  })

  it('does NOT flag motorized-bicycle gaps for an electric motorized bicycle', () => {
    const result = checkCompliance({
      bike: overpoweredBike,
      operator: adultUnlicensed,
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    // even with no license/insurance, the status is reclassified, not gaps,
    // because the bill's motorized-bicycle rules don't directly apply.
    expect(result.status).toBe('reclassified')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Standard non-electric bicycle
// ─────────────────────────────────────────────────────────────────────────────

describe('standard bicycle', () => {
  it('no motor → not-applicable, regardless of operator/policies', () => {
    const result = checkCompliance({
      bike: standardBike,
      operator: adultLicensed,
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(result.status).toBe('not-applicable')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// Coverage aggregation edge cases
// ─────────────────────────────────────────────────────────────────────────────

describe('coverage aggregation across multiple policies', () => {
  it('takes the highest limit across policies', () => {
    const policy1: ExistingPolicy = {
      kind: 'specialty-ebike',
      coverage: {
        bodilyInjuryPerPerson: usd(20_000),
        bodilyInjuryPerAccident: usd(70_000),
        propertyDamage: usd(25_000),
        pip: usd(15_000),
      },
    }
    const policy2: ExistingPolicy = {
      kind: 'specialty-ebike',
      coverage: {
        bodilyInjuryPerPerson: usd(50_000),
        bodilyInjuryPerAccident: usd(40_000),
        propertyDamage: usd(10_000),
        pip: null,
      },
    }
    const result = checkCompliance({
      bike: throttleBikeFast,
      operator: adultLicensed,
      policies: [policy1, policy2],
      statute: {
        ...NJ_S4834,
        registration: { ...NJ_S4834.registration, appliesToCategories: [] },
      },
    })
    // max BIPP = 50k (>35k), max BIPA = 70k (=70k), max PD = 25k, max PIP = 15k → all met
    expect(result.status).toBe('compliant')
  })

  it('auto policy with extendsToEbike=never contributes nothing', () => {
    const autoNotExtending: ExistingPolicy = {
      kind: 'auto',
      extendsToEbike: 'never',
      coverage: {
        bodilyInjuryPerPerson: usd(100_000),
        bodilyInjuryPerAccident: usd(200_000),
        propertyDamage: usd(50_000),
        pip: usd(15_000),
      },
    }
    const result = checkCompliance({
      bike: throttleBikeFast,
      operator: adultLicensed,
      policies: [autoNotExtending],
      statute: NJ_S4834,
    })
    expect(result.status).toBe('gaps')
    if (result.status !== 'gaps') return
    const insGap = result.gaps.find((g) => g.kind === 'insurance')
    expect(insGap).toBeDefined()
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// QA MATRIX — boundaries + cross-products
// ═════════════════════════════════════════════════════════════════════════════

const mkBike = (
  throttle: 'none' | 'pedal-assist-only' | 'throttle',
  s: number,
  w: number,
  rental = false,
): BikeProfile => ({
  throttle,
  topMotorAssistedSpeed: mph(s),
  motorWatts: watts(w),
  isRentalFromSharedSystem: rental,
})

const mkOp = (a: number, license: 'basic-drivers' | 'motorized-bicycle' | 'none'): OperatorProfile => ({
  age: years(a),
  license,
})

const meetsMin = {
  bodilyInjuryPerPerson: usd(35_000),
  bodilyInjuryPerAccident: usd(70_000),
  propertyDamage: usd(25_000),
  pip: usd(15_000),
}
const belowMin = {
  bodilyInjuryPerPerson: usd(25_000),
  bodilyInjuryPerAccident: usd(50_000),
  propertyDamage: usd(10_000),
  pip: usd(10_000),
}

// Helper — ignore registration for tests that focus on insurance/licensing paths
const noReg = {
  ...NJ_S4834,
  registration: { ...NJ_S4834.registration, appliesToCategories: [] as const },
}

// ─── Classification boundaries ───────────────────────────────────────────────

describe('QA: classification boundaries', () => {
  const cases: ReadonlyArray<readonly [string, BikeProfile, string]> = [
    // throttle bikes
    ['throttle  1 mph,  100 W', mkBike('throttle', 1, 100), 'motorized'],
    ['throttle 15 mph,  250 W', mkBike('throttle', 15, 250), 'motorized'],
    ['throttle 16 mph,  500 W', mkBike('throttle', 16, 500), 'motorized'],
    ['throttle 20 mph,  500 W', mkBike('throttle', 20, 500), 'motorized'],
    ['throttle 28 mph,  750 W', mkBike('throttle', 28, 750), 'motorized'],
    ['throttle 29 mph,  500 W', mkBike('throttle', 29, 500), 'electric-motorized'],
    ['throttle 28 mph,  751 W', mkBike('throttle', 28, 751), 'electric-motorized'],
    ['throttle 50 mph, 1500 W', mkBike('throttle', 50, 1500), 'electric-motorized'],

    // pedal-assist
    ['pedal-assist  0 mph,    0 W', mkBike('pedal-assist-only', 0, 0), 'low-speed-electric'],
    ['pedal-assist 19 mph,  500 W', mkBike('pedal-assist-only', 19, 500), 'low-speed-electric'],
    ['pedal-assist 20 mph,  750 W', mkBike('pedal-assist-only', 20, 750), 'low-speed-electric'],
    ['pedal-assist 21 mph,  500 W', mkBike('pedal-assist-only', 21, 500), 'motorized'],
    ['pedal-assist 28 mph,  750 W', mkBike('pedal-assist-only', 28, 750), 'motorized'],
    ['pedal-assist 29 mph,  500 W', mkBike('pedal-assist-only', 29, 500), 'electric-motorized'],
    ['pedal-assist 20 mph,  751 W', mkBike('pedal-assist-only', 20, 751), 'electric-motorized'],

    // no motor → standard regardless of speed/watts (throttle:none short-circuits)
    ['throttle:none,  0 mph,    0 W', mkBike('none', 0, 0), 'standard'],
    ['throttle:none, 20 mph,  500 W', mkBike('none', 20, 500), 'standard'],
  ]

  it.each(cases)('%s → %s', (_, bike, expected) => {
    expect(NJ_S4834.appliesTo(bike)).toBe(expected)
  })
})

// ─── Class 3 ambiguity boundaries ────────────────────────────────────────────

describe('QA: Class 3 ambiguity boundaries', () => {
  const ambiguous: ReadonlyArray<readonly [string, BikeProfile]> = [
    ['pedal-assist 21 mph, 500 W (lower Class 3 edge)', mkBike('pedal-assist-only', 21, 500)],
    ['pedal-assist 25 mph, 500 W (mid Class 3)', mkBike('pedal-assist-only', 25, 500)],
    ['pedal-assist 28 mph, 750 W (upper Class 3 edge)', mkBike('pedal-assist-only', 28, 750)],
  ]
  it.each(ambiguous)('%s — produces classificationNote', (_, bike) => {
    const r = checkCompliance({ bike, operator: mkOp(35, 'basic-drivers'), policies: [{ kind: 'none' }], statute: NJ_S4834 })
    expect(r.classificationNote).toBeDefined()
  })

  const unambiguous: ReadonlyArray<readonly [string, BikeProfile]> = [
    ['pedal-assist 20 mph (low-speed)', mkBike('pedal-assist-only', 20, 500)],
    ['pedal-assist 29 mph (electric-motorized)', mkBike('pedal-assist-only', 29, 500)],
    ['pedal-assist 28 mph, 800 W (electric-motorized via watts)', mkBike('pedal-assist-only', 28, 800)],
    ['throttle 25 mph (motorized — no ambiguity)', mkBike('throttle', 25, 500)],
  ]
  it.each(unambiguous)('%s — no classificationNote', (_, bike) => {
    const r = checkCompliance({ bike, operator: mkOp(35, 'basic-drivers'), policies: [{ kind: 'none' }], statute: NJ_S4834 })
    expect(r.classificationNote).toBeUndefined()
  })
})

// ─── Age × license cross-product ─────────────────────────────────────────────

describe('QA: age × license cross-product on a low-speed bike', () => {
  type AL = readonly [string, number, 'basic-drivers' | 'motorized-bicycle' | 'none', 'license-ok' | 'license-gap' | 'prohibited']
  const matrix: ReadonlyArray<AL> = [
    ['age 10 + none', 10, 'none', 'prohibited'],
    ['age 14 + basic (impossible IRL, tests rule)', 14, 'basic-drivers', 'prohibited'],
    ['age 15 + none', 15, 'none', 'license-gap'],
    ['age 15 + basic (impossible IRL)', 15, 'basic-drivers', 'license-gap'],
    ['age 15 + motorized-bicycle', 15, 'motorized-bicycle', 'license-ok'],
    ['age 16 + none', 16, 'none', 'license-gap'],
    ['age 16 + basic (impossible IRL)', 16, 'basic-drivers', 'license-gap'],
    ['age 16 + motorized-bicycle', 16, 'motorized-bicycle', 'license-ok'],
    ['age 17 + none', 17, 'none', 'license-gap'],
    ['age 17 + basic', 17, 'basic-drivers', 'license-ok'],
    ['age 17 + motorized-bicycle', 17, 'motorized-bicycle', 'license-ok'],
    ['age 65 + basic', 65, 'basic-drivers', 'license-ok'],
  ]
  it.each(matrix)('%s → %s', (_, age, license, expected) => {
    const r = checkCompliance({
      bike: mkBike('pedal-assist-only', 20, 500),
      operator: mkOp(age, license),
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    if (expected === 'prohibited') {
      expect(r.status).toBe('prohibited')
      return
    }
    expect(r.status).toBe('gaps')
    if (r.status !== 'gaps') return
    const hasLicenseGap = r.gaps.some((g) => g.kind === 'license-required')
    expect(hasLicenseGap).toBe(expected === 'license-gap')
  })
})

// ─── Rental exemption cross-product ──────────────────────────────────────────

describe('QA: rental exemption cross-product', () => {
  it('age 15 + rental low-speed → license gap (rental needs 16+)', () => {
    const r = checkCompliance({
      bike: mkBike('pedal-assist-only', 20, 500, true),
      operator: mkOp(15, 'none'),
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(r.status).toBe('gaps')
    if (r.status !== 'gaps') return
    expect(r.gaps.some((g) => g.kind === 'license-required')).toBe(true)
  })

  it('age 16 + rental low-speed → fully compliant (rental exemption fires)', () => {
    const r = checkCompliance({
      bike: mkBike('pedal-assist-only', 20, 500, true),
      operator: mkOp(16, 'none'),
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(r.status).toBe('compliant')
  })

  it('age 16 + rental motorized (throttle) → still has license + reg + insurance gaps', () => {
    const r = checkCompliance({
      bike: mkBike('throttle', 25, 750, true),
      operator: mkOp(16, 'none'),
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(r.status).toBe('gaps')
    if (r.status !== 'gaps') return
    expect(r.gaps.some((g) => g.kind === 'license-required')).toBe(true)
    expect(r.gaps.some((g) => g.kind === 'registration-required')).toBe(true)
    expect(r.gaps.some((g) => g.kind === 'insurance')).toBe(true)
  })

  it('rental flag is irrelevant for standard bikes', () => {
    const r = checkCompliance({
      bike: mkBike('none', 0, 0, true),
      operator: mkOp(35, 'basic-drivers'),
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(r.status).toBe('not-applicable')
  })
})

// ─── Insurance via each policy kind, on a motorized bike ─────────────────────

describe('QA: insurance via each policy kind (motorized)', () => {
  const motorized = mkBike('throttle', 25, 750)
  const op = mkOp(35, 'basic-drivers')

  it('auto extendsToEbike=yes + meets minimums → no insurance gap', () => {
    const r = checkCompliance({
      bike: motorized,
      operator: op,
      policies: [{ kind: 'auto', extendsToEbike: 'yes', coverage: meetsMin }],
      statute: noReg,
    })
    expect(r.status).toBe('compliant')
  })

  it('auto extendsToEbike=yes + below minimums → buy-specialty remedy', () => {
    const r = checkCompliance({
      bike: motorized,
      operator: op,
      policies: [{ kind: 'auto', extendsToEbike: 'yes', coverage: belowMin }],
      statute: noReg,
    })
    expect(r.status).toBe('gaps')
    if (r.status !== 'gaps') return
    expect(r.remedies.some((m) => m.kind === 'buy-specialty-policy')).toBe(true)
    expect(r.remedies.some((m) => m.kind === 'verify-coverage-with-carrier')).toBe(false)
  })

  it('auto extendsToEbike=unknown → verify-with-carrier remedy', () => {
    const r = checkCompliance({
      bike: motorized,
      operator: op,
      policies: [{ kind: 'auto', extendsToEbike: 'unknown', coverage: meetsMin }],
      statute: noReg,
    })
    expect(r.status).toBe('gaps')
    if (r.status !== 'gaps') return
    expect(r.remedies.some((m) => m.kind === 'verify-coverage-with-carrier')).toBe(true)
  })

  it('auto extendsToEbike=never → buy-specialty remedy', () => {
    const r = checkCompliance({
      bike: motorized,
      operator: op,
      policies: [{ kind: 'auto', extendsToEbike: 'never', coverage: meetsMin }],
      statute: noReg,
    })
    expect(r.status).toBe('gaps')
    if (r.status !== 'gaps') return
    expect(r.remedies.some((m) => m.kind === 'buy-specialty-policy')).toBe(true)
    expect(r.remedies.some((m) => m.kind === 'verify-coverage-with-carrier')).toBe(false)
  })

  it('homeowners includesEbike=true + meets minimums → compliant', () => {
    const r = checkCompliance({
      bike: motorized,
      operator: op,
      policies: [{ kind: 'homeowners', includesEbike: true, coverage: meetsMin }],
      statute: noReg,
    })
    expect(r.status).toBe('compliant')
  })

  it('renters includesEbike=unknown → verify-with-carrier remedy', () => {
    const r = checkCompliance({
      bike: motorized,
      operator: op,
      policies: [{
        kind: 'renters',
        includesEbike: 'unknown',
        coverage: {
          bodilyInjuryPerPerson: null,
          bodilyInjuryPerAccident: null,
          propertyDamage: null,
          pip: null,
        },
      }],
      statute: NJ_S4834,
    })
    expect(r.status).toBe('gaps')
    if (r.status !== 'gaps') return
    expect(r.remedies.some((m) => m.kind === 'verify-coverage-with-carrier')).toBe(true)
  })

  it('specialty with null PIP → PIP-only gap', () => {
    const r = checkCompliance({
      bike: motorized,
      operator: op,
      policies: [{
        kind: 'specialty-ebike',
        coverage: {
          bodilyInjuryPerPerson: usd(35_000),
          bodilyInjuryPerAccident: usd(70_000),
          propertyDamage: usd(25_000),
          pip: null,
        },
      }],
      statute: noReg,
    })
    expect(r.status).toBe('gaps')
    if (r.status !== 'gaps') return
    const ins = r.gaps.find((g) => g.kind === 'insurance')
    if (ins?.kind !== 'insurance') return
    expect(ins.gaps).toHaveLength(1)
    expect(ins.gaps[0]?.axis).toBe('pip')
  })

  it('specialty all zeros → 4 gaps', () => {
    const r = checkCompliance({
      bike: motorized,
      operator: op,
      policies: [{
        kind: 'specialty-ebike',
        coverage: {
          bodilyInjuryPerPerson: usd(0),
          bodilyInjuryPerAccident: usd(0),
          propertyDamage: usd(0),
          pip: usd(0),
        },
      }],
      statute: noReg,
    })
    expect(r.status).toBe('gaps')
    if (r.status !== 'gaps') return
    const ins = r.gaps.find((g) => g.kind === 'insurance')
    if (ins?.kind !== 'insurance') return
    expect(ins.gaps).toHaveLength(4)
  })

  it('low-speed bike + insurance is irrelevant — never flagged regardless of policy', () => {
    const r = checkCompliance({
      bike: mkBike('pedal-assist-only', 20, 500),
      operator: op,
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(r.status).toBe('gaps')
    if (r.status !== 'gaps') return
    expect(r.gaps.some((g) => g.kind === 'insurance')).toBe(false)
  })
})

// ─── Reclassification doesn't fire spurious gaps or notes ────────────────────

describe('QA: reclassified path', () => {
  it('electric-motorized never produces gaps even with no policy/license', () => {
    const r = checkCompliance({
      bike: mkBike('throttle', 35, 1500),
      operator: mkOp(35, 'none'),
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(r.status).toBe('reclassified')
    if (r.status !== 'reclassified') return
    expect(r.targetClassification).toBe('motorcycle')
  })

  it('electric-motorized never produces a classificationNote (the category is unambiguous)', () => {
    const r = checkCompliance({
      bike: mkBike('pedal-assist-only', 35, 1500),
      operator: mkOp(35, 'none'),
      policies: [{ kind: 'none' }],
      statute: NJ_S4834,
    })
    expect(r.status).toBe('reclassified')
    expect(r.classificationNote).toBeUndefined()
  })
})
