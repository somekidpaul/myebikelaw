import type { StatutoryRequirement } from '../../types'
import { usd, years } from '../../types'

const billText =
  'https://www.capitol.hawaii.gov/sessions/session2026/bills/HB2021_CD1_.HTM'
const billStatus =
  'https://www.capitol.hawaii.gov/session/measure_indiv.aspx?billtype=HB&billnumber=2021&year=2026'
const hrs24914 =
  'https://www.capitol.hawaii.gov/hrscurrent/Vol04_Ch0201-0257/HRS0249/HRS_0249-0014.htm'
const registerHowTo = 'https://hbl.org/resources/how-to-register-your-bicycle/'

/**
 * Hawaii HB 2021 (2026, final form HD2 SD2 CD1) — passed both chambers
 * 4/30/2026 and was omitted from the Governor's June 26 intent-to-veto list,
 * so it becomes law on or before July 15, 2026 (with or without signature).
 * All riding provisions take effect the day it becomes law — the CD1 text has
 * NO grace period. Only the retailer label/disclosure section is delayed 120
 * days.
 *
 * Shape of the law (from the CD1 text, verified 2026-07-02):
 * - Standard 3-class system; "electric bicycle" = fully operable pedals +
 *   motor ≤750 W (§291C-1, SECTION 9)
 * - Registration: $30 one-time with the county director of finance; an
 *   unregistered e-bike may not be operated on any public roadway, sidewalk,
 *   or bicycle facility (§249-14(b), SECTION 5)
 * - No license. No insurance — SECTION 1 says so explicitly.
 * - Under-16s may ride Class 2/3 only under direct adult supervision
 *   (§291C-143.5, SECTION 12). Class 1 has no age rule.
 * - "High-speed electric device" (motor >750 W AND capable of >28 mph) is
 *   banned from every public surface (SECTION 1) and can't be registered as
 *   an e-bike.
 */
export const HI_HB2021: StatutoryRequirement = {
  jurisdiction: 'HI',
  billId: 'HB 2021 (HD2 SD2 CD1)',
  // Enrolled short title is "RELATING TO TRANSPORTATION" (the bill's subject is
  // electric bicycles). Internal metadata — not rendered in the UI.
  title: 'Relating to Transportation',
  // The latest date it can become law; the Governor cannot veto it. If he
  // signs earlier, the law-sync routine flags the actual date and this moves.
  enactedOn: '2026-07-15',
  // No grace period in the CD1 text — requirements bite the day it's law.
  complianceDeadline: '2026-07-15',

  appliesTo: (bike) => {
    if (bike.throttle === 'none') return 'standard'
    const over750w = bike.motorWatts > 750
    const over28mph = bike.topMotorAssistedSpeed > 28
    // "High-speed electric device" is conjunctive: >750 W AND >28 mph. A bike
    // over only ONE threshold fits neither "electric bicycle" (≤750 W) nor
    // HSED — a definitional gap; we route it to the strictest category and
    // flag the ambiguity in classificationNote below.
    if (over750w || over28mph) return 'high-speed-electric'
    if (bike.throttle === 'throttle') {
      // Class 2 is a throttle bike whose motor cuts at 20 mph. A throttle
      // bike assisting past 20 doesn't fit Class 2 or Class 3 (pedal-assist
      // only) — another gap, flagged below; Class 3 is the closer fit and
      // registration applies either way.
      return bike.topMotorAssistedSpeed <= 20 ? 'class-2' : 'class-3'
    }
    return bike.topMotorAssistedSpeed <= 20 ? 'class-1' : 'class-3'
  },

  classificationNote: (bike) => {
    if (bike.throttle === 'none') return null
    const over750w = bike.motorWatts > 750
    const over28mph = bike.topMotorAssistedSpeed > 28

    if (over750w !== over28mph) {
      return {
        chosen: 'high-speed-electric',
        alternate: bike.throttle === 'throttle' ? 'class-2' : 'class-3',
        reason:
          "Hawaii defines a “high-speed electric device” conjunctively: a motor over 750 W AND capability over 28 mph. Your bike crosses only one of those thresholds, so it doesn't meet that definition — but it also exceeds the ≤750 W / class-speed limits of “electric bicycle,” leaving it in a definitional gap. We apply the strictest reading (banned from public infrastructure, and seizable as a non-road-legal or nonconforming device under §249-15(b)) so you aren't under-warned; a narrower reading might treat it as a moped or motorcycle under other Hawaii law. Confirm with your county before relying on either reading.",
        readingTaken: 'conservative',
        citations: [
          {
            statute: 'HB 2021 CD1 §291C-1 — high-speed electric device definition',
            url: billText,
            quote:
              "'High-speed electric device' means any device with a motor exceeding seven hundred fifty watts and capable of speeds over twenty-eight miles per hour.",
          },
        ],
      }
    }

    if (
      bike.throttle === 'throttle' &&
      bike.topMotorAssistedSpeed > 20 &&
      bike.topMotorAssistedSpeed <= 28
    ) {
      return {
        chosen: 'class-3',
        alternate: 'class-2',
        reason:
          "Hawaii's Class 2 covers throttle bikes whose motor cuts out at 20 mph, and Class 3 covers pedal-assist up to 28 mph — a throttle bike that assists past 20 mph fits neither definition cleanly. Registration applies either way (the registration statute uses the broader “electric bicycle” definition: pedals + ≤750 W), and we apply the under-16 supervision rule conservatively. The Class 1–3 sidewalk allowance (≤10 mph) may not extend to an unclassified bike — the older flat ban on motorized sidewalk riding could apply. Confirm with your county.",
        readingTaken: 'conservative',
        citations: [
          {
            statute: 'HB 2021 CD1 §291C-1 — class definitions',
            url: billText,
          },
        ],
      }
    }
    return null
  },

  // SECTION 1 of the CD1 text, verbatim: "Nothing in this chapter shall be
  // construed to require insurance for the operation of a road-legal,
  // permitted, and classified electric bicycle." Empty categories = the
  // engine never evaluates coverage and the form never asks.
  insurance: {
    appliesToCategories: [],
    minimums: {
      bodilyInjuryPerPerson: usd(0),
      bodilyInjuryPerAccident: usd(0),
      propertyDamage: usd(0),
      pip: null,
    },
    citations: [],
  },

  registration: {
    // The registration hook is the broad "electric bicycle" definition
    // (pedals + ≤750 W) — all three classes, and the gap-case throttle bike.
    // High-speed devices are excluded from "electric bicycle" and cannot be
    // registered under this subsection (they're banned outright instead).
    appliesToCategories: ['class-1', 'class-2', 'class-3'],
    rentalExemptionCategories: [], // no rental carve-out anywhere in the CD1 text
    authority: {
      name: "your county's director of finance",
      url: registerHowTo,
    },
    feeWaiverUntil: null,
    citations: [
      {
        statute: 'HB 2021 CD1, SECTION 5 — HRS §249-14(b) (registration + operation ban)',
        url: billText,
        quote:
          'An electric bicycle shall be required to be registered, and shall be subject to a permanent registration fee of $30, to be paid by the owners thereof to the director of finance. No person shall operate an electric bicycle on a public roadway, sidewalk, or bicycle facility unless it has been properly registered pursuant to this subsection. Failure to register may result in citation or temporary impoundment.',
      },
      {
        statute: 'HRS §249-14 — county bicycle registration (decal, proof of ownership)',
        url: hrs24914,
      },
      {
        statute: 'HB 2021 — bill status (passed 4/30/2026; becomes law by July 15, 2026)',
        url: billStatus,
      },
    ],
  },

  // No license requirement anywhere in the CD1 text.
  licensing: {
    appliesToCategories: [],
    minOperatorAge: years(0),
    acceptedLicensesByAge: [],
    rentalExemptionMinAge: null,
    rentalExemptionCategories: [],
    citations: [],
  },

  operatingAges: [
    {
      categories: ['class-2', 'class-3'],
      minAge: years(16),
      reason:
        'Riders under 16 may operate a Class 2 or Class 3 e-bike in Hawaii only under direct supervision — a parent, guardian, or person 18 or older physically present and close enough to observe and control the ride (§291C-143.5). Unsupervised riding under 16 is a violation. Class 1 e-bikes have no age restriction.',
      citations: [
        {
          statute: 'HB 2021 CD1, SECTION 12 — HRS §291C-143.5 (minimum age / supervision)',
          url: billText,
          quote:
            'No person under the age of sixteen shall operate a class 2 or class 3 electric bicycle... unless under the direct supervision of a parent or guardian.',
        },
      ],
    },
  ],

  operationBans: [
    {
      categories: ['high-speed-electric'],
      reason:
        'Hawaii bans high-speed electric devices (motor over 750 W and capable of more than 28 mph) from every public surface — roadways, bicycle lanes, travel paths, bicycle facilities, streets, highways, and sidewalks. There is nowhere public to legally ride one, at any age, and the device is seizable as non-road-legal. Violations are traffic infractions; for minors, enforcement can run against the parent or guardian.',
      citations: [
        {
          statute: 'HB 2021 CD1, SECTION 1 — high-speed electric device prohibition',
          url: billText,
          quote:
            'No person shall operate a high-speed electric device on a public roadway, a bicycle lane, a travel path, a bicycle facility, or other public area, such as a street, highway, or sidewalk.',
        },
        {
          statute: 'HB 2021 CD1, SECTION 6 — HRS §249-15(b) (seizure of non-road-legal devices)',
          url: billText,
        },
      ],
    },
  ],

  reclassifications: [],

  exemptions: [
    {
      description:
        'Insurance is explicitly NOT required: "Nothing in this chapter shall be construed to require insurance for the operation of a road-legal, permitted, and classified electric bicycle." No driver\'s license is required either.',
      citation: { statute: 'HB 2021 CD1, SECTION 1', url: billText },
    },
    {
      description:
        'Sidewalk riding is allowed for Class 1, 2, and 3 e-bikes at up to 10 mph, except in business districts or where a county ordinance prohibits it.',
      citation: {
        statute: 'HB 2021 CD1, SECTION 13 — HRS §291C-145(g)',
        url: billText,
      },
    },
  ],
}

export const HI_HB2021_SOURCES = { billText, billStatus, registerHowTo } as const
