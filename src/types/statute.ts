import type { Coverage } from './coverage'
import type { BikeProfile, BikeCategory } from './bike'
import type { Years } from './brands'

export type Jurisdiction = 'NJ' | 'CA' | 'FL' | 'HI' | 'IL' | 'MA' | 'NY' | 'NH' | 'UT' | 'WA'

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

/**
 * A minimum operating age tied to bike categories, independent of licensing.
 * (NJ couples its age floor to licensing; HI sets ages with no license at all.)
 */
export type OperatingAgeRule = {
  readonly categories: ReadonlyArray<BikeCategory>
  readonly minAge: Years
  /**
   * Overrides the engine's default "Operators under X may not operate"
   * message — e.g., Hawaii's rule is a supervision requirement, not an
   * absolute ban, and the verdict must say so.
   */
  readonly reason?: string
  readonly citations: ReadonlyArray<Citation>
}

/**
 * A category that may not be operated on public infrastructure at all
 * (e.g., Hawaii bans high-speed e-bikes from roads, bike lanes, and
 * sidewalks). Terminal: produces a 'prohibited' verdict.
 */
export type OperationBan = {
  readonly categories: ReadonlyArray<BikeCategory>
  readonly reason: string
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
    /** Categories exempt from registration when the bike is a shared-system rental. */
    readonly rentalExemptionCategories: ReadonlyArray<BikeCategory>
    /** Who you register with — drives the remedy link on the verdict page. */
    readonly authority: { readonly name: string; readonly url: string }
    readonly feeWaiverUntil: string | null
    readonly citations: ReadonlyArray<Citation>
  }
  readonly licensing: LicensingRule & {
    readonly appliesToCategories: ReadonlyArray<BikeCategory>
    readonly rentalExemptionCategories: ReadonlyArray<BikeCategory>
    readonly citations: ReadonlyArray<Citation>
  }
  /** Age floors that apply even where no license exists. */
  readonly operatingAges: ReadonlyArray<OperatingAgeRule>
  /** Categories banned outright from public infrastructure. */
  readonly operationBans: ReadonlyArray<OperationBan>
  readonly reclassifications: ReadonlyArray<ReclassificationRule>
  readonly exemptions: ReadonlyArray<{
    readonly description: string
    readonly citation: Citation
  }>
}
