import type { Years } from './brands'

export type LicenseKind = 'basic-drivers' | 'motorized-bicycle' | 'none'

export type OperatorProfile = {
  readonly age: Years
  readonly license: LicenseKind
}

/**
 * Human names for the license kinds, for use mid-sentence ("Accepted: a basic
 * driver's license or a motorized bicycle license").
 *
 * Typed as a total Record on purpose: adding a LicenseKind without adding its
 * prose here is a COMPILE error. The verdict used to join the raw enum ids,
 * which shipped "Accepted: basic-drivers or motorized-bicycle." to riders.
 */
export const licenseKindProse: Readonly<Record<LicenseKind, string>> = {
  'basic-drivers': "a basic driver's license",
  'motorized-bicycle': 'a motorized bicycle license',
  none: 'no license',
}
