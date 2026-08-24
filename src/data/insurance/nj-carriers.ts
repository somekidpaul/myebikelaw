import type { CarrierEntry } from '../../types'

export const NJ_CARRIERS: ReadonlyArray<CarrierEntry> = [
  {
    id: 'velosurance',
    name: 'Velosurance',
    underwriter: 'Markel American Insurance Co. (A.M. Best A)',
    oneLiner:
      "The only carrier with an NJ-specific S4834 liability page, and in July 2026 it added a liability-only option built for this law. Its page states the requirement as $15k/$30k/$5k, which matches the regulation. Heads up: that page also tells riders insurance is required for every e-bike class, and that S4834 makes a helmet mandatory for every rider regardless of age. Neither is in the enacted act. Insurance is required only of motorized bicycles, and the act contains no helmet provision at all. Quote the product, not the legal summary, and ask them to confirm your limits and the pedestrian PIP in writing.",
    jurisdictions: ['NJ'],
    pricing: { kind: 'quote-only' },
    njSpecificPage: true,
    complianceClaim: 'explicit',
    status: 'active',
    coverageHighlights: [
      'Liability-only option for NJ riders, added July 2026, written to meet the state minimums',
      'Liability limits available up to $500k; exact tiers shown at quote',
      'Full policy adds theft, crash and accidental damage, and damage in transit',
      'Optional medical payments; cycling apparel and accessories',
    ],
    quoteUrl: 'https://velosurance.com/usa/new-jersey/',
    source: {
      url: 'https://velosurance.com/usa/new-jersey/',
      lastVerified: '2026-08-24',
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
      lastVerified: '2026-08-24',
    },
  },
  {
    id: 'voom',
    name: 'VOOM Insurance',
    underwriter: 'Markel American Insurance Co. (A.M. Best A)',
    oneLiner:
      "Still pre-launch in NJ as of August 24, 2026, waitlist only, and the compliance deadline has already passed. VOOM's NJ S4834 guide still promises coverage \"launching soon\" but they aren't writing e-bike policies in the state yet. Their motorcycle product is active. Heads up: that guide also states the minimum as $35,000 bodily injury, which is the automobile figure, not what the regulation requires of a motorized bicycle.",
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
      lastVerified: '2026-08-24',
    },
  },
]
