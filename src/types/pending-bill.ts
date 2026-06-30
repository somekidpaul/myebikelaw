import type { Jurisdiction } from './statute'

export type BillStatus =
  | 'filed'
  | 'in-committee'
  | 'in-appropriations'
  | 'held-in-committee'
  | 'near-final-vote'
  | 'passed-one-chamber'
  | 'passed-both-chambers'
  | 'signed-pending-effect'
  | 'vetoed'
  | 'enacted'

export type RequirementHint = 'license' | 'registration' | 'insurance'

export type PendingStateBill = {
  readonly state: Jurisdiction
  readonly stateName: string
  readonly billId: string
  readonly status: BillStatus
  readonly statusLabel: string
  readonly oneLiner: string
  readonly details: string
  readonly requirementHints: ReadonlyArray<RequirementHint>
  readonly proposedEffectiveDate?: string
  readonly sourceUrl: string
  readonly lastVerified: string
}
