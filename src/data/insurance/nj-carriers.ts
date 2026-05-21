import type { CarrierEntry } from '../../types'

export const NJ_CARRIERS: ReadonlyArray<CarrierEntry> = [
  {
    id: 'velosurance',
    name: 'Velosurance',
    underwriter: 'Markel American Insurance Co. (A.M. Best A)',
    oneLiner:
      "The only carrier currently writing S4834-compliant e-bike policies in NJ. Their NJ guide explicitly cites the $100k liability tier as meeting the $35k/$70k/$25k minimums; a $500k tier was added in late 2024.",
    jurisdictions: ['NJ'],
    pricing: { kind: 'quote-only' },
    njSpecificPage: true,
    complianceClaim: 'explicit',
    status: 'active',
    coverageHighlights: [
      'Liability tiers: $25k / $50k / $100k / $300k / $500k',
      'Insured at full bike value',
      'Crash + theft (including accessories)',
      'Replacement rental, racing, in-transit coverage',
      'Cycling apparel + medical payments',
    ],
    quoteUrl: 'https://velosurance.com/usa/new-jersey/',
    source: {
      url: 'https://velosurance.com/usa/new-jersey/',
      lastVerified: '2026-05-21',
    },
  },
  {
    id: 'sundays',
    name: 'Sundays Insurance',
    oneLiner:
      "E-bike specialty carrier writing in NJ at $8/mo, but liability tiers aren't published — call before assuming the policy meets S4834. Medical payments capped at $1,000.",
    jurisdictions: ['NJ'],
    pricing: { kind: 'starting', display: 'from ~$8/mo' },
    njSpecificPage: false,
    complianceClaim: 'unclear',
    status: 'active',
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
      lastVerified: '2026-05-21',
    },
  },
  {
    id: 'voom',
    name: 'VOOM Insurance',
    underwriter: 'Markel American Insurance Co. (A.M. Best A)',
    oneLiner:
      "Pre-launch in NJ — waitlist only. VOOM's NJ S4834 guide promises coverage \"launching soon\" but they aren't writing e-bike policies in the state yet. Their motorcycle product is still active.",
    jurisdictions: ['NJ'],
    pricing: {
      kind: 'starting',
      display: 'NJ launch TBD — waitlist signup at the link',
    },
    njSpecificPage: false,
    complianceClaim: 'unclear',
    status: 'waitlist',
    coverageHighlights: [
      'Liability + physical damage (general product)',
      'Medical payments + theft protection',
      'Spare parts, accessories, cycling apparel',
    ],
    quoteUrl: 'https://www.voominsurance.com/blog/nj-ebike-insurance-legislation-guide-2026',
    source: {
      url: 'https://www.voominsurance.com/blog/nj-ebike-insurance-legislation-guide-2026',
      lastVerified: '2026-05-21',
    },
  },
]
