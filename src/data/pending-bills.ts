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
    lastVerified: '2026-06-30',
  },
  {
    state: 'FL',
    stateName: 'Florida',
    billId: 'CS/SB 382',
    status: 'vetoed',
    statusLabel: 'Vetoed by governor',
    oneLiner:
      'Vetoed June 25, 2026 — never became law. Even as passed it did NOT add license, registration, or insurance; it was sidewalk speed limits and crash data only.',
    details:
      'CS/SB 382 passed both chambers unanimously (Senate 37-0 on 2/25/26, House 112-0 on 3/9/26), was presented to Governor DeSantis on 6/15/26, and was VETOED on June 25, 2026 — so it never became law. The Class 3 license requirement that appeared in early drafts had already been REMOVED before final passage; the bill that reached his desk would have required e-bikes on sidewalks to slow to 10 mph when pedestrians are within 50 feet, required an audible signal before passing pedestrians on shared pathways, created a Micromobility Device Safety Task Force, and mandated statewide crash data collection. In his veto message DeSantis called the 10-mph-near-pedestrians standard difficult to measure and warned it could invite local-government surveillance of riders. Bottom line for compliance: Florida added no license, registration, or insurance requirement for any e-bike class — the bill that might loosely have touched riders was vetoed.',
    requirementHints: [],
    sourceUrl: 'https://www.flsenate.gov/Session/Bill/2026/382',
    lastVerified: '2026-06-30',
  },
  {
    state: 'HI',
    stateName: 'Hawaii',
    billId: 'HB 2021',
    status: 'passed-both-chambers',
    statusLabel: 'Becomes law July 15, 2026',
    oneLiner:
      "$30 one-time registration for all e-bikes. Adopts a 3-class system. Higher-speed class can't use public roads, bike lanes, or sidewalks. Now certain to take effect — see below.",
    details:
      "HB 2021 (final form HB 2021 HD2 SD2 CD1) passed both chambers. On June 26, 2026 Governor Green released his 2026 intent-to-veto list (four bills) and HB 2021 was NOT on it — under Hawaii's constitution the Governor cannot veto a bill omitted from that list, so HB 2021 becomes law on or before the July 15, 2026 deadline (with or without his signature). One-time $30 registration applies to all e-bikes. Adopts the standard 3-class system (Class 1/2/3). Age 16+ required for the higher-speed class. Higher-speed e-bikes prohibited on public roads, bike lanes, and sidewalks. Manufacturer labels showing class/top speed/wattage are required; retailers must inform buyers of state law. Road provisions effective immediately on enactment; retailer disclosure within 120 days.",
    requirementHints: ['registration'],
    sourceUrl: 'https://legiscan.com/HI/bill/HB2021/2026',
    lastVerified: '2026-06-30',
  },
  {
    state: 'IL',
    stateName: 'Illinois',
    billId: 'SB 3484',
    status: 'passed-both-chambers',
    statusLabel: 'Passed both chambers; awaiting governor',
    oneLiner:
      "Does NOT add license, registration, or insurance for low-speed e-bikes — only a minimum riding age (15+, or 16+ for Class 3). License, title, registration, and insurance apply only to >28 mph / >750W devices, which Illinois already treats as motor-driven cycles.",
    details:
      "The e-bike framework first rode on SB 3336 (Sen. Ram Villivalam; championed by Secretary of State Alexi Giannoulias), which passed the Senate 54-0 on April 15, 2026 and the House 80-30 on May 27, 2026 — but it stalled at Senate concurrence: it was calendared for a concurrence vote on House Amendments 2 & 3 on May 29, 2026 and that vote was never recorded, leaving SB 3336 dead for the session. The final language was instead carried by SB 3484 ('VEH CD-PLATES-REGISTRATION'), which adopted House Floor Amendment No. 1 and passed BOTH chambers on June 1, 2026 (House 84-16; Senate concurred 48-7). It now awaits Governor Pritzker; per the bill text it takes effect January 1, 2027 if signed. As of June 25, 2026 the ILGA record shows no gubernatorial action and no Public Act number assigned yet. News aggregators are still misreporting this as an e-bike license/insurance mandate — the actual ILGA text does NOT impose a driver's license, certificate of title, registration, or insurance on low-speed electric bicycles (Class 1/2/3, motor <750W, assist capped at 20 or 28 mph). SB 3484 excludes low-speed electric bicycles from the 'motor vehicle' definition (Sec. 1-146) and treats them as bicycles (Sec. 11-1517(a)); only an electric bicycle that is NOT a low-speed electric bicycle becomes a 'motor-driven cycle' (Sec. 1-140.10), i.e. an electric motor over 750W (up to 8,000W) or a device capable of exceeding 28 mph — and those already require title/registration/license under existing Illinois law. Same shape as Florida's bill: worth correcting the record on, but not a new e-bike compliance mandate.",
    requirementHints: [],
    proposedEffectiveDate: '2027-01-01',
    sourceUrl:
      'https://www.ilga.gov/Legislation/BillStatus?DocNum=3484&GAID=18&DocTypeID=SB&SessionID=114&GA=104',
    lastVerified: '2026-06-30',
  },
  {
    state: 'MA',
    stateName: 'Massachusetts',
    billId: 'S 3077',
    status: 'in-committee',
    statusLabel: 'In committee',
    oneLiner:
      'Speed-tier framework. The bill itself does NOT mandate registration or insurance for any e-bike — those are left to future RMV rulemaking. For Class 3 (21–30 mph) it mandates only a helmet and a minimum age of 16; Class 1 & 2 (≤20 mph) are unaffected.',
    details:
      "S 3077 (the Ride Safe Act) was filed by Governor Maura Healey on May 4, 2026 (194th General Court). It uses a speed-based framework rather than a category-based one: Tier 0 (≤20 mph, Class 1 & 2), Tier 1 (21–30 mph, including Class 3 e-bikes), Tier 2 (31–40 mph), Tier 3 (>40 mph). IMPORTANT — reading the operative text (Section 64): the only duties the bill MANDATES ('shall') for Tier 1 are a helmet (Section 64(d)(2)(B)) and a minimum operator age of 16 (Section 64(d)(3)). Registration, licensure, and insurance are NOT mandated by the statute; they are merely AUTHORIZED for future Registrar of Motor Vehicles rulemaking — Section 64(h): 'The registrar may promulgate regulations establishing registration, licensure, insurance, fines and other requirements.' Section 2½ likewise says the registrar 'may issue' plates. (Section 1B's mandatory 'shall be registered … insurance' language applies to 'motorized bicycles,' a category from which Class 3 e-bikes are excluded.) Because the bill text imposes no registration or insurance obligation on a normal e-bike, this is tracked as informational, not a compliance requirement — even though Healey's press release frames it as e-bike insurance regulation. The Joint Committee on Transportation held a public hearing May 28, 2026; it remains before that committee, with no committee vote reported yet.",
    requirementHints: [],
    sourceUrl: 'https://malegislature.gov/Bills/194/S3077',
    lastVerified: '2026-06-30',
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
    lastVerified: '2026-06-30',
  },
]
