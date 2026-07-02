import type { Jurisdiction, StatutoryRequirement } from '../../types'
import { NJ_S4834 } from './nj'
import { HI_HB2021 } from './hi'

/** Jurisdictions with a live compliance checker. */
export type CheckerJurisdiction = 'NJ' | 'HI'

export const STATUTES: Record<CheckerJurisdiction, StatutoryRequirement> = {
  NJ: NJ_S4834,
  HI: HI_HB2021,
}

export const JURISDICTION_NAMES: Record<CheckerJurisdiction, string> = {
  NJ: 'New Jersey',
  HI: 'Hawaii',
}

export function isCheckerJurisdiction(
  j: Jurisdiction,
): j is CheckerJurisdiction {
  return j === 'NJ' || j === 'HI'
}
