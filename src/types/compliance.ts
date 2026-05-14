import type { Citation, ClassificationNote } from './statute'
import type { Coverage, CoverageAxis } from './coverage'
import type { USD } from './brands'

export type CoverageGap = {
  readonly axis: CoverageAxis
  readonly required: USD
  readonly current: USD | null
}

export type RegistrationGap = { readonly kind: 'registration-required' }

export type LicenseGap = {
  readonly kind: 'license-required'
  readonly accepted: ReadonlyArray<'basic-drivers' | 'motorized-bicycle'>
}

export type Gap =
  | { readonly kind: 'insurance'; readonly gaps: ReadonlyArray<CoverageGap> }
  | RegistrationGap
  | LicenseGap

export type Remedy =
  | { readonly kind: 'buy-specialty-policy'; readonly minimum: Coverage }
  | { readonly kind: 'register-with-mvc' }
  | {
      readonly kind: 'obtain-license'
      readonly options: ReadonlyArray<'basic-drivers' | 'motorized-bicycle'>
    }
  | { readonly kind: 'verify-coverage-with-carrier' }

export type Compliance =
  | {
      readonly status: 'not-applicable'
      readonly reason: string
      readonly citations: ReadonlyArray<Citation>
      readonly classificationNote?: ClassificationNote
    }
  | {
      readonly status: 'reclassified'
      readonly targetClassification: string
      readonly note: string
      readonly citations: ReadonlyArray<Citation>
      readonly classificationNote?: ClassificationNote
    }
  | {
      readonly status: 'prohibited'
      readonly reason: string
      readonly citations: ReadonlyArray<Citation>
      readonly classificationNote?: ClassificationNote
    }
  | {
      readonly status: 'compliant'
      readonly citations: ReadonlyArray<Citation>
      readonly classificationNote?: ClassificationNote
    }
  | {
      readonly status: 'gaps'
      readonly gaps: ReadonlyArray<Gap>
      readonly remedies: ReadonlyArray<Remedy>
      readonly citations: ReadonlyArray<Citation>
      readonly classificationNote?: ClassificationNote
    }
