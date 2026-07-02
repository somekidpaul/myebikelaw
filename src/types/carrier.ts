import type { Jurisdiction } from './statute'

export type CarrierId =
  | 'velosurance'
  | 'voom'
  | 'sundays'
  | 'markel-direct'

export type CarrierPricing =
  | { readonly kind: 'quote-only' }
  | { readonly kind: 'starting'; readonly display: string }

/**
 * 'none' = the carrier affirmatively does NOT offer the liability coverage
 * S4834 requires (listed anyway to correct the assumption that any "e-bike
 * insurance" satisfies the law).
 */
export type S4834ComplianceClaim = 'explicit' | 'implicit' | 'unclear' | 'none'

export type CarrierStatus = 'active' | 'waitlist'

export type CarrierEntry = {
  readonly id: CarrierId
  readonly name: string
  readonly underwriter?: string
  readonly jurisdictions: ReadonlyArray<Jurisdiction>
  readonly oneLiner: string
  readonly pricing: CarrierPricing
  readonly njSpecificPage: boolean
  readonly complianceClaim: S4834ComplianceClaim
  readonly coverageHighlights: ReadonlyArray<string>
  readonly quoteUrl: string
  readonly status?: CarrierStatus
  readonly source: {
    readonly url: string
    readonly lastVerified: string
  }
}
