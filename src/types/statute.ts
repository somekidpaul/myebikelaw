import type { Coverage } from './coverage'
import type { BikeProfile, BikeCategory } from './bike'
import type { Years } from './brands'

export type Jurisdiction = 'NJ' | 'CA' | 'FL' | 'HI' | 'IL' | 'MA' | 'NY' | 'NH'

export type Citation = {
  readonly statute: string
  readonly url: string
  readonly quote?: string
}

export type LicensingRule = {
  readonly minOperatorAge: Years
  readonly acceptedLicensesByAge: ReadonlyArray<{
    readonly minAge: Years
    readonly acceptedLicenses: ReadonlyArray<'basic-drivers' | 'motorized-bicycle'>
  }>
  readonly rentalExemptionMinAge: Years | null
}

export type ReclassificationRule = {
  readonly categories: ReadonlyArray<BikeCategory>
  readonly targetClassification: string
  readonly note: string
  readonly citations: ReadonlyArray<Citation>
}

export type ClassificationNote = {
  readonly chosen: BikeCategory
  readonly alternate: BikeCategory
  readonly reason: string
  /** 'conservative' = the more restrictive of the two readings. */
  readonly readingTaken: 'conservative' | 'permissive'
  readonly citations: ReadonlyArray<Citation>
}

export type StatutoryRequirement = {
  readonly jurisdiction: Jurisdiction
  readonly billId: string
  readonly title: string
  readonly enactedOn: string
  readonly complianceDeadline: string
  readonly appliesTo: (bike: BikeProfile) => BikeCategory | null
  readonly classificationNote?: (bike: BikeProfile) => ClassificationNote | null
  readonly insurance: {
    readonly appliesToCategories: ReadonlyArray<BikeCategory>
    readonly minimums: Coverage
    readonly citations: ReadonlyArray<Citation>
  }
  readonly registration: {
    readonly appliesToCategories: ReadonlyArray<BikeCategory>
    readonly rentalExemption: boolean
    readonly feeWaiverUntil: string | null
    readonly citations: ReadonlyArray<Citation>
  }
  readonly licensing: LicensingRule & {
    readonly appliesToCategories: ReadonlyArray<BikeCategory>
    readonly rentalExemptionCategories: ReadonlyArray<BikeCategory>
    readonly citations: ReadonlyArray<Citation>
  }
  readonly reclassifications: ReadonlyArray<ReclassificationRule>
  readonly exemptions: ReadonlyArray<{
    readonly description: string
    readonly citation: Citation
  }>
}
