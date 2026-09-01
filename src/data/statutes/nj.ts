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
        statute: 'S4834 §11 — six-month grace period to obtain insurance',
        url: billText,
        quote:
          'A person shall have six months following the effective date ... to obtain: a. insurance for a motorized bicycle that was not required to have insurance prior to the effective date ...',
        note:
          'Only a motorized bicycle is named. The act nowhere requires insurance for a low-speed electric bicycle; §3 (C.39:4-14.16(f)(2)) requires that rider to register and to hold a license, and stops there.',
      },
      {
        statute: 'C.39:4-14.3e (the policy requirement, and who sets the amounts)',
        url: 'https://law.justia.com/codes/new-jersey/title-39/section-39-4-14-3e/',
        quote:
          "Every owner of a motorized bicycle principally garaged or operated in this State and every person in the business of renting motorized bicycles shall maintain liability insurance coverage, under provisions approved by the Commissioner of Insurance, insuring against loss resulting from liability imposed by law for bodily injury, death and property damage sustained by any person arising out of the ownership, operation or use of a motorized bicycle. The Commissioner of Insurance, in consultation with the Director of the Division of Motor Vehicles, shall by regulation fix the amounts and limits of coverage of, and requirements for, such insurance.",
        note:
          'This statute names no dollar figures. It delegates them to the regulation below.',
      },
      {
        statute: 'N.J.A.C. 11:3-11.1 (the regulation that fixes the amounts)',
        url: 'https://www.law.cornell.edu/regulations/new-jersey/N-J-A-C-11-3-11-1',
        quote:
          "No policy insuring against loss resulting from liability imposed by law for bodily injury, death and property damage sustained by any person arising out of the ownership, operation or use of a motorized bicycle as defined in N.J.S.A. 39:1-1, as amended, shall be issued in the State to the owner (or parent or guardian of an owner under 18 years of age) of any motorized bicycle principally garaged or operated in this State unless it includes coverage for the owner and operator in the following minimum amounts or limits. 1. Bodily injury; i. An amount or limit of $15,000, exclusive of interest and costs, on account of injury to, or death of, one person, in any one accident; and ii. An amount or limit, subject to such limit for any one person so injured or killed, of $30,000, exclusive of interest and costs, on account of injury to or death of more than one person, in any one accident. 2. Property damage: An amount or limit of $5,000 in the aggregate for damage to property of others resulting from one accident.",
        note:
          'This is the regulation S4834 ultimately points to, and it is where the $15,000 / $30,000 / $5,000 figures come from.',
      },
      {
        statute: 'N.J.A.C. 11:3-11.1(b): pedestrian PIP is built into the policy',
        url: 'https://www.law.cornell.edu/regulations/new-jersey/N-J-A-C-11-3-11-1',
        quote:
          "Every liability insurance policy as described in (a) above, issued or renewed on or after April 22, 1985, shall provide personal injury protection coverage benefits, in accordance with N.J.S.A. 39:6A-4, to pedestrians who sustain bodily injury in this State caused by the named insured's motorized bicycle or caused by being struck by or from the motorized bicycle.",
        note:
          'Your insurer must build this in at the statutory schedule. There is no limit for you to pick, which is why the form does not ask for one.',
      },
      {
        statute: 'S4834 §4 / C.39:6A-4.8 (a separate, later pedestrian-PIP change to AUTO policies)',
        url: billText,
        quote:
          `"Pedestrian" shall include any person operating a bicycle or low-speed electric bicycle, as those terms are defined in R.S.39:1-1. ... If a pedestrian is involved in an accident resulting in injury or death to the pedestrian, the injury or death shall be covered by the pedestrian's personal injury coverage in accordance with section 4 of P.L.1972, c.70 (C.39:6A-4).`,
        note:
          "Per §13 this section takes effect on the first day of the 12th month after enactment, so it applies to standard automobile policies issued or renewed on or after January 1, 2027. It rides on the injured rider's OWN auto policy and reaches bicycle and low-speed e-bike riders, not motorized-bicycle riders. It is not the same thing as the pedestrian PIP a motorized-bicycle policy must carry under N.J.A.C. 11:3-11.1(b).",
      },
    ],
  },

  registration: {
    appliesToCategories: ['low-speed-electric', 'motorized'],
    rentalExemptionCategories: ['low-speed-electric'],
    // Includes the leading article so the name drops cleanly into every
    // sentence that uses it (verdict copy, remedy link, form checkbox).
    authority: { name: 'the NJ Motor Vehicle Commission', url: mvcPage },
    feeWaiverUntil: '2027-01-19',
    citations: [
      {
        statute: 'S4834 §6 — C.39:4-14.3i (registration requirement)',
        url: billText,
        quote:
          'no low-speed electric bicycle or motorized bicycle, as those terms are defined by R.S. 39:1-1, shall be operated on the public highways or on public lands of this State unless registered by the owner thereof as provided by this act ...',
      },
      {
        statute: 'S4834 §10 — one-year fee waiver',
        url: billText,
        quote:
          'Notwithstanding any law, rule, or regulation to the contrary, for one year following the effective date ... the New Jersey Motor Vehicle Commission shall waive all examination, registration, and licensing fees required pursuant to [this act] for the operation of low-speed electric bicycles and motorized bicycles.',
        note:
          'The act took effect January 19, 2026, so the waiver runs through January 19, 2027.',
      },
      {
        statute: 'S4834 §7(b) — shared-rental fleets report quarterly instead of registering each bike',
        url: billText,
        quote:
          'a company operating shared low-speed electric bicycles under a contract with a local government may provide the serial number or other identifying numbers of each low-speed electric bicycle owned by the company to the commission on a quarterly basis in lieu of registering each shared low-speed electric bicycle.',
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
        statute: 'S4834 §5 — C.39:4-14.3(c) (operator age and licensing)',
        url: billText,
        quote:
          "(1) No person who is under 15 years of age shall be permitted to operate a low-speed electric bicycle or motorized bicycle. (2) No person who is 17 years of age or older shall be permitted to operate a low-speed electric bicycle or motorized bicycle, unless the person shall be in possession of a valid basic driver's license or a valid motorized bicycle license or permit. (3) No person who is 15 years of age or older but under the age of 17 shall be permitted to operate a low-speed electric bicycle or motorized bicycle, unless the person shall be in possession of a valid motorized bicycle license or permit issued pursuant to subsection d. of this section.",
      },
    ],
  },

  operatingAges: [
    {
      categories: ['low-speed-electric', 'motorized'],
      minAge: years(15),
      citations: [
        {
          statute: 'S4834 §5 — C.39:4-14.3(c)(1) (minimum operating age)',
          url: billText,
          quote:
            'No person who is under 15 years of age shall be permitted to operate a low-speed electric bicycle or motorized bicycle.',
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
            '"Electric motorized bicycle" means any two-wheeled vehicle with fully operable pedals and an electric motor capable of greater than 750 watts that is capable of reaching a speed greater than 28 miles per hour.',
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
      citation: {
        statute: 'S4834 §3 — C.39:4-14.16(f)(1)',
        url: billText,
        quote:
          "The operator of a low-speed electric scooter shall not be required to register the low-speed electric scooter or have a driver's license.",
      },
    },
    {
      description:
        'Operators of rental shared low-speed electric bicycles do not need a license if they are 16 or older and the company is contracted with a local government.',
      citation: {
        statute: 'S4834 §5 — C.39:4-14.3(c)(4)',
        url: billText,
        quote:
          "Notwithstanding anything to the contrary herein, the operator of a low-speed electric bicycle shall not be required to be in possession of a valid basic driver's license or valid motorized bicycle license or permit if the operator is renting a low-speed electric bicycle from a company operating shared low-speed electric bicycles under a contract with a local government, provided that the company requires the operator to be 16 years of age or older.",
      },
    },
    {
      description:
        'Insurance is NOT required for low-speed electric bicycles (pedal-assist, motor cuts at 20 mph) per the bill — only motorized bicycles need insurance.',
      citation: {
        statute: 'S4834 §3 — C.39:4-14.16(f)(2)',
        url: billText,
        quote:
          "The operator of a low-speed electric bicycle shall be required to register the low-speed electric bicycle and have a driver's license to operate the low-speed electric bicycle pursuant to section 2 of P.L.1975, c.250 (C.39:4-14.3).",
        note:
          'Registration and a license, and nothing else. The insurance duty sits in C.39:4-14.3e, which reaches only a motorized bicycle.',
      },
    },
  ],
}

export const NJ_S4834_SOURCES = { billPage, billText, mvcPage } as const
