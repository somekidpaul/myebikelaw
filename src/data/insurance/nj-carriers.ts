import type { CarrierEntry } from '../../types'

export const NJ_CARRIERS: ReadonlyArray<CarrierEntry> = [
  {
    id: 'sundays',
    name: 'Sundays Insurance',
    oneLiner:
      'E-bike specialty carrier with the clearest published starting price among the three.',
    jurisdictions: ['NJ'],
    pricing: { kind: 'starting', display: 'from ~$8/mo' },
    njSpecificPage: false,
    complianceClaim: 'unclear',
    coverageHighlights: [
      'Theft (at and away from home)',
      'Accidental + malicious damage',
      'Up to $1,000 medical payments',
      '$75 taxi reimbursement after theft',
      'Optional: worldwide, racing, accessories',
    ],
    quoteUrl: 'https://quote.sundaysinsurance.com/',
    source: {
      url: 'https://sundaysinsurance.com/electric-bike-insurance',
      lastVerified: '2026-05-12',
    },
  },
  {
    id: 'velosurance',
    name: 'Velosurance',
    underwriter: 'Markel American Insurance Co. (A.M. Best A)',
    oneLiner:
      'Only carrier with a dedicated NJ S4834 landing page and an explicit NJ-compliant product announcement.',
    jurisdictions: ['NJ'],
    pricing: { kind: 'quote-only' },
    njSpecificPage: true,
    complianceClaim: 'explicit',
    coverageHighlights: [
      'Insured at full bike value',
      'Crash + theft (including theft of accessories)',
      'Vehicle contact + personal liability',
      'Replacement rental, racing, in-transit coverage',
      'Cycling apparel + medical payments',
    ],
    quoteUrl: 'https://velosurance.com/usa/new-jersey/',
    source: {
      url: 'https://velosurance.com/usa/new-jersey/',
      lastVerified: '2026-05-12',
    },
  },
  {
    id: 'voom',
    name: 'VOOM Insurance',
    underwriter: 'Markel American Insurance Co. (A.M. Best A)',
    oneLiner:
      'Markel-underwritten like Velosurance. Announced an NJ-compliant product post-S4834, but NJ-specific pricing page not yet published.',
    jurisdictions: ['NJ'],
    pricing: {
      kind: 'starting',
      display: 'from ~$100/yr (general; NJ pricing not published)',
    },
    njSpecificPage: false,
    complianceClaim: 'explicit',
    coverageHighlights: [
      'Liability + physical damage',
      'Medical payments + theft protection',
      'Spare parts, accessories, cycling apparel',
    ],
    quoteUrl: 'https://www.voominsurance.com/e-bike-insurance',
    source: {
      url: 'https://www.voominsurance.com/e-bike-insurance',
      lastVerified: '2026-05-12',
    },
  },
]
