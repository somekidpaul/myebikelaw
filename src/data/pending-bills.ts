import type { PendingStateBill } from '../types'

export const PENDING_STATE_BILLS: ReadonlyArray<PendingStateBill> = [
  {
    state: 'CA',
    stateName: 'California',
    billId: 'AB 1942',
    status: 'held-in-committee',
    statusLabel: 'Held in committee',
    oneLiner:
      'Would have required DMV registration and license plates for Class 2 and Class 3 e-bikes (Class 1 unaffected) — but it stalled in committee.',
    details:
      "AB 1942 (Bauer-Kahan / coauthor Davies) passed the Assembly Transportation Committee 12-0 on April 21, 2026 and moved to Appropriations. On May 14, 2026 it was held under submission on the Appropriations suspense file — California's term for a bill stopped in committee without a floor vote. Unless it is revived, it is done for this session. As written, it would have required rear license plates (affixed and visible) plus DMV registration for Class 2 and Class 3 e-bikes; Class 1 (pedal-assist ≤20 mph) was unaffected. The registration fee was left to DMV regulation; penalties were $100 / $200 / $250 for first / second / subsequent violations. Cycling advocacy groups opposed the bill.",
    requirementHints: ['registration'],
    sourceUrl:
      'https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260AB1942',
    lastVerified: '2026-06-10',
  },
  {
    state: 'FL',
    stateName: 'Florida',
    billId: 'CS/SB 382',
    status: 'passed-both-chambers',
    statusLabel: 'Sent to governor',
    oneLiner:
      'Passed — but does NOT add license, registration, or insurance. Sidewalk speed limits and crash data collection only.',
    details:
      'CS/SB 382 passed both chambers unanimously (Senate 2/25/26, House 112-0 on 3/9/26) and was enrolled to Governor DeSantis on 3/17/26. The Class 3 license requirement that appeared in early drafts was REMOVED before final passage. The final bill: requires e-bikes on sidewalks to slow to 10 mph when pedestrians are within 50 feet; requires audible signal before passing pedestrians on shared pathways; creates a Micromobility Device Safety Task Force (report due Oct 2026); mandates statewide e-bike crash data collection. Penalty provisions take effect July 1, 2026; remaining provisions effective upon signing. Useful to know about, but not a compliance requirement.',
    requirementHints: [],
    proposedEffectiveDate: '2026-07-01',
    sourceUrl: 'https://www.flsenate.gov/Session/Bill/2026/382',
    lastVerified: '2026-06-10',
  },
  {
    state: 'HI',
    stateName: 'Hawaii',
    billId: 'HB 2021',
    status: 'passed-both-chambers',
    statusLabel: 'Awaiting governor',
    oneLiner:
      "$30 one-time registration for all e-bikes. Adopts a 3-class system. Higher-speed class can't use public roads, bike lanes, or sidewalks.",
    details:
      "HB 2021 (final form HB 2021 HD2 SD2 CD1) passed both chambers and is now awaiting Governor Green's decision. One-time $30 registration applies to all e-bikes. Adopts the standard 3-class system (Class 1/2/3). Age 16+ required for the higher-speed class. Higher-speed e-bikes prohibited on public roads, bike lanes, and sidewalks. Manufacturer labels showing class/top speed/wattage are required; retailers must inform buyers of state law. If signed: road provisions effective immediately, retailer disclosure within 120 days.",
    requirementHints: ['registration'],
    sourceUrl: 'https://legiscan.com/HI/bill/HB2021/2026',
    lastVerified: '2026-06-10',
  },
  {
    state: 'IL',
    stateName: 'Illinois',
    billId: 'SB 3484',
    status: 'passed-both-chambers',
    statusLabel: 'Awaiting governor',
    oneLiner:
      "Does NOT add license, registration, or insurance for low-speed e-bikes — only a minimum riding age and equipment rules. License, title, registration, and insurance attach only to motor-driven cycles (motor over 750W) and devices over 28 mph, which Illinois already regulates.",
    details:
      "The Illinois micromobility safety framework (championed by Secretary of State Alexi Giannoulias) passed the General Assembly on June 1, 2026 and now awaits Governor Pritzker. The original vehicle, SB 3336, passed the Senate 54-0 (April 15) and the House 80-30 (May 27) but stalled at Senate concurrence in the House amendments — no concurrence vote was recorded after it was calendared for May 29. The final framework was carried instead by SB 3484 ('VEH CD-PLATES-REGISTRATION'), which adopted House Floor Amendment No. 1 and passed both chambers June 1, 2026 (House 84-16; Senate concurred 48-7). News aggregators keep framing this as an e-bike license/insurance mandate — the actual ILGA text does the opposite: it expressly EXCLUDES electric micromobility devices (low-speed Class 1/2/3 e-bikes, e-scooters, e-skateboards) from titling, registration, license or permit, and liability-insurance requirements. Titling, registration, license, and insurance attach only to motor-driven cycles powered by an electric motor over 750 watts (up to 8,000 watts) and gas-powered bicycles capable of exceeding 28 mph — devices Illinois already regulates. For low-speed e-bikes the bill adds only a minimum riding age, equipment/labeling rules, and operating restrictions. Same shape as Florida's bill: worth correcting the record on, but not a new e-bike compliance mandate. Effective January 1, 2027 if signed.",
    requirementHints: [],
    proposedEffectiveDate: '2027-01-01',
    sourceUrl:
      'https://www.ilga.gov/Legislation/BillStatus?DocNum=3484&GAID=18&DocTypeID=SB&SessionID=114&GA=104',
    lastVerified: '2026-06-15',
  },
  {
    state: 'MA',
    stateName: 'Massachusetts',
    billId: 'SB 3077',
    status: 'in-committee',
    statusLabel: 'In committee',
    oneLiner:
      'Speed-tier framework. Class 1 & 2 e-bikes (≤20 mph) unaffected. Class 3 needs registration. Faster devices (>30 mph) need insurance.',
    details:
      'SB 3077 (the Ride Safe Act) was filed by Governor Maura Healey on May 4, 2026 — making MA one of the few states, after NJ, proposing mandatory e-bike insurance. Uses a speed-based framework rather than a category-based one. Tier 0 (≤20 mph, Class 1 & 2): no registration or insurance. Tier 1 (21-30 mph, Class 3): registration + helmet + age 16+. Tier 2 & 3 (>30 mph, e-motos and faster): registration + liability insurance + visible plates or stickers + age + helmet. The Joint Committee on Transportation held a public hearing on the bill May 28, 2026; it remains before that committee, with no committee vote reported yet.',
    requirementHints: ['registration', 'insurance'],
    sourceUrl:
      'https://www.mass.gov/news/governor-healey-files-ride-safe-act-to-strengthen-public-safety-regulate-e-bikes-mopeds-and-scooters',
    lastVerified: '2026-06-10',
  },
  {
    state: 'NY',
    stateName: 'New York',
    billId: 'S08573',
    status: 'in-committee',
    statusLabel: 'In Senate Transportation',
    oneLiner:
      'Would require registration and operator licensure for all e-bikes, e-scooters, and e-skateboards.',
    details:
      'S08573 — the RIDERS Act ("Responsible Implementation of E-bike Regulations for Safe Cycling") — was introduced November 7, 2025. Would direct the NY DMV to create a registration process and fee schedule for all electric personal mobility devices: pedal-assist bicycles, e-scooters, and electric skateboards. Also requires operator licensure for these devices. Currently in the Senate Transportation Committee, roughly 25% through the legislative process. Committee passage is uncertain.',
    requirementHints: ['registration', 'license'],
    sourceUrl: 'https://www.nysenate.gov/legislation/bills/2025/S8573',
    lastVerified: '2026-06-10',
  },
]
