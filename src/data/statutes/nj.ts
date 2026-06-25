import type { StatutoryRequirement } from '../../types'
import { usd, years } from '../../types'

const billPage = 'https://www.njleg.state.nj.us/bill-search/2024/S4834'
const billText = 'https://pub.njleg.gov/Bills/2024/S5000/4834_R1a.HTM'
const mvcPage = 'https://www.nj.gov/mvc/vehicletopics/ebike.htm'

export const NJ_S4834: StatutoryRequirement = {
  jurisdiction: 'NJ',
  billId: 'S4834 / P.L.2025, c.285',
  title:
    'An Act concerning the requirements for operating certain electric bicycles',
  enactedOn: '2026-01-19',
  complianceDeadline: '2026-07-19',

  appliesTo: (bike) => {
    if (bike.throttle === 'none') return 'standard'
    // The statute's "electric motorized bicycle" definition is conjunctive:
    // a motor >750W AND a top assisted speed >28 mph. We deliberately route a
    // bike that crosses EITHER threshold to this (motorcycle) path: a bike over
    // only one threshold fits no other category cleanly (the motorized-bicycle
    // sub-types all cap at 28 mph), so the conservative reading is to treat it
    // as the strictest category rather than risk under-warning the rider.
    const over750w = bike.motorWatts > 750
    const over28mph = bike.topMotorAssistedSpeed > 28
    if (over750w || over28mph) return 'electric-motorized'
    if (bike.throttle === 'throttle') return 'motorized'
    return bike.topMotorAssistedSpeed <= 20 ? 'low-speed-electric' : 'motorized'
  },

  classificationNote: (bike) => {
    // Class 3 e-bike: pedal-assist only, 21-28 mph, ≤750 W.
    // The bill's "motorized bicycle" sub-types explicitly cover gas helper motors
    // at this speed (sub-3) and electric throttle bikes (sub-4), but not electric
    // pedal-assist at 21-28 mph. Real statutory gap.
    const isClass3 =
      bike.throttle === 'pedal-assist-only' &&
      bike.topMotorAssistedSpeed > 20 &&
      bike.topMotorAssistedSpeed <= 28 &&
      bike.motorWatts <= 750
    if (!isClass3) return null
    return {
      chosen: 'motorized',
      alternate: 'low-speed-electric',
      reason:
        "Class 3 e-bikes (pedal-assist only, 21–28 mph) don't cleanly fit any of the bill's 'motorized bicycle' sub-definitions. Sub-type 3 covers gas helper motors in this speed range; sub-type 4 covers electric throttle bikes. Electric pedal-assist at 21–28 mph falls in a statutory gap. We classify it conservatively as motorized so you don't accidentally ride uninsured — cycling advocates have argued it should remain low-speed-electric until amended.",
      readingTaken: 'conservative',
      citations: [
        {
          statute: 'S4834 — motorized bicycle sub-types',
          url: 'https://pub.njleg.gov/Bills/2024/S5000/4834_R1a.HTM',
        },
      ],
    }
  },

  insurance: {
    appliesToCategories: ['motorized'],
    minimums: {
      bodilyInjuryPerPerson: usd(35_000),
      bodilyInjuryPerAccident: usd(70_000),
      propertyDamage: usd(25_000),
      pip: usd(15_000),
    },
    citations: [
      {
        statute: 'S4834 §5 — insurance for a motorized bicycle',
        url: billText,
        quote:
          'A person shall have six months following the effective date to obtain insurance for a motorized bicycle. (Insurance is not enumerated as a requirement for a low-speed electric bicycle.)',
      },
      {
        statute: 'N.J.S.A. 39:6B-1 (motor vehicle liability minimums) — NJ DOBI bulletin',
        url: 'https://www.nj.gov/dobi/bulletins/blt25_06.pdf',
        quote:
          '$35,000 bodily injury per person / $70,000 per accident / $25,000 property damage for policies issued on or after January 1, 2026.',
      },
      {
        statute: 'N.J.S.A. 39:6A — AICRA (PIP coverage)',
        url: 'https://www.nj.gov/oag/insurancefraud/pdfs/aicra-act.pdf',
        quote:
          '$15,000 PIP per person is the NJ basic-policy floor. Standard policies offer $50k–$250k. The figure your specialty e-bike policy carries depends on the policy tier — confirm with your carrier; the $15k cited here is a conservative minimum, not a ceiling.',
      },
    ],
  },

  registration: {
    appliesToCategories: ['low-speed-electric', 'motorized'],
    rentalExemption: true,
    feeWaiverUntil: '2027-01-19',
    citations: [
      {
        statute: 'S4834 §6 — registration requirement',
        url: billText,
        quote:
          'No low-speed electric bicycle or motorized bicycle shall be operated on the public highways unless registered. The Motor Vehicle Commission shall waive all examination, registration, and licensing fees for one year following the effective date. Shared-rental companies may bulk-register quarterly in lieu of per-bike registration.',
      },
      { statute: 'NJ MVC e-bike requirements page', url: mvcPage },
    ],
  },

  licensing: {
    appliesToCategories: ['low-speed-electric', 'motorized'],
    rentalExemptionCategories: ['low-speed-electric'],
    minOperatorAge: years(15),
    acceptedLicensesByAge: [
      { minAge: years(17), acceptedLicenses: ['basic-drivers', 'motorized-bicycle'] },
      { minAge: years(15), acceptedLicenses: ['motorized-bicycle'] },
    ],
    rentalExemptionMinAge: years(16),
    citations: [
      {
        statute: 'S4834 §3 — operator age and licensing',
        url: billText,
        quote:
          'No person under 15 may operate. 15-16 requires a motorized bicycle license/permit. 17+ requires a basic driver\'s license or motorized bicycle license/permit. Renters of shared low-speed electric bicycles are exempt if the operator is 16 or older.',
      },
    ],
  },

  reclassifications: [
    {
      categories: ['electric-motorized'],
      targetClassification: 'motorcycle',
      note: 'The statute defines an electric motorized bicycle as having a motor greater than 750W AND a top assisted speed greater than 28 mph; these are treated as motorcycles under New Jersey law, so motorcycle license, registration, and insurance rules apply — different from the motorized bicycle requirements in this bill. This tool takes the conservative reading and also routes a bike that exceeds only one of those thresholds here, because such a bike fits no other category cleanly.',
      citations: [
        {
          statute: 'S4834 — electric motorized bicycle definition',
          url: billText,
          quote:
            'Electric motorized bicycle: any two-wheeled vehicle with fully operable pedals and an electric motor capable of greater than 750 watts that is capable of reaching a speed greater than 28 miles per hour.',
        },
        {
          statute: 'NJ MVC motorcycle requirements',
          url: 'https://www.nj.gov/mvc/vehicletopics/motorcycle.htm',
        },
      ],
    },
  ],

  exemptions: [
    {
      description:
        'Low-speed electric scooters are fully exempt from registration and licensing.',
      citation: { statute: 'S4834 §10', url: billText },
    },
    {
      description:
        'Operators of rental shared low-speed electric bicycles do not need a license if they are 16 or older and the operator is contracted with a local government.',
      citation: { statute: 'S4834 §3', url: billText },
    },
    {
      description:
        'Insurance is NOT required for low-speed electric bicycles (pedal-assist, motor cuts at 20 mph) per the bill — only motorized bicycles need insurance.',
      citation: { statute: 'S4834 §5', url: billText },
    },
  ],
}

export const NJ_S4834_SOURCES = { billPage, billText, mvcPage } as const
