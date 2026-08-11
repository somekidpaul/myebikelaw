# MyEBikeLaw — Session Handoff

Reference doc for picking up in a new Claude Code session without losing context. Persistent project memory lives at `~/.claude/projects/-Users-paul-Desktop/memory/project_ebikelaw.md` — read that first; this file is the commit-level log.

## Where the site stands

- **Live:** [myebikelaw.com](https://myebikelaw.com) (Cloudflare Pages, custom domain)
- **Repo:** `github.com/somekidpaul/myebikelaw` — **PUBLIC**. (Older notes here and in project
  memory said private; `gh repo view` reports `visibility=PUBLIC`.) The README is therefore a public
  artifact on a portfolio piece. Keep it true.
- **Auto-deploy:** every push to `main` → CI runs tests → if green, `cloudflare/wrangler-action@v3` ships `dist/`
- **Status:** shipped, polished, every path empirically verified through the form on the live URL
- **Tests:** 268 / 268 passing (Vitest) — engine, share round-trip, form logic, form inputs,
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

### Open, needs Paul's call: Cloudflare Web Analytics is dead on the live site

Cloudflare Pages injects its beacon (`static.cloudflareinsights.com/beacon.min.js`) into the served
HTML at the edge. Our CSP in `public/_headers` is `script-src 'self' 'unsafe-inline'`, which
**blocks it**. So no analytics are collected, and every real visitor gets a CSP error in console. Not
caused by anything in the repo (the tag is not in `dist/index.html`; it is injected for browser
requests only, so `curl` will not show it and a real browser will). The `_headers` comment says the
"no analytics" stance is deliberate, so:
1. **Turn the beacon off** in the Cloudflare dashboard (Web Analytics → this site). Keeps CSP tight.
2. Or allow `https://static.cloudflareinsights.com` in `script-src` **and** `connect-src`.

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
