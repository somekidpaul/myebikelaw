# MyEBikeLaw — Session Handoff

Reference doc for picking up in a new Claude Code session without losing context. Persistent project memory lives at `~/.claude/projects/-Users-paul-Desktop/memory/project_ebikelaw.md` — read that first; this file is the commit-level log.

## Where the site stands

- **Live:** [myebikelaw.com](https://myebikelaw.com) (Cloudflare Pages, custom domain)
- **Repo:** `github.com/somekidpaul/myebikelaw` — **PUBLIC**. (Older notes here and in project
  memory said private; `gh repo view` reports `visibility=PUBLIC`.) The README is therefore a public
  artifact on a portfolio piece. Keep it true.
- **Auto-deploy:** every push to `main` → CI runs tests → if green, `cloudflare/wrangler-action@v3` ships `dist/`
- **Status:** shipped, polished, every path empirically verified through the form on the live URL
- **Tests:** 299 / 299 passing (Vitest) — engine, share round-trip, form logic, form inputs,
  rendered verdict copy, and site consistency
- **LinkedIn:** launch post PUBLISHED 2026-05-21 (meniscus origin + all 6 state statuses incl. CA "stalled in committee" + "91 test scenarios" — the post's count is a point-in-time number, the suite is now 117)

## Build pipeline

```
npm run build
# = tsc -b
#   && vite build                                              # client → dist/
#   && vite build --ssr src/entry-server.tsx --outDir dist-ssr # server build for prerender
#   && node scripts/prerender.mjs                              # injects renderToString output into dist/index.html
```

Crawlers see ~27 KB of real HTML body (not an empty `<div id="root">`).

## Local dev / preview

| Command | What | Port |
|---|---|---|
| `npm run dev` | Vite dev server (HMR, no prerender) | 5174 |
| `npm run preview` | Serves the built `dist/` (prerendered) | 4174 |
| `npm test` | Vitest run | — |

`.env` (gitignored) holds `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID=0d19c0bf05fc00b7d6683d48d07f8170`. GitHub repo has the same two values as Actions secrets for CI deploy.

## Notable commits (May 2026 session)

Newest first. Use these as bookmarks if you need to trace why something is the way it is.

| Commit | Summary |
|---|---|
| `6545b03` | Re-verify every state's bill vs primary legislative sources; CA AB 1942 → new `held-in-committee` status (stalled on Appropriations suspense file 5/14/26) rendered with the gray/informational treatment; fix MA committee (Joint, not Senate) + May 28 hearing; alphabetize the pending state grid (CA, FL, HI, MA, NY) |
| `19e63e3` | Auto-update deadline countdown while the tab stays open (60s interval) |
| `e50d956` | Compute deadline countdown client-side only — prerender no longer ships a stale day count |
| `4024142` | Pre-render the homepage to static HTML at build time (`renderToString` + `scripts/prerender.mjs`) |
| `4d17729` | Reposition homepage SEO as a multi-state hub (title/description/JSON-LD broadened) |
| `1eee974` | Auto-deploy to Cloudflare Pages on push to main (CI deploy job) |
| `3279df3` | Remove skip-to-content link (was a weak ~60px jump in a small header) |
| `9f06e27` | Fix social-share image (SVG→PNG) + full SEO pass — canonical, og:url, all image fields, JSON-LD `@graph`, apple-touch-icon, robots meta, sitemap lastmod |
| `7449aa7` | Bump CI actions to v6 (Node 24) |
| `7d38c81` | Add CI workflow — test, build, typecheck on every push |
| `4f291b7` | Add Save-as-PDF export to the results page (print stylesheet + letterhead) |
| `fbd12f1` | Switch logo to bolt-in-shield-outline (A2) |
| `8cbfe53` | Drop "tell us" verbiage from How-it-works steps |
| `f02d6e4` | Fix typographic hierarchy across the site (h3 section labels were tiny eyebrow-styled) |
| `7bea085` | Add "already registered" question so owned bikes can reach COMPLIANT |
| `3209378` | Fix Start Over routing — send users to a fresh form, not the splash |
| `446fdd1` | Remove logo design-mockup files from `public/` |
| `f0b9fab` | Multi-state framing + polish pass (Splash redesign with state grid; Faq split; Reveal animations) |
| `f0e45a5` | Ship v1: MyEBikeLaw compliance checker for NJ S4834 |

## Engine verdicts (all 9 verified end-to-end through the form on the live URL)

| # | Inputs | Verdict |
|---|---|---|
| 1 | throttle=none, age=35 | NOT APPLICABLE |
| 2 | pedal-assist 20mph, age=35, basic-drivers, no policy | GAPS (registration) |
| 3 | same + ☑ already registered | COMPLIANT |
| 4 | age=12 | PROHIBITED |
| 5 | throttle 25mph 750W, age=35, no policy | GAPS (registration + insurance) + carrier directory |
| 6 | same + ☑ registered + specialty 35k/70k/25k/15k | COMPLIANT |
| 7 | throttle 32mph 1000W | RECLASSIFIED as motorcycle |
| 8 | pedal-assist 25mph 600W (Class 3) | GAPS + classification ambiguity note |
| 9 | pedal-assist + ☑ rental + age 20 | COMPLIANT (rental exemption) |

## August 28, 2026 law sync (Friday): ⭐ ILLINOIS BECAME LAW. SB 3484 signed August 26 as Public Act 104-0854

Folded into the same branch/PR as the 8/10 → 8/26 passes (PR #15 is still unmerged, so a second draft
off an unmerged base would stack reviews). **This is the first run since 2026-08-03 where a tracked
bill actually changed status.** Everything else in every other tracked state is unchanged.

### ⭐ The Illinois watch item resolved, two days before the deadline the schedule could not see

Prior runs had this exactly right and the reasoning held all the way to the end: SB 3484 was going to
become law on or before **August 29, 2026** under Ill. Const. Art. IV, Sec. 9 whether or not Pritzker
signed it. He signed it. The 8/24 and 8/26 runs both flagged that the cron (`0 13 * * 1-5`) could not
land on August 29 (a Saturday). **That worry turned out not to matter: the Governor acted on
Wednesday August 26, and this Friday run caught it three days early.** No weekend run was needed.

⚠️ Worth keeping: **the 8/26 run was not wrong to report "still awaiting governor."** He signed on
8/26, but ILGA's nightly sync did not rewrite the bill's status file until **Thu, 27 Aug 2026
04:20:39 GMT**. The routine read the truth that was published at the time it ran.

| Evidence | Value |
|---|---|
| SB 3484 status XML, `Last-Modified` | **Thu, 27 Aug 2026 04:20:39 GMT** (was frozen at 1 Jul 2026 for eight weeks) |
| Action rows | **81** (was 78 on 8/26) |
| The three new rows, all dated **8/26/2026** | "Governor Approved", "Effective Date January 1, 2027", "Public Act . . . 104-0854" |
| Occurrences of "public act" in the status record | **2** (was 0) |
| Occurrences of "veto" | **0** |
| Public Act file `104-0854.htm`, `Last-Modified` | **Wed, 26 Aug 2026 20:58:58 GMT** |
| Its own first line | "Public Act 104-0854 **SB3484** Enrolled" |

Corroborated independently by the **Illinois Secretary of State's own newsroom** (August 26, 2026,
"Giannoulias' Landmark Micromobility Safety Legislation Signed into Law").

### ⛔ The scope-discipline read was redone against the ENACTED act, and a flattening trap nearly inverted it

The card's whole claim is that Illinois adds nothing for ordinary e-bikes. That claim was previously
verified against the *bill*; it is now law, so it was re-read against **Public Act 104-0854 itself**.

⚠️ **The trap: stripping HTML tags from an ILGA act silently promotes struck-through text into the
operative law.** A first pass on the flattened text appeared to show Sec. 11-208(8) letting local
authorities require "the registration and licensing" of low-speed electric bicycles, which would have
been a brand-new (if local) registration power worth flagging to riders. Reading the **markup**
instead showed `<strike>, low-speed electric bicycles, and low-speed gas bicycles,</strike>` — the act
**REMOVES** them. As enacted the provision reads "mobile carrying devices and bicycles". **Illinois
municipalities lost, rather than gained, the power to make riders register a low-speed e-bike.**

This is the same normalization discipline already written down for the NJ fixture (`citation-fidelity`
strips struck material before comparing). Applied here, the finding flips from "a new local
registration power" to "a narrowing of e-bike paperwork", which is the opposite conclusion.

With struck material removed, the enacted act was swept again:

| Check against enacted PA 104-0854 | Result |
|---|---|
| Sentences imposing register / title / insure / driver's-license duty on a **low-speed electric bicycle** | **ZERO** |
| Sec. 1-146 "motor vehicle" | expressly **EXCLUDES** low-speed electric bicycles, so Sec. 7-601's mandatory liability insurance (which binds "a motor vehicle") cannot reach them |
| Sec. 1-140.10 | "A 'low-speed electric bicycle' is not a moped or a motor driven cycle. Any electric bicycle that is not a low-speed electric bicycle shall be considered a motor driven cycle" |
| Sec. 1-145.001 "motor driven cycle" | includes an electric motor "greater than 750 watts but less than or equal to 8,000 watts" — confirms the card's 750/8,000 figures |
| Sec. 11-1517 | "Every owner of a motor driven cycle is subject to the mandatory insurance requirements specified in Article VI of Chapter 7" — binds **motor driven cycles only** |
| Age rule, verbatim | "may operate a Class 1 or Class 2 low-speed electric bicycle only if the person is 15 years of age or older … a Class 3 … 16 years of age or older" — card's "15+, or 16+ for Class 3" is 1:1 |
| Home rule | Sec. 11-1517 denies home-rule units concurrent power over electric micromobility devices |

**Verdict unchanged: `requirementHints: []`, informational/gray card.** The conclusion the routine has
carried since June is confirmed against the law as enacted.

⚠️ **Coverage is blurring it exactly as predicted.** Insurance Journal (8/28) ran "New Illinois Law
Requires Insurance for High-Speed E-Bikes" and wrote that "Illinois joins New Jersey as the only
states to require insurance for high-speed e-bikes." That sentence is *true* but reads as equivalence,
and the two states are not equivalent: **New Jersey binds ordinary low-speed e-bikes and Illinois does
not.** The card and the FAQ now say so in as many words.

### Changes in this commit

IL card `status` `passed-both-chambers` → **`enacted`**, `statusLabel` → "Enacted; effective January 1,
2027", `oneLiner` and `details` rewritten around the signing, and `sourceUrl` repointed from the
ilga.gov BillStatus page (which blocks automated requests) to the **Public Act itself**. The FAQ
Illinois bullet rewritten to match. `index.html` needed **no** change (it carries no hard-coded IL
status, only a state list). The **5** cards actually re-checked (CA/FL/IL/MA/NY) bumped to
`2026-08-28`; **UT and WA left at `2026-08-24`** (enrolled texts not re-read this run); carrier dates
untouched (Friday, outside the Monday cadence and the July 19 window); footer and sitemap to
August 28, 2026.

⭐ **The status flip is user-visible beyond the eyebrow.** `Splash.tsx` keys the effective-date chip off
`status === 'enacted'`, so the card moves from "**If signed:** Jan 1, 2027" to "**Effective:** Jan 1,
2027". That is the exact bug the 8/10 pass fixed in the other direction, and it now resolves correctly
on its own.

### New guard: an enacted bill is never still described as awaiting a governor

Same failure shape this suite exists for: the Illinois status lived in two files with nothing keeping
the copies equal, and it additionally drives a rendered chip. Seven assertions in
`site-consistency.test.ts` pin the card and the FAQ bullet to the signing date and the Public Act
number, forbid "awaits Governor" / "if signed" in either, require both to keep the no-license /
no-registration / no-insurance claim, and pin `requirementHints` to `[]`.

**Falsified four ways, every one caught:** reverting the card `status` → red; reverting the FAQ bullet
to "awaits Governor Pritzker" → red; flipping the oneLiner to claim Illinois extends the requirements
to low-speed e-bikes → red; sneaking `requirementHints: ['registration']` onto the card → red.
Restored, **306 green** (was 299).

### Every other tracked item re-verified against a primary source, all unchanged

| Item | Result |
|---|---|
| NJ S4834 (R1a enacted text) | Unchanged, re-read in full from `pub.njleg.gov`. **"helmet" 0 times.** Exactly **4** dollar figures ($5, $5, $50, $50), so still **no insurance minimums in the act**. Conjunctive phrase "greater than 750 watts that is capable of reaching a speed greater than 28 miles per hour" present. "furnish proof of insurance" ×1, "six months" ×1, "12th month" ×1 |
| NJ new-bill scan | All **10,712** 2026 bills pulled from the njleg API (identical count to 8/18, 8/21, 8/24 and 8/26); **20** e-bike/scooter/moped-adjacent; **none** with a `GovernorAction`; **0** synopses mentioning 4834 or c.285. **No bill amending, delaying, or repealing S4834** |
| NJ watchlist | A2093 / S3156 / A3697 / S2070 / A1538 each still a **single** history row, 1/13/2026. S4524 still one row, 6/26/2026. S3178 still two rows ending "Withdrawn Because Approved P.L.2025, c.285." Zero movement |
| CA AB 1942 | Last action still 5/14/26 "In committee: Held under submission." **0** "Chaptered", **0** "Vetoed". Unchanged |
| CA AB 2346 | Untracked watch item, still open. Enrolled, "presented to the Governor" ×1, **0** Chaptered / **0** Vetoed / **0** Approved by the Governor. Presented 8/25, so the Art. IV Sec. 10(b) 12-day clock still runs to about **September 6, 2026** |
| FL CS/SB 382 | "Vetoed by Governor" ×2, **0** chapter-law citations, **0** "Override". Unchanged |
| MA S 3077 | Still exactly **5** action dates, last "7/22/2026 Senate Accompanied a study order (under JR10), see S3194". Unchanged |
| NY S08573 | nyassembly.gov mirror: still exactly **2** action dates, 11/07/2025 REFERRED TO RULES and 01/07/2026 REFERRED TO TRANSPORTATION. Unchanged |
| HI Act 259 | In effect since 7/15/2026, unamended. Re-confirmed on HDOT: "HB2021 HD2 SD2 CD1 (Act 259), signed by Governor Josh Green on July 15, 2026". `enactedOn: '2026-07-15'` correct. capitol.hawaii.gov still **403s** both the status page and the CD1 text, as documented |
| HI county guidance | Honolulu CSD's page still has **0** mentions of Act 259 or HB 2021 and still lists only the generic $30 / $15 fees. FAQ caveat stays accurate |
| UT HB 381 / WA ESSB 6110 | No amending legislation found. `lastVerified` deliberately **left at 2026-08-24** (enrolled texts not re-read this run) |
| New states | **None.** The national scan surfaced only the Illinois signing plus NJ/HI/UT/WA coverage already tracked |
| Carriers | **Not re-checked.** Friday, outside the Monday cadence and the July 19 window. All 3 stay `2026-08-24` |
| NJ + HI live UI | **Verified in a real browser** on the live URL (client-computed, curl cannot see it): NJ "DEADLINE PASSED" ×1, "January 19, 2027" ×1, **0** calendar buttons, **0** "days to comply" countdowns; HI "IN EFFECT" ×4 with **0** "Not in effect yet" banners |

### ⛔ The live site is now carrying a factually wrong status, and only a merge fixes it

Read off production in a real browser this run, the Illinois card says:

> PASSED BOTH CHAMBERS; AWAITING GOVERNOR

That became false on August 26. Live still serves main from 8/7 (footer "last reviewed August 7,
2026") because **everything since sits in the unmerged PR #15**. The correction is ready in the PR;
it reaches riders only when Paul merges.

**306 tests green**, build + prerender green. **The sitemap date guard was falsified before being
trusted:** bumping `LAST_REVIEWED` alone went red with `expected '2026-08-26' to be '2026-08-28'`
until `public/sitemap.xml` was updated too. Built artifact verified: "Public Act 104-0854" ×3,
"signed it on August 26, 2026" ×2, "Enacted; effective January 1, 2027" ×1, **"Effective: Jan" ×1**,
and **0** occurrences of "awaiting governor" / "awaits Governor" / "If signed" / "Passed both
chambers" / `104-0853` anywhere in `dist/`; **5** "Aug 28, 2026" chips + **2** "Aug 24, 2026"
(UT/WA); footer "last reviewed August 28, 2026"; sitemap stamped `2026-08-28`; FAQPage JSON-LD 16
entries with the Illinois signing text carried into it.

## August 26, 2026 law sync (Wednesday): no law changed; Illinois is 3 days from becoming law by default

Folded into the same branch/PR as the 8/10 → 8/24 passes (PR #15 is still unmerged, so a second draft
off an unmerged base would stack reviews). **No statute, bill, or effective date changed in any
tracked state.** Carriers were not re-checked (Wednesday, outside the Monday cadence and outside the
July 19 window), so all three stay `2026-08-24`.

### Illinois: a fresher control, and the deadline is now three days out

The 8/24 run proved SB 3484 is genuinely stalled by pairing its frozen status file against a control
bill whose file had just been rewritten. That control is now four days old, so this run took a newer
one. The General Assembly published **Public Act 104-0853 on August 25, 2026** (its file is stamped
`8/25/2026 2:37 PM`), and reading the act itself, it is **SB 3086**, not SB 3484:

| Evidence | Value |
|---|---|
| Public Act files in the 104th GA repository | **854** (was 852 on 8/24) |
| Newest act, 104-0853, file timestamp | **8/25/2026 2:37 PM** |
| 104-0853's own text | "Public Act 104-0853 SB3086 Enrolled" |
| Occurrences of "3484" in 104-0853 | **0** |
| SB 3484 status XML, `Last-Modified` | **still Wed, 01 Jul 2026 04:20:42 GMT** |
| SB 3484, last action | still "Sent to the Governor", 6/30/2026 (78 action rows) |
| SB 3484, occurrences of "public act" / "veto" | **0 / 0** |

The publishing pipeline moved as recently as yesterday and SB 3484 is still not in it. The 60-day
clock under Illinois Constitution Art. IV, Sec. 9 runs to **August 29, 2026**.

⛔ **The schedule problem flagged on 8/24 is now imminent and still needs Paul's call.** The cron is
`0 13 * * 1-5`, August 29 is a **Saturday**, and the last weekday run before it is **Friday August
28**. The next run after the deadline is **Monday August 31**, which must move the IL card off
"awaiting governor". Nothing in the schedule was changed unilaterally.

The IL card's `details` was updated to cite the August 25 control and to date itself August 26.
`details` is dead data (rendered nowhere), so this is data accuracy only, not user-visible.

### ⭐ California AB 2346 was presented to the Governor yesterday

Not a site change — AB 2346 is deliberately untracked (the 8/21 pass read its operative text and
found "insurance" 0, "registration" 0, "driver's license" 0, "license plate" 0) — but the watch item
moved. leginfo's status table now shows **"08/25/26 Enrolled and presented to the Governor at 4
p.m."**, one step past the 8/19 concurrence vote the last run recorded. Status is still
`Active Bill - Enrolled`: **0** "Chaptered", **0** "Vetoed", **0** "Approved by the Governor". Under
Cal. Const. Art. IV, Sec. 10(b) the Governor has 12 days from presentment, so a signature, a veto, or
a becomes-law-unsigned outcome lands around **September 6, 2026**. The ruling-out holds either way;
re-apply the informational-card test only if it is signed and coverage starts framing it as a
license/registration crackdown.

### Every tracked item re-verified against a primary source

| Item | Result |
|---|---|
| NJ S4834 (R1a enacted text) | Unchanged, re-read in full from `pub.njleg.gov`. Conjunctive, verbatim: "an electric motor capable of greater than 750 watts **that is** capable of reaching a speed greater than 28 miles per hour". **"helmet" 0 times.** Exactly **4** dollar figures ($5, $5, $50, $50), so still **no insurance minimums in the act**, the premise the N.J.A.C. 11:3-11.1 chain rests on. "furnish proof of insurance" ×1, "six months" ×1, "12th month" ×1 |
| NJ new-bill scan | All **10,712** 2026 bills pulled from the njleg API (identical count to 8/18, 8/21 and 8/24); **18** e-bike/scooter/moped-adjacent; **none** with a `GovernorAction`; **0** synopses mentioning 4834 or c.285. **No bill amending, delaying, or repealing S4834** |
| NJ watchlist | A2093 / S3156 / A3697 / S2070 / A1538 each still a **single** history row, 1/13/2026. S4524 still one row, 6/26/2026. S3178 still the two rows ending "Withdrawn Because Approved P.L.2025, c.285." Zero movement |
| IL SB 3484 | Unchanged. **See the control evidence above** |
| CA AB 1942 | Last action still 5/14/26 "In committee: Held under submission." Unchanged |
| CA AB 2346 | **Presented to the Governor 8/25/2026.** Untracked; see above |
| FL CS/SB 382 | "Vetoed by Governor" stands; **0** chapter-law citations, **0** "Override". Unchanged |
| MA S 3077 | Still exactly **5** action rows, last "7/22/2026 Senate Accompanied a study order (under JR10), see S3194". Unchanged |
| NY S08573 | nyassembly.gov mirror: still exactly **2** action dates, 11/07/2025 REFERRED TO RULES and 01/07/2026 REFERRED TO TRANSPORTATION. Unchanged |
| HI Act 259 | In effect since 7/15/2026, unamended. Re-confirmed on HDOT's page: "HB2021 HD2 SD2 CD1 (Act 259), signed by Governor Josh Green on July 15, 2026". `enactedOn: '2026-07-15'` correct. capitol.hawaii.gov still **403s** WebFetch, as documented |
| HI county guidance | Honolulu CSD's bicycle registration page still lists only the generic **$30** e-bike / **$15** pedal fee, with **0** mentions of Act 259 or HB 2021 and no register-before-you-ride rule. FAQ caveat stays accurate |
| UT HB 381 / WA ESSB 6110 | No amending legislation found. `lastVerified` deliberately **left at 2026-08-24** (enrolled texts not re-read this run) |
| New states | **None.** The national scan surfaced only NJ/HI/UT/WA coverage already tracked, plus **San Diego Ordinance O-22123** (under-12 ban on Class 1 and 2, effective 8/13/2026) — a **municipal** ordinance and an age rule, not license, registration, or insurance. No card |
| Carriers | **Not re-checked.** Wednesday, outside the Monday cadence and the July 19 window. All 3 stay `2026-08-24` |
| NJ + HI live UI | **Verified in a real browser** on the live URL (client-computed, curl cannot see it): NJ "DEADLINE PASSED" ×1, "January 19, 2027" fee-waiver copy ×1, **0** calendar buttons, **0** "days to comply" countdowns; "IN EFFECT" ×4 with **0** "Not in effect yet" banners. Live still serves main from 8/7 (footer "last reviewed August 7, 2026", 7 chips at "Aug 7, 2026"), because everything since sits in the unmerged PR #15 |

### Changes in this commit

IL card `details` rewritten around the August 25 control; the **5** cards actually re-checked
(CA/FL/IL/MA/NY) bumped to `2026-08-26`; **UT and WA left at `2026-08-24`**; carrier dates untouched;
footer and sitemap to August 26, 2026. **299 tests green**, build + prerender green. **The sitemap
date guard was falsified before being trusted:** reverting `public/sitemap.xml` alone goes red with
`expected '2026-08-24' to be '2026-08-26'`; restored, 299 green. Built artifact verified: **5**
"Aug 26, 2026" chips + **2** "Aug 24, 2026" (UT/WA), footer "last reviewed August 26, 2026", sitemap
stamped `2026-08-26`, FAQPage JSON-LD 16 entries, `104-0853` present once in the bundle, and **0**
occurrences of `104-0837` or "As of August 24, 2026".

## August 24, 2026 (same day, second pass): "make everything 1:1 with the law"

Paul asked for a full fidelity pass. Every tracked statute was re-read against its own enacted text
and every claim the site makes was checked against it. **No rule, verdict, threshold, dollar figure,
age, or date was wrong.** The engine is sound. What was wrong was the **citations**, and they are
user-visible on every verdict.

### ⛔ The site was showing riders paraphrases inside quotation marks

`Verdict.tsx` renders `citation.quote` wrapped in literal `"` characters. So whatever sits in that
field is a claim that the statute says exactly that. Most of New Jersey's did not:

> `"No person under 15 may operate. 15-16 requires a motorized bicycle license/permit. 17+ requires a basic driver's license or motorized bicycle license/permit."`

That is a summary someone wrote, shown to the rider as the text of the law. Worse, several appended
**our own commentary inside the quote marks**, so the statute appeared to say:

> `"... shall by regulation fix the amounts and limits of coverage of, and requirements for, such insurance. (The statute names no dollar figures. The regulation below does.)"`

On a site whose entire product is neutral legal accuracy, that is the defect that matters most.

**Fix:** `Citation` gains a `note` field for our own words, rendered **outside** the quotation marks.
Every `quote` is now verbatim statutory text, with `...` marking real elisions.

### ⛔ Five citations pointed at the wrong section of the act

Read against the enacted R1a text, section by section:

| Claim | Was cited as | Actually |
|---|---|---|
| Operator age and licence tiers | S4834 **§3** | **§5**, C.39:4-14.3(c)(1)-(3) |
| Minimum operating age | S4834 **§3** | **§5**, C.39:4-14.3(c)(1) |
| Rental licence exemption | S4834 **§3** | **§5**, C.39:4-14.3(c)(4) |
| Low-speed electric **scooters** exempt | S4834 **§10** (the fee waiver) | **§3**, C.39:4-14.16(f)(1) |
| Insurance not required for low-speed | S4834 **§5** | **§3**, C.39:4-14.16(f)(2) |
| Six-month grace to get insurance | S4834 **§5** | **§11** |

§3 is C.39:4-14.16, which is about where a low-speed e-bike may be ridden. The age and licence tiers
were never in it. The registration citation also bundled three different sections under one label
(§6 registration, §10 fee waiver, §7(b) quarterly reporting); it is now three separate citations.

⭐ **One claim I expected to be wrong turned out to be right.** The old §6 quote asserted
"Shared-rental companies may bulk-register quarterly in lieu of per-bike registration." The phrase
"bulk" appears nowhere in the act and I went looking to delete it. **§7(b) says exactly that**, in
different words: a shared-fleet company "may provide the serial number or other identifying numbers
of each low-speed electric bicycle ... on a quarterly basis in lieu of registering each shared
low-speed electric bicycle." The substance was right and the citation was wrong, which is the same
shape as the Velosurance near-miss. Check the claim before deleting it.

### Every rule re-verified against the enacted text, all correct

| Rule | Source read | Result |
|---|---|---|
| Min age 15; 15-16 moped licence; 17+ basic **or** moped licence | §5, C.39:4-14.3(c)(1)-(3) | 1:1 |
| Rental exemption, low-speed only, age 16+ | §5, C.39:4-14.3(c)(4) | 1:1 |
| Registration binds low-speed **and** motorized | §6, C.39:4-14.3i | 1:1 |
| Insurance binds motorized only | §11(a) + C.39:4-14.3e | 1:1 |
| $15,000 / $30,000 / $5,000, and (b) pedestrian PIP | N.J.A.C. 11:3-11.1, read verbatim | 1:1 |
| Fee waiver one year → 2027-01-19 | §10 | 1:1 |
| Six-month grace → 2026-07-19 | §11 | 1:1 |
| Conjunctive ">750 W **that is** capable of ... >28 mph" | R.S.39:1-1 as amended | 1:1 |
| §4 pedestrian PIP reaches bicycle + low-speed only, eff. 1/1/2027 | §4 + §13 | 1:1 |

**Hawaii was already almost exact.** Two quote-fidelity nits fixed: §249-14(b) silently dropped its
final clause ("by a law enforcement officer or designated official pursuant to section 249-15") with
no ellipsis, and the high-speed-device definition used `'single quotes'` where the statute uses
`"double quotes"`. All five HI quotes were then confirmed character-for-character against the live
CD1 text in a browser. **The conjunctive definition is confirmed again from the statute itself:**
"any device with a motor exceeding seven hundred fifty watts **and** capable of speeds over
twenty-eight miles per hour."

**Utah and Washington were re-read in full this time** (this morning's pass had deliberately skipped
them). Every card claim checked out 1:1, including UT 53-3-202(5)(c) ("may operate ... without: (i) a
class D driver license; (ii) a motorcycle endorsement; or (iii) a personal electric vehicle safety
certificate"), 41-6a-1512's $10 fee cap / $150 infraction cap / under-8 and under-16 rules, and
41-6a-1505(3)'s rented-class-1 carve-out. ⭐ **WA ESSB 6110 contains the word "insurance" zero times**,
and its only mentions of registration and licensing sit inside the *work group's* list of things to
*study* for a future electric-motorcycle framework. Both cards' informational classification is
correct, so **UT and WA `lastVerified` legitimately move to 2026-08-24** along with the other five.

### The guard: `citation-fidelity.test.tsx`

Data-only assertions would not have caught this, because the data looked fine until it was wrapped in
quotation marks. So the guard works on both levels:

- **Fetchable sources (NJ):** the enacted text is stored in `__fixtures__/nj-s4834-enacted.txt` with
  struck-through material removed so it reads as enacted law. Every quote must appear in it verbatim.
  Ellipses and bracketed substitutions are treated as gaps; the fragments around them still must match.
- **Unfetchable sources (HI):** capitol.hawaii.gov 403s curl **and** WebFetch, so those quotes live in
  `__fixtures__/verified-quotes.json` alongside the **SHA-256 of the enacted text they were checked
  against** (`9ab9c0de…`). Editing a quote turns the suite red until someone re-reads the statute.
- A **rendered** check: renders the real `<Verdict>` and asserts the note text is NOT inside quote marks.
- A commentary sniff test: statutes do not say "your", "we", or "this site".

⚠️ **Two normalization traps found while building it.** The reprint leaves stray spaces before
punctuation once struck text is removed ("motorized bicycle . (2)", "R.S. 39:1-1 ,"), which is markup
noise, not different wording. And the source is **cp1252**, not UTF-8; decoding it as UTF-8 turns
every apostrophe into a replacement character and "driver's license" silently becomes "driver s
license". Both are handled in `normalize()` and in the fixture build.

**Falsified five ways, every one caught:** restoring the old paraphrase quote → red; putting our
commentary back inside the quote marks → red; altering a Hawaii quote away from the manifest → red;
re-wrapping `note` in quotation marks in the component → red; reverting one section label to §3 → red.
Restored, **299 green**. 16 real per-quote checks run, and a test asserts the set is non-empty so a
silent empty pass cannot look like success.

### Also, at Paul's request: "The law (NJ MVC)" removed from the nav

The header carried a hardcoded link to New Jersey's MVC page on every page, including Hawaii's. The
site tracks seven states now. Removed. **The statute-specific authority link is untouched** in the
verdict disclaimer and the registration remedy, where it correctly resolves per jurisdiction (NJ MVC
for NJ, the county director of finance for HI).

### Changes in this commit

`Citation` gains `note`; `Verdict.tsx` renders it outside the quotation marks; all NJ citation
sections corrected and all NJ quotes replaced with verbatim text; registration split into §6 / §10 /
§7(b); two HI quotes made exact; UT and WA `lastVerified` → `2026-08-24` after a full re-read; the
NJ-only nav link removed; new fixtures and `citation-fidelity.test.tsx`. **299 tests green**, tsc
clean, build + prerender green. Built artifact: **7** "Aug 24, 2026" chips, footer "last reviewed
August 24, 2026", sitemap `2026-08-24`, FAQPage JSON-LD 16 entries, and **zero** occurrences anywhere
in `dist/` of the old wrong section labels, the paraphrase quotes, the in-quote commentary, the
"bulk-register" wording, or the removed nav link.

## August 24, 2026 law sync (Monday): no law changed; Illinois is 5 days from becoming law by default

Folded into the same branch/PR as the 8/10, 8/17, 8/18 and 8/21 passes (PR #15 is still unmerged, so a
second draft off an unmerged base would stack reviews). **No statute, bill, or effective date changed
in any tracked state, and no carrier claim moved.** Two things are worth carrying forward: a much
stronger piece of evidence for the Illinois conclusion, and a calendar problem in this routine's own
schedule.

### ⭐ Illinois: the "no action" finding now has a control, and it is a much better argument

Prior runs rested the IL conclusion on an absence: SB 3484's bill-status XML is stamped
`Last-Modified: Wed, 01 Jul 2026` and says "Sent to the Governor" (6/30/2026) with no Public Act. The
weakness in that was always the same: **an unchanged file cannot distinguish "nothing happened" from
"the sync is broken."**

This run closed that hole with a control. The Governor approved a batch of Senate bills on
**August 21, 2026**, and ILGA's nightly sync rewrote each of their status files the next morning:

| Evidence | Value |
|---|---|
| Control bill SB 3465, `Last-Modified` | **Sat, 22 Aug 2026 04:20:39 GMT** |
| Control bill SB 3465, last two actions | "Governor Approved" 8/21/2026, "Public Act . . . 104-0850" |
| SB 3484, `Last-Modified` | **still Wed, 01 Jul 2026 04:20:42 GMT** |
| SB 3484, last action | still "Sent to the Governor" 6/30/2026 |
| SB 3484, occurrences of "public act" | **0** |
| SB 3484, occurrences of "veto" | **0** |

**The sync is demonstrably live and SB 3484 is demonstrably untouched by it.** That is a positive
finding, not an absence.

⭐ **A second, independent signal points the same way.** The 8/21 batch was published in ascending
bill-number order, and **SB 3484 sits exactly in the skipped gap**: 104-0850 is SB 3465 and 104-0851
is SB 3707. The 15 new acts (104-0838 through 104-0852) were downloaded and grepped; **none is
SB 3484**.

The 60-day clock under Illinois Constitution Art. IV, Sec. 9 still runs to **August 29, 2026**.

### ⛔ The routine's own schedule cannot see the Illinois deadline

`0 13 * * 1-5` is weekdays only. **August 29, 2026 is a Saturday.** The last run before the deadline
is Friday **August 28**; the next is Monday **August 31**, which is after it. So no run lands on the
day the status actually changes, and the card's `statusLabel` ("Passed both chambers; awaiting
governor") goes stale over that weekend.

Nothing was changed in the schedule this run, because changing it is Paul's call. **Flagged for him:**
either accept that the 8/31 run catches it two days late, or run the sync manually over that weekend.
Whichever way, the 8/31 run must move the IL card off "awaiting governor".

### The stale Public Acts ceiling, again

The IL card's `details` said the published Public Acts ran "through 104-0837". They now run through
**104-0852** (852 act files in the repository listing, newest stamped 8/21/2026 3:27 PM). This is the
**third** run in a row where a hardcoded bottom-edge number went stale between passes, so the sentence
was rewritten to stop carrying a number that ages badly and to cite the control evidence above
instead. `details` is dead data (rendered nowhere), so this is data accuracy only, not user-visible.

### Every tracked item re-verified against a primary source

| Item | Result |
|---|---|
| NJ S4834 (R1a enacted text) | Unchanged, re-read in full. Conjunctive: "greater than 750 watts **that is** capable of reaching a speed greater than 28 miles per hour". **"helmet" 0 times.** Exactly **4** dollar figures ($5, $5, $50, $50), so still **no insurance minimums in the act**, the premise the N.J.A.C. 11:3-11.1 chain rests on. s.5(f)(1) strikes "furnish proof of insurance" for low-speed; s.5(f)(2) requires it registered **and** licensed; s.10 fee waiver; s.11 six-month grace; s.13 immediate effect except s.4 at the 12th month |
| NJ new-bill scan | All **10,712** 2026 bills pulled from the njleg API (identical count to 8/18 and 8/21); **18** e-bike-adjacent; **none** with a `GovernorAction`; **0** synopses mentioning 4834 / c.285. **No bill amending, delaying, or repealing S4834** |
| NJ watchlist | A2093 / S3156 / A3697 / S2070 / A1538 each still a **single** history row, 1/13/2026 ("Introduced, Referred to ..."). S4524 still one row, 6/26/2026. Zero movement |
| IL SB 3484 | Unchanged. **See the control-bill evidence above** |
| CA AB 1942 | Last action still 5/14/26 "In committee: Held under submission." Unchanged |
| CA AB 2346 | **Enrolled 8/21/2026**, last action 8/19/2026 "Senate amendments concurred in. To Engrossing and Enrolling." **Not signed, not vetoed, not yet chaptered.** Watch item stays open |
| FL CS/SB 382 | "Vetoed by Governor" stands, **0** chapter-law citations. Unchanged |
| MA S 3077 | Still **5** action dates, last 7/22/2026. Unchanged |
| NY S08573 | nyassembly.gov mirror: still exactly **2** action dates, 11/07/2025 and 01/07/2026. Unchanged |
| HI Act 259 | In effect since 7/15/2026, unamended. Re-confirmed on HDOT's page: "HB2021 HD2 SD2 CD1 (Act 259), signed by Governor Josh Green on July 15, 2026 ... which took effect upon the Governor's signature". `enactedOn: '2026-07-15'` correct. ⚠️ The HDOT URL moved (the 8/21 `/blog/2026/07/15/` path now 404s; it is `/blog/2026/07/16/new-law-enacted-to-improve-electric-bicycle-safety/`). ⚠️ HDOT still writes the high-speed threshold as "750 watts **or** ... 28 miles per hour"; the CD1 statutory text is conjunctive and the site follows the text, not the agency summary |
| HI county guidance | Honolulu CSD still lists only the generic **$30** e-bike / **$15** pedal fee, **0** mentions of Act 259, no register-before-you-ride rule. FAQ caveat stays accurate |
| UT HB 381 / WA ESSB 6110 | No amending legislation found. `lastVerified` deliberately **left at 2026-08-21 (UT) and 2026-08-07 (WA)** (enrolled texts not re-read this run) |
| New states | **None.** National scan surfaced only bills already ruled out (CA SB 956, AZ SB 1008) plus **TN**, whose July 1 2026 change is an under-16 restriction on Class 3, i.e. an age rule, not license/registration/insurance, and not widely misreported. No card |
| NJ + HI live UI | **Verified in a real browser** on the live URL (client-computed, curl cannot see it): NJ eyebrow "IN EFFECT · DEADLINE PASSED", "fees stay waived through January 19, 2027", **0** calendar buttons, **0** "days to comply" countdowns; HI card "IN EFFECT" with no "Not in effect yet" banner |

### Carriers re-verified (Monday cadence), all three unchanged

| Carrier | Checked against the live page | Result |
|---|---|---|
| Velosurance | `$15,000` / `$30,000` / `$5,000` all present; "Insurance is required for every e-bike class in New Jersey under New Jersey S4834" present verbatim; "A helmet is mandatory for every e-bike rider, regardless of age, under New Jersey S4834" present verbatim; the self-contradicting correct line ("do not qualify as Class 1 or Class 2") also still present | Card accurate, including both cautions. No change |
| Sundays | "We do not offer cyclist liability insurance." present verbatim | No change |
| VOOM | "Register to our waiting list", "we will be launching soon", `$35,000` present, `15,000` **0 times** | Still waitlist. No change |

⚠️ **The recurring near-miss, avoided again.** `liability-only` and `500,000` still appear **zero
times** on Velosurance's NJ page. Those two claims are **not** sourced to that page; they come from
Bicycle Retailer (2026-07-08) and Velosurance's own launch announcement. This is the same trap the
8/17 run wrote down: **a carrier page not carrying a claim is not the same as the claim being wrong.**
Check whether the claim still has a source before rewriting around the page.

**Markel and Progressive stay deliberately unlisted.** Markel's bicycle page has **0** occurrences of
"New Jersey"; Progressive's e-bike answers page now **404s** entirely. Neither has on-page NJ e-bike
liability evidence. A search for new NJ entrants found none: Velosurance remains the only carrier with
an NJ-specific S4834 liability product.

### Changes in this commit

IL card `details` rewritten (stale Public Acts ceiling out, control-bill evidence in); the **5** cards
actually re-checked (CA/FL/IL/MA/NY) bumped to `2026-08-24`; **UT left at `2026-08-21`, WA left at
`2026-08-07`**; all **3** carriers bumped to `2026-08-24` and VOOM's self-dating prose moved to
"as of August 24, 2026" to match; footer and sitemap to August 24, 2026.

**279 tests green**, build + prerender green. **Both date guards falsified before trusting them:**
reverting the sitemap `lastmod` alone goes red with `expected '2026-08-21' to be '2026-08-24'`;
reverting VOOM's prose date alone goes red with `expected 'August 17, 2026' to be 'August 24, 2026'`;
restored, 279 green. Built artifact verified: **5** "Aug 24, 2026" chips + **1** "Aug 21, 2026" (UT)
+ **1** "Aug 7, 2026" (WA), footer "last reviewed August 24, 2026", sitemap stamped `2026-08-24`,
FAQPage JSON-LD 16 entries, **0** occurrences of `104-0837` / `August 17, 2026` / `2026-08-17`
anywhere in `dist/`, and the single surviving `2026-08-21` string in the bundle is UT's `lastVerified`,
which is correct.

## August 21, 2026 law sync: no law changed anywhere; the Utah card was telling riders a half-truth

Folded into the same branch/PR as the 8/10, 8/17 and 8/18 passes (PR #15 is still unmerged, so a
second draft off an unmerged base would stack reviews). **No statute, bill, or effective date changed
in any tracked state.** What changed is one of our own claims, and it was user-visible on the live
site.

### ⛔ The UT card said a partial list of HB 381's new rules was the whole list

Live copy, on the card and in the FAQ:

> New for ordinary e-bikes: a helmet for riders under 21 on highways and a ban on riding while drinking.

The FAQ's version was stronger and worse: *"New for ordinary e-bike riders: **only** a helmet …"*.

Reading the enrolled PDF again, that list is incomplete, and the word "only" makes it false. HB 381
also enacts **Sec. 41-6a-1512**, a "personal electric vehicle safety certificate" program whose
definition of *personal electric vehicle* **expressly includes an electric assisted bicycle**. From
**May 5, 2027**:

- A rider **8 or older and under 16** may not operate an e-bike with the motor engaged **on a
  highway** unless they either obtain the certificate **or** ride under the direct supervision of a
  parent or another responsible adult (Sec. 41-6a-1115.5(4), repeated verbatim at Sec. 53-3-202(5)(b)).
- A rider **under 8** may not operate one on a highway at all (Sec. 41-6a-1115.5(6)).
- A rider **under 16** may not use a freeway (Sec. 41-6a-1512(5)).
- The certificate is online-completable, the fee is capped at **$10**, and a violation is an
  infraction capped at **$150**.

⭐ **This REPLACED a narrower prior rule that required supervision only under age 14**, so it is a
genuine tightening, not a restatement. A Utah parent reading our card would have concluded there was
nothing coming for their 15-year-old. There is.

**The card's verdict never moved.** Scope discipline still puts Utah in the informational/gray bucket
with `requirementHints: []`: a youth safety certificate that an adult riding along satisfies is an
age/supervision rule, not license, registration, title, or insurance. The conclusion was right; the
list backing it was not. Same shape as the 8/18 Illinois fix.

⭐ **The re-read also produced better evidence FOR the conclusion than we had before.** Utah's
driver-licensing statute now says it outright, so we no longer have to infer it from the "motor
vehicle" exclusion alone:

- Sec. 53-3-202(5)(b)(i), an under-16 rider "is not required to hold a class D driver license or a
  motorcycle endorsement" to ride an e-bike on a highway.
- Sec. 53-3-202(5)(c), a rider **16 or older** may ride "without" a class D driver license, a
  motorcycle endorsement, **or** a safety certificate.

Both are now quoted in the card and the FAQ.

⚠️ **A secondary source had this backwards and would have taken us with it.** Search summaries
claimed "riders 16–17 without a driver's license also need the certificate; riders 18+ … similarly
required." Sec. 53-3-202(5)(c) says the exact opposite. The statute contradicted the summary, and the
statute won. Two other card claims were checked the same way and held: the under-21 helmet rule is
real (Sec. 41-6a-1505(1)(b), broadened from class-3-only, **and it does not apply to a rented class 1
e-bike**, Sec. 41-6a-1505(3), a carve-out the card had also omitted), and the Jan 1 2027 point-of-sale
disclosure is real. One citation in `details` was wrong and is fixed: that disclosure is
**Sec. 41-6a-1511(6)(a)**, not 41-6a-1115.6. `details` also claimed a single "driver-licensing
disclosure section" carried the May 5 2027 date; **four** sections do (41-6a-1115, 41-6a-1115.5,
41-6a-1512, 53-3-202), and 53-3-202 is not a disclosure section.

### New guard, and it was wrong on the first try

`site-consistency.test.ts` now asserts the UT card's `oneLiner` and the FAQ's Utah bullet **both**
carry the May 5 2027 certificate rule, and that neither frames its safety-rule list as exhaustive.
This is the repo's recurring defect shape: one fact in two files with nothing keeping the copies equal.

⚠️ **The first version scanned all of `Faq.tsx` and went red on correct copy**, Massachusetts'
bullet legitimately says S 3077 "required only a helmet and a minimum age of 16", which is true of
that bill. Rescoped to slice out the Utah `<li>` alone. Exactly the caveat already written down for
the rendered-copy guard: check the sentence that makes the claim, not the whole page.

**Falsified both ways before trusting it:** reverting the card `oneLiner` alone → 1 test red;
reverting the FAQ bullet alone → 2 tests red; restored → **279 green**. The MA sentence stays green
throughout.

### ⭐ Three new states found, all three deliberately ruled out

| Bill | What the operative text actually says | Card? |
|---|---|---|
| **CA AB 2346** (Wilson), **passed both chambers 8/19/2026**, 77-0 / 38-0, now enrolling for Newsom | **"insurance" 0, "registration" 0, "driver's license" 0, "license plate" 0, "certificate of title" 0.** Sidewalk/path speed limits, an under-16 15 mph cap (warnings only until 12/31/2027), 2029 lamp + speedometer mandates **on sellers**, point-of-sale disclosures. New Sec. 12810.1 **REMOVES** a driver's-license violation point rather than adding one. The only mention of registering/insuring sits inside a point-of-sale warning about what happens if a buyer **modifies** the bike past legal limits, i.e. existing motorcycle law | **No.** Speed/equipment/age bill. Coverage frames it accurately, so the FL/IL "widely misreported" carve-out does not apply |
| **NC HB 1094 §19 / SL 2026-46**, signed 7/7/2026, effective **12/1/2026** | **Zero** occurrences of insurance, registration, drivers license, financial responsibility, certificate of title, or license plate in the entire e-bike section. Adopts the 3-class definition, grants statewide roadway/bike-lane/multiuse-path access, requires a helmet under 18 on Class 3, lets cities and counties regulate paths and sidewalks | **No.** Classification + access + helmet |
| **CA SB 956** (Choi), the Orange County e-bike plate pilot | Never got a hearing (**first hearing canceled at the author's request, 4/20/2026**) and never left its first policy committee. Text only **authorizes** local ordinances, it mandates nothing, which is the MA S 3077 pattern. "insurance" 0, "driver's license" 0 | **No.** Deader than the AB 1942 already tracked for California, and authorizing rather than mandating |

CA's other e-bike bills were checked and are all dead or out of scope: **AB 1557** held under
submission 5/14/26, **AB 2284** failed passage 4/20/26, **SB 455** returned under Joint Rule 56 on
2/2/26. NJ and HI remain the only two states with a live compliance requirement.

⚠️ **Watch item for the next runs: if Newsom signs AB 2346**, California gets a real e-bike law. It
still adds no license, registration, or insurance, so the ruling-out holds, but if coverage starts
framing it as a crackdown the informational-card test should be re-applied.

### Every tracked item re-verified against a primary source

| Item | Result |
|---|---|
| NJ S4834 (R1a enacted text) | Unchanged, re-read in full. Conjunctive: "greater than 750 watts **that is** capable of reaching a speed greater than 28 miles per hour". **"helmet" 0 times.** Exactly **4** dollar figures in the act ($5, $5, $50, $50), so still **no insurance minimums**, the premise the N.J.A.C. 11:3-11.1 chain rests on. s.5(f)(1) strikes "furnish proof of insurance" for low-speed; s.5(f)(2) requires it registered **and** licensed; s.10 one-year fee waiver; s.11 six-month grace; s.13 immediate effect except s.4 at the 12th month |
| NJ new-bill scan | All **10,712** 2026 bills pulled from the njleg API (identical count to 8/18); **18** e-bike-adjacent; **none** with a `GovernorAction`. **No bill amending, delaying, or repealing S4834** |
| NJ watchlist | A2093 / S3156 / A3697 / S2070 / A1538 each still a **single** history row, 1/13/2026. S4524 still one row, 6/26/2026. Zero movement |
| IL SB 3484 | Still "Sent to the Governor" 6/30/2026, **zero** "public act" strings in its status record, and its XML's `Last-Modified` is **still 2026-07-01** while the nightly sync keeps running. Falsified a second way: the Public Acts list has grown to **104-0837** since the last run, and the three new acts are **SB3044, SB3048, SB3506**, none is SB 3484. 60-day clock still runs to **August 29, 2026** (8 days out) |
| CA AB 1942 | Last action still 5/14/26 "In committee: Held under submission." Unchanged |
| FL CS/SB 382 | Enrolled 3/17, presented to the Governor **6/15/2026**, **"Vetoed by Governor" 6/25/2026**, no override. Card's dates confirmed correct |
| MA S 3077 | 5 actions total, last "7/22/2026 Senate Accompanied a study order (under JR10), see S3194" |
| NY S08573 | nyassembly.gov mirror: 11/07/2025 REFERRED TO RULES, 01/07/2026 REFERRED TO TRANSPORTATION. Unchanged |
| HI Act 259 | In effect since 7/15/2026, unamended. Confirmed via HDOT's own page: "HB2021 HD2 SD2 CD1 (Act 259), signed by Governor Josh Green on July 15, 2026 … took effect upon the Governor's signature". `enactedOn: '2026-07-15'` correct; watch item stays **resolved**. ⚠️ Note HDOT's own summary writes the high-speed threshold as "750 watts **or** … 28 miles per hour"; the CD1 statutory text is conjunctive and the site follows the text, not the agency summary |
| HI county guidance | Honolulu CSD still lists only the generic **$30** e-bike / **$15** pedal fee, **no** Act 259 mention and no register-before-you-ride rule, so the FAQ caveat stays accurate |
| UT HB 381 | **Re-read in full against the enrolled PDF. See the correction above.** |
| WA ESSB 6110 | No amending legislation found. `lastVerified` deliberately **left at 2026-08-07** (enrolled text not re-read this run) |
| Carriers | **Not re-checked.** Friday, and outside the July 19 window. All 3 stay `2026-08-17` |
| NJ + HI live UI | **Verified in a real browser** on the live URL (client-computed, curl cannot see it): NJ eyebrow "IN EFFECT · DEADLINE PASSED", "fees stay waived through January 19, 2027", **0** calendar buttons, no countdown; HI card "IN EFFECT", no "Not in effect yet" banner |

### Changes in this commit

UT card `oneLiner` and `details` rewritten; FAQ Utah bullet rewritten (auto-propagates to the FAQPage
JSON-LD); IL `details` date reference moved to August 21 and its Public Acts ceiling updated to
104-0837; new cross-file guard in `site-consistency.test.ts`; the **6** cards actually re-checked
(CA/FL/IL/MA/NY/UT) bumped to `2026-08-21`; **WA left at `2026-08-07`**; carrier dates untouched;
footer and sitemap to August 21, 2026. **279 tests green**, build + prerender green. Built artifact
verified: **zero** occurrences of the old false sentence anywhere in `dist/`, the new copy present
twice in the prerendered HTML, **6** "Aug 21, 2026" chips + **1** "Aug 7, 2026" (WA), footer "last
reviewed August 21, 2026", sitemap stamped `2026-08-21`, FAQPage JSON-LD 16 entries, and the
Massachusetts "required only a helmet and a minimum age of 16" sentence still intact.

## August 18, 2026 law sync: no law changed; ILGA's scraper block found, and a stale citation corrected

Folded into the same branch/PR as the 8/10 and 8/17 passes (PR #15 is still unmerged, so a second
draft off an unmerged base would stack reviews). **No statute, bill, or effective date changed
anywhere.** Two things did change: the way Illinois has to be verified, and one now-false sentence
this repo was carrying.

### ⭐ ilga.gov now blocks automated requests. Use the file repository instead.

`https://www.ilga.gov/Legislation/BillStatus?...` returns a 3,988-byte **"Access Denied /
Automated Request Blocked"** page to `curl` and to WebFetch. It is not a transient failure and it is
not our IP; the page itself says so and points at the fix.

**The replacement is better than what it replaced, and it is a genuine primary source:**

| What | Where |
|---|---|
| Repository root | `https://ftp.ilga.gov/` (IIS directory listing, synced nightly from ILGA production) |
| One bill's full status as XML | `https://ftp.ilga.gov/Legislation/104/BillStatus/XML/10400SB3484.xml` |
| Every bill's status (12,800 files) | `https://ftp.ilga.gov/Legislation/104/BillStatus/XML/` |
| Public Acts, one HTML file each | `https://ftp.ilga.gov/Public%20Acts/104/104-0834.htm` |

The XML carries `<lastaction>` with chamber and date, the full action list, sponsors and synopsis.
⭐ **The `Last-Modified` header is itself evidence**: `10400SB3484.xml` is stamped
**Wed, 01 Jul 2026 04:20:42 GMT**, so ILGA's nightly sync has not rewritten that bill's record since
the day after it went to the Governor. No action has happened, rather than no action being reported.

### The stale sentence, and how it got there

The IL card's `details` said the 104th GA's Public Acts list ran **104-0001 through 104-0741**. The
repository's own directory listing shows it runs to **104-0834** (plus one out-of-sequence
104-5446), with files dated 8/7, 8/10, 8/11 and 8/17. The 8/17 run read a source that was either
paginated or stale and recorded its bottom edge as the end of the list. The **conclusion** was right
and is still right; the **number backing it** was wrong the moment it was written.

Rewritten to cite what was actually checked, which is also the harder-to-be-wrong-about source: the
bill-status record itself. `details` is dead data (rendered nowhere), so this is data accuracy only,
not a user-visible change.

**Falsified the conclusion two independent ways before rewriting:**
1. ILGA's own bill-status XML for SB 3484: last action **"Sent to the Governor" 6/30/2026**, zero
   occurrences of "Public Act" anywhere in the record.
2. Downloaded **236 Public Acts** (104-0600 through 104-0834, plus 104-5446) and grepped them.
   114 of the 236 are Senate bills. **Zero** mention SB 3484.

The 60-day clock under Illinois Constitution Art. IV, Sec. 9 still runs to **August 29, 2026**.

### Every tracked item re-verified against a primary source

| Item | Result |
|---|---|
| NJ S4834 (R1a enacted text) | Unchanged, re-read in full. Conjunctive ">750 watts **and** ... greater than 28 miles per hour"; s.10 one-year fee waiver; s.11 six-month grace; s.13 immediate effect except s.4 at the 12th month. **"helmet" appears 0 times.** Only **4** dollar figures in the whole act, and they are the `$5` permit fee and the `$50` dismissible carry offense, so **no insurance minimums**, which is the premise the N.J.A.C. 11:3-11.1 chain rests on. s.5(f)(1) strikes "furnish proof of insurance" for low-speed; s.5(f)(2) requires it to be registered **and** licensed |
| NJ new-bill scan | All **10,712** 2026 bills pulled from the njleg API; **18** e-bike-adjacent; **none** with a `GovernorAction`. **No bill amending, delaying, or repealing S4834** |
| NJ watchlist | A2093 / S3156 / A3697 / S2070 / A1538 each still at a **single** history row, 1/13/2026. S4524 still one row, 6/26/2026 ("Introduced in the Senate, Referred to Senate Transportation Committee"). Zero movement |
| IL SB 3484 | Still "Sent to the Governor" 6/30/2026, no Public Act. See above |
| CA AB 1942 | Held under submission 5/14/2026. Full history read; **no action after 5/14** |
| FL CS/SB 382 | "6/25/2026 Vetoed by Governor" on flsenate.gov, no override |
| MA S 3077 | 5 actions total, last "7/22/2026 Senate Accompanied a study order (under JR10), see S3194" |
| NY S08573 | nysenate.gov is behind a Cloudflare challenge; **nyassembly.gov mirrors the same bill** and shows 11/07/2025 REFERRED TO RULES, 01/07/2026 REFERRED TO TRANSPORTATION. Unchanged |
| HI Act 259 | In effect since 7/15/2026, unamended. `enactedOn: '2026-07-15'` correct. Watch item stays **resolved** |
| HI county guidance | Honolulu CSD still lists only the generic `$30` e-bike / `$15` pedal fee with **no** Act 259 mention, so the FAQ caveat stays accurate |
| UT HB 381 / WA ESSB 6110 | No amending legislation found. `lastVerified` deliberately **left at 2026-08-07** (enrolled texts not re-read this run) |
| Carriers | **Not re-checked.** Tuesday, and outside the July 19 window. All 3 stay `2026-08-17`, and VOOM's "as of August 17, 2026" prose stays matched to its own date |
| NJ + HI live UI | **Verified in a real browser** on the live URL: NJ eyebrow "IN EFFECT · DEADLINE PASSED", "fees stay waived through January 19, 2027", **0** calendar buttons, no countdown; HI "IN EFFECT" with no "Not in effect yet" banner |

### ⭐ Oregon HB 4007 found and deliberately ruled out

A national scan surfaced **Oregon HB 4007 (2026 Oregon Laws ch. 101)**, which this repo does not
track. Read the **enrolled PDF** (18 pages) rather than the coverage. It gets **no card**, not even
an informational one:

- The word **"insurance" appears 0 times in the entire act.**
- It creates "powered micromobility device" (max 28 mph, under 100 lb) and **expressly excludes
  electric assisted bicycles** from that definition (Sec. 2(2)(b)(A)), so ordinary e-bikes are
  outside the new category entirely.
- Where it touches title (ORS 803.030), registration (ORS 803.305) and financial responsibility
  (ORS 806.020), it **adds devices to the exemption lists**. It removes obligations; it does not
  create them.
- ORS 807.020(15) as amended lets a person ride "without any grant of driving privileges" and
  **lowers** the Class 1 floor from 16 to 14. That is a licensing **exemption** getting wider.
- The new offenses ("selling an impostor vehicle", improper sale of a battery or conversion kit)
  bind **sellers**, not riders.
- Substance is protective headgear, minimum ages, and sales labeling, and the amendments are
  **operative January 1, 2027** (Sec. 33) even though the act took effect 91 days after sine die.

The informational-card carve-out exists for bills that are **widely misreported** as license or
registration mandates (the FL and IL pattern). Oregon is not: BikePortland states plainly that "no
license, no registration, no plates are required in Oregon" and contrasts it with New Jersey.
Nothing to correct, so nothing to publish.

No other state surfaced. NJ and HI remain the only two states with a live compliance requirement.

### Changes in this commit

`details` sentence on the IL card rewritten; the **5** cards actually re-checked (CA/FL/IL/MA/NY)
bumped to `2026-08-18`; UT/WA left at `2026-08-07`; footer and sitemap to August 18, 2026. Carrier
dates untouched. **The sitemap guard earned its keep**: bumping `LAST_REVIEWED` alone turned
`site-consistency.test.ts` red with `expected '2026-08-17' to be '2026-08-18'` until
`public/sitemap.xml` was updated too. **275 tests green**, build + prerender green. Built artifact
verified: **5** "Aug 18, 2026" chips + **2** "Aug 7, 2026" (UT/WA), footer "last reviewed August 18,
2026", sitemap stamped `2026-08-18`, FAQPage JSON-LD 16 entries, and the only three surviving
`2026-08-17` strings in the bundle are the three carrier `lastVerified` values, which is correct.

## August 17, 2026 — law sync (Monday): no law changed; one carrier page moved under us again

Folded into the same branch/PR as the 8/10 pass (PR #15 is still unmerged, so branching a second
draft off an unmerged base would have stacked two reviews; this repeats what PR #14 did with the
8/3 → 8/6 → 8/7 commits). **No statute, bill, or effective date changed anywhere.**

**Every tracked item re-verified against a primary source:**

| Item | Result |
|---|---|
| NJ S4834 (R1a enacted text) | Unchanged. Conjunctive ">750 W **and** >28 mph", s.11 six-month grace, s.13 immediate effect, s.10 one-year fee waiver, **no dollar figures**, low-speed needs registration **and** a license (s.5(f)(2)) |
| NJ new-bill scan | All **10,712** 2026 bills pulled; **20** e-bike-adjacent, **none** with a `GovernorAction`. **No bill amending, delaying, or repealing S4834** |
| NJ watchlist | A2093 / S3156 / A3697 / S2070 **and** A1538 all still at a single action, "Introduced" 1/13/2026; S4524 still 6/26/2026. Zero movement |
| HI Act 259 | In effect. `enactedOn: '2026-07-15'` already correct; the watch item is **resolved** |
| HI county guidance | Honolulu CSD still shows only the generic $30 e-bike / $15 pedal fee and **no Act 259 mention**, so the FAQ caveat stays accurate |
| IL SB 3484 | Still "Sent to the Governor" 6/30/2026. Confirmed against the **ILGA's own Public Acts list for the 104th GA (104-0001 → 104-0741): no entry for SB 3484.** 60-day clock still runs to **Aug 29** |
| CA AB 1942 | Held under submission 5/14/2026, unchanged |
| FL CS/SB 382 | Vetoed 6/25/2026, no override, unchanged |
| MA S 3077 | "Accompanied a study order (under JR10), see S3194" 7/22/2026, unchanged |
| NY S08573 | Senate Transportation, last action 1/7/2026, unchanged |
| UT HB 381 / WA ESSB 6110 | No amending legislation. `lastVerified` deliberately **left at 2026-08-07** (enrolled texts not re-read this run) |
| New states | None. Nothing new in OH / PA / VA / MD / CT or the national scan |
| NJ post-deadline UI | **Verified on the live URL in a real browser** (curl cannot see it, it is client-computed): eyebrow "IN EFFECT · DEADLINE PASSED", "deadline has passed, but you can still come into compliance … fees stay waived through January 19, 2027", **0 calendar buttons**, no countdown. HI card "IN EFFECT" |

### ⚠️ Velosurance's NJ page was rewritten again, and this time it states two things the law does not

Same shape as the 8/7 finding, opposite conclusion. Our card's **product** claims survived; their
**legal summary** did not.

- `liability-only` and `500,000` now appear **zero times** on their NJ page (checked against the raw
  HTML, not a summarizer's negative claim). My first read was that our card had gone stale. It had
  not: the liability-only option and the "limits up to $500,000" figure are both still carried by
  **Bicycle Retailer, 2026-07-08**, which quotes the NJ minimums as $15k/$30k/$5k. **The card was
  right and I nearly "fixed" correct copy.** The page's own $15k/$30k/$5k statement is still there,
  verbatim, so the one claim we source to the page is intact.
- What is new: the page now tells riders **"Insurance is required for every e-bike class in New
  Jersey under New Jersey S4834"** and **"A helmet is mandatory for every e-bike rider, regardless
  of age, under New Jersey S4834."** Both are false, and the page **contradicts itself** on the
  first one (elsewhere it correctly limits insurance to bikes that "do not qualify as Class 1 or
  Class 2").
  - Insurance: **grepped the enacted R1a text** — the insurance evidence provisions attach to a
    *motorized bicycle*, and s.5(f) strikes "furnish proof of insurance" for low-speed. NJ MVC's own
    page says it verbatim: *"Only motorized bicycles are required to have insurance coverage.
    Low-Speed Electric Bicycles do not require insurance but must be registered with MVC."*
  - Helmets: the word **"helmet" appears 0 times in the entire enacted act**. A universal helmet
    rule is S4524, still parked in committee since 6/26. They are quoting a pending bill as law.
  - The Velosurance card now carries a short caution, mirroring the one already on the VOOM card.
- **VOOM unchanged**: still waitlist ("we will be launching soon", "Register to Our Waitlist"), still
  states the minimum as **$35,000 bodily injury** (the automobile figure), zero `15,000` on the page.
- **Sundays unchanged**, re-confirmed verbatim: *"We do not offer cyclist liability insurance."*
- **Markel + Progressive**: still no on-page NJ e-bike liability evidence, still deliberately unlisted.

⭐ **The lesson worth keeping: a carrier page changing is not the same as our card being wrong.**
Check whether the *claim* still has a source before rewriting around the *page*. On 8/7 the page had
outrun our card; on 8/17 our card had outlived the page but kept its evidence.

### New guard

`site-consistency.test.ts` now asserts that any carrier whose `oneLiner` dates itself
("still pre-launch in NJ **as of August 17, 2026**") uses the same date as its own
`source.lastVerified`. VOOM's prose said August 10 after the carrier had actually been re-checked, so
the card was advertising a staleness it no longer had. **Falsified**: confirmed the test runs (not
silently skipped by the regex), goes red with `expected 'August 10, 2026' to be 'August 17, 2026'`
when the stale date is reintroduced, and green when restored. **275 tests**, build + prerender green.

Dates bumped: the **5** cards actually re-checked (CA/FL/IL/MA/NY) and all **3** carriers → `2026-08-17`;
footer + sitemap → August 17, 2026. Built-artifact verified: 5 "Aug 17, 2026" chips + 2 "Aug 7, 2026"
(UT/WA), footer "last reviewed August 17, 2026", **zero** stale August 10 strings.

## August 10, 2026 — full QA pass: 14 defects fixed, and a guard layer that is proven to work

Branch `law-sync/2026-08-10`, PR #15 (draft). Started as a routine law sync (**no law changed**) and
became the biggest correctness pass since the insurance-minimums fix. **Read this before writing any
user-facing copy or touching the form.**

### The two lessons

**1. The engine suite cannot see what a rider reads.** Three copy defects shipped to production
behind a 100% green suite, because every test asserted on `Compliance` objects and nothing ever
rendered a component. A verdict being *correct* and a verdict being *readable* are tested by
different things, and only one of those tests existed.

**2. A guard you have not tried to break is not a guard.** The first version of the bounds guard
looked thorough and was hollow: reverting BOTH bounds fixes left the suite green at 240 passing,
because the test exercised `encodeAnswers`/`decodeAnswers` directly and never went through the form's
own submit path. That was only discovered by deliberately reintroducing each bug and checking the
suite went red. **Do that every time you add a regression test.**

Every one of the 14 defects is one of two shapes: a value reaching a rider untranslated, or one fact
living in two places with nothing keeping the copies equal.

### What was wrong (all verified against the real files, all fixed)

Copy composition:
- `labelOf()` held only New Jersey's four categories and fell through `?? slug`, so **every Hawaii
  rider in the ambiguity band read "we classified it conservatively as class-3 ... the alternate
  reading would be class-2"**.
- The license gap and its remedy joined raw enum ids: **"Accepted: basic-drivers or
  motorized-bicycle."**
- The registration line hardcoded "the" before an interpolated authority name → **"the your county's
  director of finance"** (HI) and a missing article (NJ).

Bounds (the app emitting a link it cannot read back):
- Speed/wattage were only checked while the throttle question was answered "has a throttle".
  **Answer it, type 100 mph, switch to "no motor"** → inputs unmount, native validation stops
  applying, state keeps 100, `s=100` goes in the URL, decoder's max is 50 → the rider gets a working
  verdict and a **dead "Copy share link"**.
- Age accepted `0` while the decoder required `>= 1`; `validate()` never checked age at all.
- The three coverage inputs had no max, so anything over `MAX_SAFE_INTEGER` produced a dead link.

Duplicated facts:
- **The FAQ stated ">750 W or 28 mph is legally a motorcycle" as settled law**, contradicting the
  correct conjunctive statement four answers above it. The statute is **conjunctive** (re-verified
  against the R1a enacted text). README carried the same "or".
- `sitemap.xml` lastmod was 2026-07-09 while the footer said August 2026.
- `index.html` meta + og descriptions named **5** tracked states; the app renders **7**.
- The README's **CI badge 404s** (pointed at `somekidpaul/ebikelaw`; the repo is `myebikelaw`), still
  called Hawaii an unbuilt "pending" bill, and quoted a test count of 28 in three places.

Other:
- The Illinois card read **"Effective: Jan 2027" for a bill still with the governor**, because the
  label keyed off `isInformational` ("nothing for a rider to do") instead of enactment.
- The splash heading "Bills in motion elsewhere" labelled seven cards, five stalled/vetoed/enacted.
- The FAQ's structured data **quoted a UI control to Google**: an `acceptedAnswer.text` ended
  "Add deadline to calendar".

### The guard layer

| Guard | File | Catches |
|---|---|---|
| Type-level totality | `types/bike.ts`, `types/operator.ts` | `bikeCategoryProse` / `licenseKindProse` are `Record<Union, string>`. A new category or license with no prose is a **compile error**, not a slug shipped to a rider. |
| Rendered copy | `components/verdict-copy.test.tsx` | Renders the real `<Verdict>` for **both statutes across 12 verdict paths**; asserts no leaked enum id in any composed sentence, no doubled article, no unarticled authority name. |
| Form → URL property | `components/form-logic.test.ts` | **The one that matters:** anything `validateFormState` accepts must produce a URL `decodeAnswers` accepts. Covers both bounds bugs and the ones not thought of yet. |
| Form input attrs | `components/form-inputs.test.tsx` | Renders the real `<Form>` and reads `min`/`max` off the HTML, so browser-enforced bounds match `FORM_BOUNDS`. |
| Share round-trip | `lib/share-roundtrip.test.ts` | Boundary matrix survives encode → decode; decoder stays **looser** than the form so legacy links keep opening. |
| Site consistency | `data/site-consistency.test.ts` | Reads the real files: sitemap↔footer date, meta descriptions vs actual tracked states, CI badge slug, and that no file says "750 W **or** 28 mph". |

Structure that makes the above possible:
- `components/form-logic.ts` — the form's pure logic, lifted out of the component where it was
  unreachable closures. **Form.tsx must keep importing this.** It briefly did not, and the tests went
  green against code the app was not running. That is the failure mode to watch.
- `lib/field-bounds.ts` — `FORM_BOUNDS`, the single source for input attrs and validation.
- `data/site-meta.ts` — `LAST_REVIEWED`, the single source for the footer; **`prerender.mjs` stamps
  `dist/sitemap.xml` from it**, so that drift is now structurally impossible.
- `vite.config.ts` test include is `{ts,tsx}`. Without it a rendered-output test cannot exist.
- `site-consistency.test.ts` loads files via Vite `?raw`, not `node:fs`, so no node types leak into
  the app tsconfig.

### Falsification results (every guard was deliberately broken and confirmed to fail)

All 14 reintroduced bugs were caught. `nj-article` 6 tests, `hi-double-article` 8,
`category-slug-leak` tsc **and** 4 HI render tests, `license-slug-leak` 1, `age-zero` 5,
`age-input-min` 2, `hidden-field-bounds` 3, `coverage-no-max` 4, `sitemap-drift` 1,
`footer-hardcoded-date` 1, `meta-undercount` 2, `readme-badge` 1, `readme-hawaii-pending` 1,
`faq-or-and` 1. Two were initially caught only by an "unused variable" tsc error; both were re-tested
with a realistic full revert (dropping the now-unused import too) and are caught by vitest on merit.

### Scope discipline for future guards

- Date guards compare against `LAST_REVIEWED`, **never the wall clock**. A test that reads the clock
  starts failing on its own with no code change, and that trains everyone to ignore it.
- The rendered-copy guard checks **only sentences the app composes**, not the whole page. Verbatim
  statutory quotes legitimately contain hyphenated compounds ("your motorized-bicycle policy must
  carry pedestrian PIP") that collide with the enum ids.

### RESOLVED 2026-08-11: Cloudflare Web Analytics was blocked by our own CSP

**myebikelaw.com had Web Analytics enabled since launch and collected zero.** The Cloudflare side was
right the whole time (the injected tag carries a real site token); this repo's CSP blocked the beacon,
and every visitor got a console CSP violation. Fixed in `public/_headers`.

⭐ **The trap to remember: Cloudflare injects the beacon for BROWSER requests only.** `curl` will never
show the tag; a real browser will. That is why it went unnoticed from launch.

What the beacon needs, read out of `beacon.min.js` itself:
- `script-src https://static.cloudflareinsights.com` (serves beacon.min.js)
- `connect-src https://cloudflareinsights.com` (the `/cdn-cgi/rum` fallback POST)
- On a **proxied** zone it prefers **same-origin** `/cdn-cgi/rum`, already covered by `'self'`.

Verified before shipping by serving the built `dist/` from a local server applying the exact new CSP
with the beacon injected the way the edge injects it: script loads, `__cfBeacon` defined, POST fires,
console clean.

⚠️ **Enabling analytics made two site claims false**, so they were rewritten: the form said "we never
store, share, or sell *anything*" (now "…sell *them*") and the README said "No data is collected".
A public FAQ answer now states both halves, sourced to Cloudflare's own wording. **The rider's answers
still never leave the browser; that promise is unchanged and is the one that matters.**

### Analytics across every Cloudflare property (audited 2026-08-11)

| Site | Served by | Proxied | Analytics | Collecting? |
|---|---|---|---|---|
| myebikelaw.com | CF Pages | yes | Cloudflare WA | **Fixed here.** Takes effect when PR #15 merges |
| isoride.app | CF Pages | yes | Cloudflare WA | ✅ working (POSTs to `/cdn-cgi/rum`) |
| somekidpaul.com | **Vercel** | **no** | **Vercel Analytics** | ✅ working (fires `/8aff503df5214e64/view`) |
| gamerstats.gg | **Vercel** | **no** | **Vercel Analytics** | ✅ working (`/_vercel/insights/view`) |
| astro-portfolio-eay.pages.dev | CF Pages | n/a | none | ❌ never enabled (retired preview, no custom domain) |

⛔ **somekidpaul.com and gamerstats.gg are DNS-only on Cloudflare (grey cloud) and served by Vercel.**
Cloudflare never sees their traffic, so CF Web Analytics *cannot* auto-inject there. They already run
Vercel Analytics instead. To pull them into the Cloudflare dashboard you would add CF's manual Web
Analytics snippet per site, which needs a site token created in the dashboard.

⚠️ The repo `.env` `CLOUDFLARE_API_TOKEN` can read Pages, zones and DNS but **not** Web Analytics
(`/rum/site_info/list` returns "Authentication error"), so tokens have to come from the dashboard.

### Also confirmed working (no action)

All 9 NJ and 9 HI verdict paths through the real UI; insurance boundaries exact ($15k/$30k/$5k
compliant, one dollar under → gaps); zero horizontal overflow at 320/375/768/1280; print stylesheet
and letterhead; FAQ JSON-LD 15 entries; legacy NJ share links and old `pi=` links still decode;
malformed params fall back to the splash rather than crashing; the throttle dropdown is a correctly
implemented ARIA combobox (Enter opens, arrows move, `aria-activedescendant` tracks, Enter commits);
apex and www both 200 with all six security headers.

## August 6-7, 2026 — PR #14 SHIPPED: the NJ insurance minimums were wrong

**The first real legal-accuracy bug the law-sync routine has caught in the NJ engine itself.** Merged to main as `cdeba55` on 2026-08-07, CI test + deploy both green, live-verified.

- **The bug:** the site told NJ riders a motorized bicycle needs **$35,000 / $70,000 / $25,000** of liability coverage. Correct answer is **$15,000 / $30,000 / $5,000**. It overstated the requirement by more than double, and a rider carrying exactly the legal minimum was told GAPS when they were COMPLIANT.
- **Where the old chain broke:** S4834 names no dollar figures. C.39:4-14.3e requires the policy and then expressly delegates the amounts ("The Commissioner of Insurance... shall by regulation fix the amounts and limits of coverage"). That regulation is **N.J.A.C. 11:3-11.1 "Required coverages for mopeds"**, which binds any policy on "a motorized bicycle as defined in N.J.S.A. 39:1-1", exactly S4834's insurance category. The site had instead applied the standard **AUTO** minimums (N.J.S.A. 39:6B-1, raised to $35k/$70k/$25k on 1/1/2026 by P.L.2022 c.87, DOBI Bulletin 25-06). That bulletin is addressed to auto insurers and never mentions mopeds or motorized bicycles.
- **Second correction, PIP:** the site said PIP is "not part of this policy." Wrong. **N.J.A.C. 11:3-11.1(b)** requires the policy to carry pedestrian PIP per N.J.S.A. 39:6A-4. `pip: null` STAYS in the engine, but for a different reason: the insurer supplies it at the statutory schedule, so there is no rider-side limit to compare. Null means "nothing for the rider to check," NOT "the policy has no PIP." This is distinct from S4834 s.4 / C.39:6A-4.8 (the rider's OWN auto policy, eff. 1/1/2027); both are now cited separately.
- **3 new regression tests pin the minimums to the regulation** so they cannot drift again. Two fixtures were only "below minimum" against the AUTO figures and silently went compliant; both re-based. The coverage-aggregation test was strengthened, because with the old values it passed without aggregating at all.
- **Copy fix found by checking the built artifact, not the source:** the FAQ said "This site quoted the auto figures **until August 3, 2026**." That date was the authoring date, not the publication date, so it was false every day the PR sat unmerged. Now reads "This site previously quoted the auto figures," true on any publication date. **Lesson: any self-correction copy that names a date is wrong until it ships. Don't date them.**
- **Verified live:** deployed bundle `index-JgC2sFV_.js` matches the locally built `dist/` exactly (1:1 proof the shipped bundle is the tested one). Live bundle carries `15000`/`30000` and **zero** `35000`/`70000`/`25000`; the two surviving "$35k / $70k / $25k" strings are the FAQ paragraph explaining the mix-up (body + JSON-LD copies). Footer "last reviewed August 6, 2026". Verified chips: Aug 6 x4 (CA/IL/MA/NY), Aug 3 x1 (FL), Jul 20 x2 (UT/WA). FAQPage JSON-LD 15 entries including the new insurance question.

**Same-day follow-up pass (`a642b09`, shipped and live-verified 8/7): Velosurance's page moved under us.**

- **Their NJ page was rewritten.** It now states the requirement as **$15,000 / $30,000 / $5,000**, matching N.J.A.C. 11:3-11.1 and our corrected engine. The "$100k option is S4834-sufficient" language and the "$25k to $500k" tier list are both **gone from the page**. Our card was quoting claims the source no longer makes, so it was rewritten. ⚠️ Note the irony worth remembering: earlier runs recorded Velosurance as "misstating" NJ's minimums as $15k/$30k/$5k. **They were right and we were wrong.** If a carrier's figures disagree with ours again, check the regulation before assuming they are the ones in error.
- Separately, Bicycle Retailer (2026-07-08) reports Velosurance **launched a New Jersey liability-only option** before the July 19 deadline, limits up to $500,000. That is now the card's lead.
- **VOOM still waitlist** (their page: "we will be launching soon", "Register to Our Waitlist"). Added a caution that VOOM's own NJ guide states the minimum as **$35,000 bodily injury**, the automobile figure. **Sundays unchanged**, re-confirmed verbatim: "We do not offer cyclist liability insurance."
- **MARKEL: flagged, deliberately NOT listed.** Their direct e-bike product does carry bicycle liability at **$25k to $300k with no stated state exclusion**, which is stronger evidence than "no NJ statement." But there is still no NJ-specific claim on their page, and **Markel underwrites Velosurance**, so trade-press reports that "Markel has NJ policies available" may simply be describing the Velosurance product. Listing it would risk double-counting one product as two carriers. Revisit when Markel says NJ on their own page. **Progressive** still "soon", still unlisted.
- Also re-verified with no change: **UT HB 381 read in full against the enrolled PDF** (every card claim confirmed 1:1, including `13-20-2(4)(b)(vi)` excluding an electric assisted bicycle from "motor vehicle", the >750W-or->20mph electric-motorcycle line, the VIN-less high-power-electric-device insurance carve-out, helmet under 21, the alcohol ban, and the May 6 2026 / May 5 2027 split effective dates); **WA ESSB 6110** confirmed Chapter 159 Laws of 2026, signed 3/23, effective 6/11, no later amending legislation; FL veto stands with no override; CA, IL, MA, NY all unmoved. njleg re-scan: still 10,712 bills, same 18 e-bike bills, **none with a governor action**.
- ⚠️ Minor known looseness, not fixed (it is in `details`, which is dead data): the UT card infers "no title, registration, license, or insurance" from `13-20-2`, but that section is the **New Motor Vehicle Warranties Act** definition. The substance is right, and it is carried by `41-6a-102(21)(b)` and `41-6a-1511`; the citation is just doing more work than it should.
- All 7 card `lastVerified` and all 3 carrier `lastVerified` now `2026-08-07`; footer August 7, 2026. Live-verified: bundle `index-8wvrxiyK.js` matches the local build exactly, 7 "Aug 7, 2026" chips, 10 `2026-08-07` strings in the bundle, `35000` count zero, stale carrier claims zero.

**Two environment gotchas from this run, both since cleared:**
- `~/Desktop` was unreadable to the Claude session (macOS TCC). Paths could be traversed but every file read returned `Operation not permitted`, so `git` and `npm` could not run at all (`git` fails on `getcwd()`). Workaround that saved the run: read repo files via `gh api repos/.../contents/<path>`, and **clone the branch into the scratchpad to run the real test/build pipeline outside the blocked directory**. The grant is System Settings → Privacy & Security, for `/Applications/Claude.app`.
- **GitHub Actions had a major outage on 8/6** (incident 15:22Z). Symptom to recognize: job queues ~15 min with `runner_name: ""` and zero steps, then shows `cancelled` while the run reads `failure`. That is not your branch. Note `deploy` is `needs: test` + `if: refs/heads/main` and Cloudflare Pages is direct-upload via `wrangler-action`, so **Actions is the only path to production** — during an Actions outage, merging publishes nothing.

## July 2, 2026 — HAWAII CHECKER (branch `hi-checker/2026-07-02`): phase 2 begins

The multi-state promise came due (HB 2021 becomes law by 7/15) — the engine is now genuinely multi-state. Built from the **CD1 text read directly from capitol.hawaii.gov** (curl 403s; a browser session got it).

- **Engine generalized, zero NJ behavior change** (the 97 pre-existing tests stayed green): `operatingAges` (age floors independent of licensing, with per-rule `reason` override — HI's is a supervision rule, not a ban), `operationBans` (terminal prohibited verdicts — HI's high-speed ban), `registration.rentalExemptionCategories` (replaces the hardcoded NJ low-speed check), `registration.authority` {name,url} (drives the remedy link; remedy kind renamed `register-with-mvc` → `register`). BikeCategory union gains `class-1/2/3` + `high-speed-electric`.
- **HI statute record** (`src/data/statutes/hi.ts`), all CD1-cited: $30 one-time county registration for every e-bike + operation ban if unregistered (§249-14(b), SECTION 5, **no grace period** — everything but retailer labeling is effective the day it's law, SECTION 22); **no license, no insurance (SECTION 1 says so explicitly)**; under-16 = supervision-only for Class 2/3 (§291C-143.5 — Class 1 has NO age rule; the "16+" headlines were wrong); helmets under 18; sidewalks ≤10 mph for all classes except business districts; "high-speed electric device" = **>750W AND >28 mph (conjunctive!)** banned from every public surface + seizable. TWO definitional gaps handled with conservative classificationNotes (single-threshold bikes; throttle 21–28 mph).
- **Statute-driven UI**: `STATUTES` registry (`src/data/statutes/index.ts`); Form hides insurance/license sections when a statute has none; Verdict takes a `statute` prop (authority-aware copy, jurisdiction-gated NJ callouts/calendar, generic "Not in effect yet" banner keyed to `enactedOn`); Splash has two live cards (HI card counts down to effectiveness client-side, same pattern as NJ). Share URLs: `st=hi` param — **legacy NJ links (no st) unchanged and verified**.
- **HI graduated** from pending-bills.ts → its own card + a "Hawaii · HB 2021" FAQ group (3 Q&As incl. how-to-register) + JSON-LD question. Meta descriptions updated. 114 tests (13 new HI paths + 4 share tests).
- ⚠️ **enactedOn: '2026-07-15' is the LATEST date** — if Green signs earlier the law is effective on signing and the site's countdown/banner would be wrong until updated. The law-sync routine now checks the bill status EVERY RUN and opens a time-critical PR if signed. When it becomes law: flip is automatic client-side; routine verifies on live.
- HI registration authority link in remedies points to HBL's how-to (covers all four counties); statute citations carry capitol.hawaii.gov. County pages (Honolulu CSD) still described pre-HB2021 rules as of 7/2 — FAQ says so.

## July 1, 2026 deadline-readiness pass (branch `deadline-readiness/2026-07-01`)

Full re-verification + feature pass 18 days before the NJ deadline. Key outcomes:

- **PIP CORRECTION (engine behavior change):** the motorized-bicycle policy under C.39:4-14.3e is **liability-only** (BI/death/PD). PIP is NOT part of the e-bike policy — S4834 §4 (C.39:6A-4.8) instead channels pedestrian PIP through the rider's own **auto** policy, effective Jan 1, 2027, covering bicycle + low-speed riders only (NOT motorized-bicycle riders). Engine minimums now `pip: null`; PIP input removed from the form (old share links with `pi=` still decode); citations rewritten. Verified against the enacted chapter law + the official statutes DB (compiled 7/1/26).
- **Penalties content added** (FAQ + JSON-LD), all primary-sourced: S4834 is nearly silent on operating penalties → moped-act fines apply (≤$100 unregistered via C.39:4-14.3t; ≤$200 and/or ≤15 days uninsured moped via C.39:4-14.3b; ~$50–$200 unlicensed; $50 dismissible carry offense via C.39:4-14.3(e)). 39:3-4 / 39:3-10 / 39:6B-2 do NOT reach LSEB/motorized bicycles (not "motor vehicles") but DO hit >750W/>28mph bikes (motorcycles). NO impoundment authority for LSEBs/mopeds; points unverified — **do not publish impoundment or points claims**.
- **Post-deadline mode** (verified in preview with a mocked clock): NJ card flips to "Deadline passed" + fees-waived-through-Jan-19-2027 copy; calendar buttons suppressed after July 19; deadline FAQ answers late compliance (allowed — grace clause s.11 defers obligations, fee waiver s.10 runs through 1/19/27, no statutory bar to registering late).
- **MVC is operational** (their page, fetched 7/1): registration by appointment, form BA-49EB; license = permit (BA-208) + road test **20–45 days later** → a license realistically extends past July 19 for anyone starting now. FAQ says so.
- **Carriers re-verified 7/1** (all three live pages): **Sundays' own FAQ says they do NOT offer cyclist liability** → new `complianceClaim: 'none'` + red "No liability coverage" badge; card reframed (theft/damage supplement, cannot satisfy S4834 alone; taxi benefit is accident-triggered, not theft). **Velosurance** NJ page rewritten (their pages now conflict on the state minimums — some cite the OLD $15k/$30k/$5k auto minimums; OURS are right per DOBI) → tier list replaced with $25k–$500k range + confirm-in-writing caveat. **VOOM still waitlist-only.** No new NJ entrants; watch Markel-direct + Progressive (OR/TX/WA only for now).
- **A2093/S3156 callout corrected** (was self-contradictory): registration is ALREADY required for low-speed under S4834 — insurance is the only exemption those bills would close. Added twin pair A3697/S2070 + new S4524 universal-helmet bill (introduced 6/26) to the FAQ. All parked in committee since 1/13.
- Small fixes: MVC link in the register remedy; header "How it works" nav now works from form/result phases (instant scroll — Chrome cancels smooth scrolls started mid-render).

**Two dates ahead:** July 15 — HI HB 2021 becomes law (splash "None passed yet" line goes stale; the promised HI checker comes due; do NOT auto-build). July 19 — NJ deadline (post-deadline UI is automatic; verify on live). Both are in the law-sync routine's milestone list.

## Important correctness notes

- **News coverage of S4834 is unreliable.** The Asbury Park Press (May 15, 2026) said low-speed e-bikes have "no requirements" — that's wrong. The statute (§5c, §6) requires registration AND a license for low-speed; only insurance (§5e) is motorized-only. The site reads the bill correctly and the FAQ addresses this.
- The Class 3 e-bike (pedal-assist 21–28 mph) is a real statutory gap in S4834. The site classifies it conservatively as `motorized` and shows the alternate `low-speed-electric` reading with a visible ambiguity note — do NOT silently pick one.
- VOOM is currently flagged `status: 'waitlist'` because they aren't writing NJ e-bike policies yet (despite earlier marketing). When that changes, edit `src/data/insurance/nj-carriers.ts`.
- The "last reviewed" date in the footer is **hardcoded** ("May 21, 2026", bumped from May 14 after the 2026-05-21 re-verification) — a manual editorial date (when the statutes were actually reviewed), NOT auto-"today". Only bump when the law is genuinely re-reviewed. Carrier "Last verified" dates also bumped to May 21 (all 3 carriers — Velosurance, Sundays, VOOM — re-verified 2026-05-21, claims confirmed).
- The countdown ("X days to comply") is **client-only** by design — never put it back into the server render or you'll ship stale day counts to crawlers.
- **NJ S4834 is verified correct against the ENACTED text** — `pub.njleg.gov/Bills/2024/S5000/4834_R1a.HTM` (the **R1a** reprint, NOT the earlier `R1`). Confirmed: act takes effect immediately on enactment (Jan 19, 2026) + six-month grace = **July 19, 2026** deadline; "electric motorized bicycle" (>750W and >28 mph) is folded into the *motorcycle* definition; low-speed = pedal-assist, cuts at 20 mph; the bill sets NO insurance dollar figures. ⚠️ **CORRECTED 2026-08-07:** this note used to say the figures were $35k/$70k/$25k from NJ's standard auto minimums / DOBI bulletin, "which the site cites correctly." **That was wrong.** 14.3e delegates the amounts to regulation, and the regulation is N.J.A.C. 11:3-11.1 at **$15k/$30k/$5k**. See the August 6-7 section above. Never re-apply the auto minimums (39:6B-1) to a motorized bicycle. ⚠️ A research agent that read the **R1** draft falsely "found" a wrong deadline, no motorcycle category, and moped insurance minimums — those were R1 language that did NOT survive into the enacted law. Always verify against R1a / P.L.2025 c.285, never an earlier reprint.
- `PendingStateBill.details` is **dead data** — not rendered anywhere (reserved for phase-2 per-state pages). Only `statusLabel`, `oneLiner`, `requirementHints`, `proposedEffectiveDate`, `sourceUrl`, `lastVerified` show on a card. Edits to `details` (e.g., the MA Joint-Committee fix) are data-accuracy only, NOT user-visible.
- Stalled bills use `status: 'held-in-committee'` and render with the neutral/gray treatment (Splash `isInformational` = empty `requirementHints` **OR** `held-in-committee`). CA AB 1942 is the current example.

## Open items / phase 2

- Per-state pages (`/nj`, `/ca`, etc.) — build when each state's bill actually becomes law. Thin per-state pages now would hurt SEO.
- LinkedIn post is drafted in chat; not yet shared. Standard move when posting: paste `https://myebikelaw.com` in body, wait for card to render, then delete the URL line — card stays.
- Optional: license the engine B2B (bike advocacy orgs, law firms). Insurance affiliate revenue is **not** an option — it would burn the neutrality moat for pennies.

## Local automation: daily law-sync (Claude Code scheduled task) — 2026-05-21

A local **Claude Code scheduled task** (`ebikelaw-law-sync`) runs the daily legal-sync. It's visible/manageable in Claude Code's **Scheduled sidebar** (local-tagged routines list); trigger with **Run now**.

- Stored at `~/.claude/scheduled-tasks/ebikelaw-law-sync/SKILL.md`; schedule `0 13 * * 1-5` (1pm local, weekdays + ~10min jitter). Runs while the app is open; catches up on next launch if it was closed.
- Re-verifies every tracked law vs PRIMARY sources + scans for new states. On REAL changes: runs tests/build, commits a `law-sync/<date>` branch, opens a DRAFT PR (never push main / never deploy). Otherwise reports "All laws in sync — no changes."
- Manage via the Scheduled sidebar or `mcp__scheduled-tasks__*` tools. First "Run now" pre-approves the tools (WebSearch/WebFetch/Bash) for future unattended runs.
- Earlier cloud-routine and macOS-launchd versions were both removed 2026-05-21 in favor of this one. Full details in the project memory file.

## Things NOT to do

- Don't add affiliate links to carrier listings (load-bearing for trust; explicit "no affiliate links" in hero + footer + carrier directory text)
- Don't switch to `hydrateRoot` for the prerender — the initial state is URL/time-dependent and hydration would mismatch
- Don't build thin per-state pages preemptively — wait until a state has a real law
- Don't cite `ebikelaw.app` — the domain is `myebikelaw.com`
