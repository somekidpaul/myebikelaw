import type {
  BikeCategory,
  BikeProfile,
  Compliance,
  Coverage,
  CoverageAxis,
  CoverageGap,
  ExistingPolicy,
  Gap,
  OperatorProfile,
  PartialCoverage,
  Remedy,
  StatutoryRequirement,
  USD,
} from '../types'
import { coverageAxes, usd } from '../types'

export type ComplianceInput = {
  readonly bike: BikeProfile
  readonly operator: OperatorProfile
  readonly policies: ReadonlyArray<ExistingPolicy>
  readonly statute: StatutoryRequirement
}

export function checkCompliance(input: ComplianceInput): Compliance {
  const { bike, operator, policies, statute } = input
  const category = statute.appliesTo(bike)
  const classificationNote = statute.classificationNote?.(bike) ?? undefined

  if (category === null || category === 'standard') {
    return {
      status: 'not-applicable',
      reason:
        category === 'standard'
          ? "This statute applies only to electric bicycles. Standard pedal bicycles aren't regulated by this law."
          : "This bike does not fall under the statute's definitions.",
      citations: statute.licensing.citations,
      classificationNote,
    }
  }

  const reclassification = statute.reclassifications.find((r) =>
    r.categories.includes(category),
  )
  if (reclassification) {
    return {
      status: 'reclassified',
      targetClassification: reclassification.targetClassification,
      note: reclassification.note,
      citations: reclassification.citations,
      classificationNote,
    }
  }

  if (
    statute.licensing.appliesToCategories.includes(category) &&
    operator.age < statute.licensing.minOperatorAge
  ) {
    return {
      status: 'prohibited',
      reason: `Operators under ${statute.licensing.minOperatorAge} may not operate this bike.`,
      citations: statute.licensing.citations,
      classificationNote,
    }
  }

  const gaps: Gap[] = []
  const remedies: Remedy[] = []

  if (statute.licensing.appliesToCategories.includes(category)) {
    const licenseGap = evaluateLicense(operator, bike, category, statute)
    if (licenseGap) {
      gaps.push(licenseGap)
      remedies.push({ kind: 'obtain-license', options: licenseGap.accepted })
    }
  }

  if (statute.registration.appliesToCategories.includes(category)) {
    const isExemptRental =
      statute.registration.rentalExemption &&
      bike.isRentalFromSharedSystem &&
      category === 'low-speed-electric'
    if (!isExemptRental && !bike.isRegistered) {
      gaps.push({ kind: 'registration-required' })
      remedies.push({ kind: 'register-with-mvc' })
    }
  }

  if (statute.insurance.appliesToCategories.includes(category)) {
    const effective = aggregateCoverage(policies)
    const coverageGaps = findCoverageGaps(statute.insurance.minimums, effective)
    if (coverageGaps.length > 0) {
      gaps.push({ kind: 'insurance', gaps: coverageGaps })
      remedies.push(
        hasUnverifiedExtension(policies)
          ? { kind: 'verify-coverage-with-carrier' }
          : { kind: 'buy-specialty-policy', minimum: statute.insurance.minimums },
      )
    }
  }

  if (gaps.length === 0) {
    return {
      status: 'compliant',
      citations: collectCitations(statute, category),
      classificationNote,
    }
  }

  return {
    status: 'gaps',
    gaps,
    remedies,
    citations: collectCitations(statute, category),
    classificationNote,
  }
}

function evaluateLicense(
  operator: OperatorProfile,
  bike: BikeProfile,
  category: BikeCategory,
  statute: StatutoryRequirement,
):
  | { readonly kind: 'license-required'; readonly accepted: ReadonlyArray<'basic-drivers' | 'motorized-bicycle'> }
  | null {
  const isExemptRental =
    bike.isRentalFromSharedSystem &&
    statute.licensing.rentalExemptionCategories.includes(category) &&
    statute.licensing.rentalExemptionMinAge !== null &&
    operator.age >= statute.licensing.rentalExemptionMinAge
  if (isExemptRental) return null

  const rule = statute.licensing.acceptedLicensesByAge
    .filter((r) => operator.age >= r.minAge)
    .sort((a, b) => b.minAge - a.minAge)[0]

  if (!rule) return null

  if (rule.acceptedLicenses.includes(operator.license as never)) return null

  return { kind: 'license-required', accepted: rule.acceptedLicenses }
}

function aggregateCoverage(
  policies: ReadonlyArray<ExistingPolicy>,
): PartialCoverage {
  let bipp: USD | null = null
  let bipa: USD | null = null
  let pd: USD | null = null
  let pip: USD | null = null

  const take = (a: USD | null, b: USD | null): USD | null => {
    if (a === null) return b
    if (b === null) return a
    return usd(Math.max(a, b))
  }

  for (const policy of policies) {
    const c = effectiveCoverage(policy)
    if (!c) continue
    bipp = take(bipp, c.bodilyInjuryPerPerson)
    bipa = take(bipa, c.bodilyInjuryPerAccident)
    pd = take(pd, c.propertyDamage)
    pip = take(pip, c.pip)
  }

  return {
    bodilyInjuryPerPerson: bipp,
    bodilyInjuryPerAccident: bipa,
    propertyDamage: pd,
    pip,
  }
}

function effectiveCoverage(policy: ExistingPolicy): PartialCoverage | null {
  switch (policy.kind) {
    case 'none':
      return null
    case 'specialty-ebike':
      return policy.coverage
    case 'auto':
      return policy.extendsToEbike === 'yes' ? policy.coverage : null
    case 'homeowners':
    case 'renters':
      return policy.includesEbike === true ? policy.coverage : null
  }
}

function hasUnverifiedExtension(policies: ReadonlyArray<ExistingPolicy>): boolean {
  return policies.some((p) => {
    if (p.kind === 'auto') return p.extendsToEbike === 'unknown'
    if (p.kind === 'homeowners' || p.kind === 'renters')
      return p.includesEbike === 'unknown'
    return false
  })
}

function findCoverageGaps(
  required: Coverage,
  actual: PartialCoverage,
): ReadonlyArray<CoverageGap> {
  const gaps: CoverageGap[] = []
  for (const axis of coverageAxes) {
    const req = required[axis]
    const cur = actual[axis]
    if (req === null) continue
    if (cur === null || cur < req) {
      gaps.push(coverageGapAt(axis, req, cur))
    }
  }
  return gaps
}

function coverageGapAt(
  axis: CoverageAxis,
  required: USD,
  current: USD | null,
): CoverageGap {
  return { axis, required, current }
}

function collectCitations(
  statute: StatutoryRequirement,
  category: BikeCategory,
) {
  const out = []
  if (statute.insurance.appliesToCategories.includes(category)) {
    out.push(...statute.insurance.citations)
  }
  if (statute.registration.appliesToCategories.includes(category)) {
    out.push(...statute.registration.citations)
  }
  if (statute.licensing.appliesToCategories.includes(category)) {
    out.push(...statute.licensing.citations)
  }
  return out
}
