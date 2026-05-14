import type { Years } from './brands'

export type LicenseKind = 'basic-drivers' | 'motorized-bicycle' | 'none'

export type OperatorProfile = {
  readonly age: Years
  readonly license: LicenseKind
}
