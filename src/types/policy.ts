import type { Coverage, PartialCoverage } from './coverage'

export type ExistingPolicy =
  | { readonly kind: 'none' }
  | {
      readonly kind: 'specialty-ebike'
      readonly carrier?: string
      readonly coverage: Coverage
    }
  | {
      readonly kind: 'homeowners'
      readonly carrier?: string
      readonly includesEbike: boolean | 'unknown'
      readonly coverage: PartialCoverage
    }
  | {
      readonly kind: 'renters'
      readonly carrier?: string
      readonly includesEbike: boolean | 'unknown'
      readonly coverage: PartialCoverage
    }
  | {
      readonly kind: 'auto'
      readonly carrier?: string
      readonly extendsToEbike: 'never' | 'yes' | 'unknown'
      readonly coverage: Coverage
    }

export type PolicyKind = ExistingPolicy['kind']
