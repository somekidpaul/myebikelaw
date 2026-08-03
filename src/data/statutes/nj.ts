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
    if (bike.throttle === 'none') return null

    // The statute's "electric motorized bicycle" definition is conjunctive:
    // a motor >750 W AND a top assisted speed >28 mph. A bike that crosses only
    // ONE of those thresholds satisfies neither that definition nor the
    // "motorized bicycle" sub-types (which cap at ≤750 W and ≤28 mph), so it sits
    // in a statutory gap. appliesTo() routes it to the strictest category
    // (electric-motorized / motorcycle) so the rider is never under-warned — but
    // because that is a judgment call rather than a clean statutory fit, we
    // surface it as an ambiguity instead of asserting it. (When BOTH thresholds
    // are crossed the category is unambiguous, so no note fires.)
    const over750w = bike.motorWatts > 750
    const over28mph = bike.topMotorAssistedSpeed > 28
    if (over750w !== over28mph) {
      return {
        chosen: 'electric-motorized',
        alternate: 'motorized',
        reason:
          "New Jersey defines an “electric motorized bicycle” conjunctively: a motor over 750 W AND an assisted speed over 28 mph. Your bike crosses only one of those two thresholds, so it doesn't meet that definition — but it also exceeds the ≤750 W / ≤28 mph limits of the “motorized bicycle” category, leaving it in a statutory gap. This tool applies the strictest category (motorcycle license, registration, and insurance) so you aren't under-warned; a narrower reading would treat it as a motorized bicycle. Confirm with the NJ MVC and your insurer before relying on either reading.",
        readingTaken: 'conservative',
        citations: [
          {
            statute: 'S4834 — electric motorized bicycle definition',
            url: 'https://pub.njleg.gov/Bills/2024/S5000/4834_R1a.HTM',
          },
        ],
      }
    }

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
    // WHERE THE DOLLAR FIGURES COME FROM (read this before changing them).
    // S4834 sets NO insurance amounts. C.39:4-14.3e requires a motorized-bicycle
    // policy covering "bodily injury, death and property damage" and then
    // expressly delegates the numbers: "The Commissioner of Insurance... shall by
    // regulation fix the amounts and limits of coverage." That regulation is
    // N.J.A.C. 11:3-11.1 ("Required coverages for mopeds"), which binds any
    // policy on "a motorized bicycle as defined in N.J.S.A. 39:1-1" (exactly the
    // category S4834's insurance duty attaches to) at $15k / $30k / $5k.
    //
    // Do NOT substitute the standard AUTO minimums (N.J.S.A. 39:6B-1, raised to
    // $35k/$70k/$25k on Jan 1, 2026 by P.L.2022 c.87 / DOBI Bulletin 25-06).
    // That bulletin is addressed to automobile insurers and is silent on mopeds
    // and motorized bicycles; 39:6B-1 does not reach this policy. The site
    // carried $35k/$70k/$25k until 2026-08-03 and it was wrong. It overstated
    // the requirement by more than double.
    //
    // pip stays null on purpose. N.J.A.C. 11:3-11.1(b) DOES require the policy to
    // carry pedestrian PIP "in accordance with N.J.S.A. 39:6A-4", but that is a
    // coverage the insurer must build in at the statutory schedule, not a limit
    // the rider selects and can fall short of, so there is no rider-side number
    // to compare against. Null means "nothing for the rider to check," NOT
    // "the policy has no PIP."
    minimums: {
      bodilyInjuryPerPerson: usd(15_000),
      bodilyInjuryPerAccident: usd(30_000),
      propertyDamage: usd(5_000),
      pip: null,
    },
    citations: [
      {
        statute: 'S4834 §5 — insurance for a motorized bicycle',
        url: billText,
        quote:
          'A person shall have six months following the effective date to obtain insurance for a motorized bicycle. (Insurance is not enumerated as a requirement for a low-speed electric bicycle.)',
      },
      {
        statute: 'C.39:4-14.3e (the policy requirement, and who sets the amounts)',
        url: 'https://law.justia.com/codes/new-jersey/title-39/section-39-4-14-3e/',
        quote:
          'Every owner of a motorized bicycle principally garaged or operated in this State... shall maintain liability insurance coverage... insuring against loss resulting from liability imposed by law for bodily injury, death and property damage... The Commissioner of Insurance, in consultation with the Director of the Division of Motor Vehicles, shall by regulation fix the amounts and limits of coverage of, and requirements for, such insurance. (The statute names no dollar figures. The regulation below does.)',
      },
      {
        statute: 'N.J.A.C. 11:3-11.1 (the regulation that fixes the amounts)',
        url: 'https://www.law.cornell.edu/regulations/new-jersey/N-J-A-C-11-3-11-1',
        quote:
          'No policy... arising out of the ownership, operation or use of a motorized bicycle as defined in N.J.S.A. 39:1-1... shall be issued... unless it includes coverage... [of] $15,000... on account of injury to, or death of, one person, in any one accident; and... $30,000... on account of injury to or death of more than one person, in any one accident... [and] $5,000 in the aggregate for damage to property of others resulting from one accident.',
      },
      {
        statute: 'N.J.A.C. 11:3-11.1(b): pedestrian PIP is built into the policy',
        url: 'https://www.law.cornell.edu/regulations/new-jersey/N-J-A-C-11-3-11-1',
        quote:
          "Every liability insurance policy as described in (a) above... shall provide personal injury protection coverage benefits, in accordance with N.J.S.A. 39:6A-4, to pedestrians who sustain bodily injury in this State caused by the named insured's motorized bicycle. (Your insurer must include this at the statutory schedule. There is no limit for you to choose, which is why the form does not ask.)",
      },
      {
        statute: 'S4834 §4 / C.39:6A-4.8 (a separate, later pedestrian-PIP change to AUTO policies)',
        url: billText,
        quote:
          "\"'Pedestrian' shall include any person operating a bicycle or low-speed electric bicycle... the injury or death shall be covered by the pedestrian's personal injury coverage.\" Takes effect for standard auto policies issued or renewed on or after January 1, 2027. This one rides on the injured rider's OWN auto policy and covers bicycle and low-speed e-bike riders. It is not the same as the pedestrian PIP your motorized-bicycle policy must carry under N.J.A.C. 11:3-11.1(b).",
      },
    ],
  },

  registration: {
    appliesToCategories: ['low-speed-electric', 'motorized'],
    rentalExemptionCategories: ['low-speed-electric'],
    authority: { name: 'NJ Motor Vehicle Commission', url: mvcPage },
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

  operatingAges: [
    {
      categories: ['low-speed-electric', 'motorized'],
      minAge: years(15),
      citations: [
        {
          statute: 'S4834 §3 — operator age and licensing',
          url: billText,
          quote:
            'No person under 15 may operate. 15-16 requires a motorized bicycle license/permit. 17+ requires a basic driver\'s license or motorized bicycle license/permit.',
        },
      ],
    },
  ],

  operationBans: [],

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
