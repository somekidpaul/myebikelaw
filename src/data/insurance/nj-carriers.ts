import type { CarrierEntry } from '../../types'

export const NJ_CARRIERS: ReadonlyArray<CarrierEntry> = [
  {
    id: 'velosurance',
    name: 'Velosurance',
    underwriter: 'Markel American Insurance Co. (A.M. Best A)',
    oneLiner:
      "The only carrier with an NJ-specific S4834 liability page (launched Jan 2026). Their guide cites an optional $100k limit as meeting the requirement, which comfortably clears the $15k/$30k/$5k the regulation actually sets. Still ask them to confirm the limits and the pedestrian PIP in writing when you quote.",
    jurisdictions: ['NJ'],
    pricing: { kind: 'quote-only' },
    njSpecificPage: true,
    complianceClaim: 'explicit',
    status: 'active',
    coverageHighlights: [
      'Optional liability from $25k to $500k — exact tiers shown at quote',
      'Their NJ guide cites the $100k option as S4834-sufficient; confirm in writing',
      'Insured at full bike value; crash + theft (incl. accessories)',
      'Cycling apparel + medical payments',
    ],
    quoteUrl: 'https://velosurance.com/usa/new-jersey/',
    source: {
      url: 'https://velosurance.com/usa/new-jersey/',
      lastVerified: '2026-08-03',
    },
  },
  {
    id: 'sundays',
    name: 'Sundays Insurance',
    oneLiner:
      "Theft-and-damage specialty coverage from ~$8/mo — but Sundays' own FAQ says they do not offer cyclist liability insurance, so a Sundays policy on its own cannot satisfy S4834.",
    jurisdictions: ['NJ'],
    pricing: { kind: 'starting', display: 'from ~$8/mo' },
    njSpecificPage: false,
    complianceClaim: 'none',
    status: 'active',
    coverageHighlights: [
      'No third-party liability offered — per their own FAQ',
      'Theft (at and away from home); accidental + malicious damage',
      'Up to $1,000 medical payments',
      '$75 transportation reimbursement after an accident',
      'Fine as a theft/damage supplement — not for S4834 liability',
    ],
    quoteUrl: 'https://quote.sundaysinsurance.com/',
    source: {
      url: 'https://sundaysinsurance.com/faq',
      lastVerified: '2026-08-03',
    },
  },
  {
    id: 'voom',
    name: 'VOOM Insurance',
    underwriter: 'Markel American Insurance Co. (A.M. Best A)',
    oneLiner:
      "Still pre-launch in NJ as of August 3, 2026, waitlist only, and the compliance deadline has already passed. VOOM's NJ S4834 guide still promises coverage \"launching soon\" but they aren't writing e-bike policies in the state yet. Their motorcycle product is active.",
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
      lastVerified: '2026-08-03',
    },
  },
]
