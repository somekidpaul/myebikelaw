import type { USD } from './brands'

export type Coverage = {
  readonly bodilyInjuryPerPerson: USD
  readonly bodilyInjuryPerAccident: USD
  readonly propertyDamage: USD
  readonly pip: USD | null
}

export type PartialCoverage = {
  readonly bodilyInjuryPerPerson: USD | null
  readonly bodilyInjuryPerAccident: USD | null
  readonly propertyDamage: USD | null
  readonly pip: USD | null
}

export const coverageAxes = [
  'bodilyInjuryPerPerson',
  'bodilyInjuryPerAccident',
  'propertyDamage',
  'pip',
] as const

export type CoverageAxis = (typeof coverageAxes)[number]
