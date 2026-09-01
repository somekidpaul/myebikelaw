import type { PendingStateBill } from '../types'

export const PENDING_STATE_BILLS: ReadonlyArray<PendingStateBill> = [
  {
    state: 'CA',
    stateName: 'California',
    billId: 'AB 1942',
    status: 'held-in-committee',
    statusLabel: 'Dead for the session',
    oneLiner:
      "Dead for the 2025-26 session. It would have required DMV registration and license plates for Class 2 and Class 3 e-bikes (Class 1 unaffected), but it was held in committee on May 14, 2026 and August 31, 2026 was the Legislature's last day to pass bills. California still requires no license, registration, or insurance to ride an e-bike.",
    details:
      "AB 1942 (Bauer-Kahan / coauthor Davies) passed the Assembly Transportation Committee 12-0 on April 21, 2026 and moved to Appropriations. On May 14, 2026 it was held under submission on the Appropriations suspense file, California's term for a bill stopped in committee without a floor vote, and it never moved again. It is now dead for the 2025-26 session: under Article IV, Section 10(c) of the California Constitution, 'No bill may be passed by either house on or after September 1 of an even-numbered year' except election, tax-levy, appropriation, urgency, and post-veto bills, and the Assembly's own 2026 legislative calendar sets August 31, 2026 as the 'Last day for each house to pass bills (Art. IV, Sec 10(c), J.R. 61(b)(17))', with final recess beginning on adjournment. AB 1942 is none of those exceptions and never left its house of origin, so it would have to be reintroduced in the 2027-28 session to come back. Two other California e-bike bills did move before that deadline, and neither adds license, registration, or insurance for an e-bike. AB 1569 (Davies) was approved by the Governor on August 27, 2026 as Chapter 128, Statutes of 2026; read against its text it contains zero occurrences of insurance, registration, driver's license, license plate, or certificate of title, and it only directs the State Department of Education and the CHP to develop a school e-bike safety and training program for grades 7 to 12 by March 1, 2028. SB 1167 (Blakespear) passed both chambers on August 28, 2026 and is heading to the Governor; it is a definitional, labeling, and seller-disclosure bill that separates e-bikes from e-motos, and its registration, license-plate, and insurance provisions reach only mopeds, motor-driven cycles, off-highway electric motorcycles, and motorized scooters, which already required them. Its driver-licensing amendment runs the other way, expressly excepting 'an electric bicycle as described in subdivision (a) of Section 312.5' from the class M2 licence category. As written, it would have required rear license plates (affixed and visible) plus DMV registration for Class 2 and Class 3 e-bikes; Class 1 (pedal-assist ≤20 mph) was unaffected. The registration fee was left to DMV regulation; penalties were $100 / $200 / $250 for first / second / subsequent violations. Cycling advocacy groups opposed the bill.",
    requirementHints: ['registration'],
    sourceUrl:
      'https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202520260AB1942',
    lastVerified: '2026-09-01',
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
    lastVerified: '2026-09-01',
  },
  // Hawaii graduated from this grid on 2026-07-02: HB 2021 is certain to
  // become law (omitted from the Governor's intent-to-veto list) and now has
  // its own checker card on the splash page.
  {
    state: 'IL',
    stateName: 'Illinois',
    billId: 'SB 3484',
    status: 'enacted',
    statusLabel: 'Enacted; effective January 1, 2027',
    oneLiner:
      "Signed August 26, 2026 as Public Act 104-0854, effective January 1, 2027. Does NOT add license, registration, or insurance for low-speed e-bikes, and it strips local authorities of the power to require them. It adds only a minimum riding age (15+, or 16+ for Class 3). License, title, registration, and insurance apply only to >28 mph / >750W devices, which Illinois already treats as motor driven cycles.",
    details:
      "The e-bike framework first rode on SB 3336 (Sen. Ram Villivalam; championed by Secretary of State Alexi Giannoulias), which passed the Senate 54-0 on April 15, 2026 and the House 80-30 on May 27, 2026, but it stalled at Senate concurrence: it was calendared for a concurrence vote on House Amendments 2 & 3 on May 29, 2026 and that vote was never recorded, leaving SB 3336 dead for the session. The final language was instead carried by SB 3484 ('VEH CD-PLATES-REGISTRATION'), which adopted House Floor Amendment No. 1 and passed BOTH chambers on June 1, 2026 (House 84-16; Senate concurred 48-7). It was sent to the Governor on June 30, 2026, and Governor Pritzker APPROVED it on August 26, 2026, three days before the 60-day constitutional deadline under Article IV, Section 9 of the Illinois Constitution would have made it law without a signature. It is now PUBLIC ACT 104-0854 and takes effect January 1, 2027. News aggregators are still misreporting this as an e-bike license and insurance mandate, and even accurate trade coverage frames it as 'Illinois joins New Jersey', which blurs the decisive difference: New Jersey binds ordinary low-speed e-bikes and Illinois does not. Read against the enacted Public Act text with struck-through material removed, the act imposes NO driver's license, certificate of title, registration, or insurance duty on a low-speed electric bicycle (Class 1/2/3, motor under 750 watts, assist capped at 20 or 28 mph). Not one sentence in the act places any such duty on a low-speed electric bicycle. Sec. 1-146 expressly EXCLUDES low-speed electric bicycles from the 'motor vehicle' definition, so Sec. 7-601's mandatory liability-insurance requirement, which binds 'a motor vehicle', cannot reach them. Sec. 1-140.10 provides that a 'low-speed electric bicycle' is not a moped or a motor driven cycle, and that 'any electric bicycle that is not a low-speed electric bicycle shall be considered a motor driven cycle for purposes of this Code.' A motor driven cycle is defined at Sec. 1-145.001 to include an electric motor rated greater than 750 watts but less than or equal to 8,000 watts, and it is motor driven cycles, not e-bikes, that Sec. 11-1517 subjects to 'the mandatory insurance requirements specified in Article VI of Chapter 7 of this Code', and that the certificate-of-title provision reaches when purchased new on or after January 1, 2027. Those devices already required title, registration, and a license under existing Illinois law. What the act actually adds for an ordinary e-bike rider is a minimum riding age: 15 or older for a Class 1 or Class 2 low-speed electric bicycle, and 16 or older for a Class 3. Notably, the act moves in the opposite direction on paperwork: it STRIKES 'low-speed electric bicycles, and low-speed gas bicycles' from Sec. 11-208(8), the provision letting local authorities require 'the registration and licensing of same, including the requirement of a registration fee', so Illinois municipalities lost, rather than gained, the power to make riders register a low-speed e-bike. Same shape as Florida's bill: worth correcting the record on, but not a new e-bike compliance mandate.",
    requirementHints: [],
    proposedEffectiveDate: '2027-01-01',
    sourceUrl:
      'https://ftp.ilga.gov/Public%20Acts/104/104-0854.htm',
    lastVerified: '2026-09-01',
  },
  {
    state: 'MA',
    stateName: 'Massachusetts',
    billId: 'S 3077',
    status: 'held-in-committee',
    statusLabel: 'Sent to study',
    oneLiner:
      'Sent to study on July 22, 2026 — the Massachusetts way of shelving a bill, so it will not advance this session. Even as filed it did NOT mandate registration or insurance for any e-bike: for Class 3 (21–30 mph) it required only a helmet and a minimum age of 16, and Class 1 & 2 (≤20 mph) were unaffected.',
    details:
      "S 3077 (the Ride Safe Act) was filed by Governor Maura Healey on May 4, 2026 (194th General Court). It uses a speed-based framework rather than a category-based one: Tier 0 (≤20 mph, Class 1 & 2), Tier 1 (21–30 mph, including Class 3 e-bikes), Tier 2 (31–40 mph), Tier 3 (>40 mph). IMPORTANT — reading the operative text (Section 64): the only duties the bill MANDATES ('shall') for Tier 1 are a helmet (Section 64(d)(2)(B)) and a minimum operator age of 16 (Section 64(d)(3)). Registration, licensure, and insurance are NOT mandated by the statute; they are merely AUTHORIZED for future Registrar of Motor Vehicles rulemaking — Section 64(h): 'The registrar may promulgate regulations establishing registration, licensure, insurance, fines and other requirements.' Section 2½ likewise says the registrar 'may issue' plates. (Section 1B's mandatory 'shall be registered … insurance' language applies to 'motorized bicycles,' a category from which Class 3 e-bikes are excluded.) Because the bill text imposes no registration or insurance obligation on a normal e-bike, this is tracked as informational, not a compliance requirement — even though Healey's press release frames it as e-bike insurance regulation. STATUS: the Joint Committee on Transportation held a public hearing May 28, 2026 and then, on July 22, 2026, reported the bill out to a study order under Joint Rule 10 (Order S 3194, 'to make an investigation and study of a certain current Senate document relative to enhance the safe use of micromobility devices'); S 3194 was referred to the Committee on Rules of the two branches and discharged to Senate Rules on July 23, 2026. In Massachusetts practice a bill 'sent to study' does not advance as legislation for the remainder of the session — the same effective outcome as California AB 1942 being held in committee. The Ride Safe Act would have to be refiled to move again.",
    requirementHints: [],
    sourceUrl: 'https://malegislature.gov/Bills/194/S3077',
    lastVerified: '2026-09-01',
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
    lastVerified: '2026-09-01',
  },
  {
    state: 'UT',
    stateName: 'Utah',
    billId: 'HB 381 (2026)',
    status: 'enacted',
    statusLabel: 'Enacted; in effect',
    oneLiner:
      "Does NOT add license, registration, or insurance for e-bikes. Utah keeps the Class 1/2/3 (≤750W) framework, expressly excludes an 'electric assisted bicycle' from the 'motor vehicle' definition, and its driver-licensing statute says outright that a rider 16 or older needs no driver license, no motorcycle endorsement, and no safety certificate. Only reclassified 'high power electric devices' and 'electric motorcycles' (over 750W, or capable of over 20 mph on the motor alone) fall under motorcycle rules, which already require those. What HB 381 does add for ordinary e-bike riders is safety rules, not vehicle paperwork: a helmet under 21 on highways and a ban on riding while drinking (both in effect now), and from May 5, 2027 a minimum age of 8 to ride on a highway plus a rule that riders under 16 either earn a safety certificate (online, fee capped at $10) or ride under direct adult supervision.",
    details:
      "House Bill 381 (Electric Mobility Device Amendments; 3rd Sub., sponsor Rep. Cutler) was signed by Governor Cox on March 24, 2026; most of its e-bike provisions took effect May 6, 2026, but FOUR sections carry a later date of May 5, 2027: Sec. 41-6a-1115 (motor assisted scooters), Sec. 41-6a-1115.5 (electric assisted bicycle restrictions), new Sec. 41-6a-1512 (the safety-certificate program), and Sec. 53-3-202 (the 'Drivers shall be licensed' statute). Reading the enrolled text: an 'electric assisted bicycle' is a bike with a motor ≤750W, fully operable pedals, and Class 1/2/3 (or programmable) behavior (Sec. 41-6a-102(21)), and it is expressly EXCLUDED from the 'motor vehicle' definition (Sec. 13-20-2(4)(b)(vi)) — so no title, registration, license, or insurance attaches to a normal e-bike. HB 381 instead creates two reclassified device types: an 'electric motorcycle' (a motorcycle over 750W or capable of exceeding 20 mph on motor power alone, Sec. 41-6a-102(23)) and a 'high power electric device' (a self-propelled vehicle capable of over 20 mph on motor power alone — including an e-bike modified/tampered beyond its factory settings, Sec. 41-6a-102(32)). Under new Sec. 41-6a-1511, an operator of a high power electric device or electric motorcycle 'has all rights and is subject to all provisions … applicable to an operator of a motorcycle' — i.e. the license/registration/insurance those already require everywhere — with a narrow carve-out that a VIN-less high power electric device that is not a motorcycle need not carry liability insurance. The new mandates that touch an ordinary e-bike rider are all safety rules, never vehicle paperwork, and they fall on two different dates. In effect since May 6, 2026: a helmet for any rider under 21 operating on a highway (Sec. 41-6a-1505(1)(b), broadened from the old class-3-only rule, and it does not apply to a rented class 1 e-bike or motor assisted scooter, Sec. 41-6a-1505(3)), and a prohibition on consuming alcohol while operating any electric assisted bicycle. Effective May 5, 2027: a 'personal electric vehicle safety certificate' program (new Sec. 41-6a-1512), under which a rider eight or older and under 16 may not operate an electric assisted bicycle with the motor engaged on a highway unless the rider either obtains that certificate or is under the direct supervision of a parent or another responsible adult (Sec. 41-6a-1115.5(4) and, in identical terms, Sec. 53-3-202(5)(b)); a rider under eight may not operate one on a highway at all (Sec. 41-6a-1115.5(6)); and a rider under 16 may not use a freeway (Sec. 41-6a-1512(5)). The certificate is administered by the department, must be completable online, and carries a fee of $10 or less; violating the section is an infraction capped at $150. Note this REPLACED a narrower prior rule that required supervision only under age 14, so it is a real tightening. Crucially, it is not a licensing requirement: Sec. 53-3-202(5)(b)(i) states that an under-16 rider 'is not required to hold a class D driver license or a motorcycle endorsement' for an e-bike, and Sec. 53-3-202(5)(c) states that a rider 16 or older may ride 'without' a class D driver license, a motorcycle endorsement, OR a safety certificate. There is also a point-of-sale disclosure (from Jan 1, 2027, Sec. 41-6a-1511(6)(a)) that a sub-four-wheel electric device which is NOT an electric assisted bicycle may be subject to motor-vehicle registration/insurance. Same shape as Florida, Illinois, and Washington: the vehicle requirements attach only to higher-powered/reclassified devices, not to normal e-bikes — worth correcting the record on (law-firm and retailer blogs frame HB 381 as a license/registration change), but not a new e-bike compliance mandate, so it is tracked as informational rather than a compliance checker.",
    requirementHints: [],
    proposedEffectiveDate: '2026-05-06',
    sourceUrl: 'https://le.utah.gov/Session/2026/bills/enrolled/HB0381.pdf',
    lastVerified: '2026-08-24',
  },
  {
    state: 'WA',
    stateName: 'Washington',
    billId: 'ESSB 6110 (2026 c 159)',
    status: 'enacted',
    statusLabel: 'Enacted; in effect',
    oneLiner:
      "Does NOT add license, registration, or insurance for e-bikes. Washington's new law keeps the Class 1/2/3 (≤750W) system and only narrows the definition, so a device that can exceed 20 mph on the motor alone — or is built to be easily derestricted — is no longer an e-bike and falls under the existing motorcycle/moped rules, which already require all three.",
    details:
      "Engrossed Substitute Senate Bill 6110 — Chapter 159, Laws of 2026 (prime sponsor Sen. Sharon Shewmake) — passed the House 91-3 on March 4, 2026 and the Senate 44-4 on March 10, 2026, was approved by Governor Bob Ferguson on March 23, 2026, and took effect June 11, 2026 (Section 3, the study work group, took effect on approval). It imposes NO license, registration, or insurance requirement on electric-assisted bicycles. It keeps Washington's three-class framework (motor ≤750 W; Class 1 & 2 assist cuts at 20 mph, Class 3 at 28 mph) and amends the RCW 46.04.169 definition to EXCLUDE from 'electric-assisted bicycle': (a) any vehicle capable of exceeding 20 mph on solely its electric motor, and (b) any vehicle designed, manufactured, or intended to be easily configured (by switch, software setting, or online application) to exceed the e-bike limits. Section 1 of the act states that the current 'motorcycle' and 'moped' definitions apply to the vehicles excluded from the e-bike definition — and those already require a license, registration, and insurance everywhere. The act also directs the Department of Licensing to convene a work group and recommend a dedicated electric-motorcycle framework (interim report due Dec 15, 2026; final report Oct 31, 2027). Same shape as Florida and Illinois: the vehicle requirements attach only to reclassified higher-speed devices, not to normal e-bikes — worth correcting the record on, but not a new e-bike compliance mandate, so it is tracked as informational rather than a compliance checker.",
    requirementHints: [],
    proposedEffectiveDate: '2026-06-11',
    sourceUrl:
      'https://lawfilesext.leg.wa.gov/biennium/2025-26/Pdf/Bills/Session%20Laws/Senate/6110-S.SL.pdf',
    lastVerified: '2026-08-24',
  },
]
