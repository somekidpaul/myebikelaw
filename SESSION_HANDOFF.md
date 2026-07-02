# MyEBikeLaw — Session Handoff

Reference doc for picking up in a new Claude Code session without losing context. Persistent project memory lives at `~/.claude/projects/-Users-paul-Desktop/memory/project_ebikelaw.md` — read that first; this file is the commit-level log.

## Where the site stands

- **Live:** [myebikelaw.com](https://myebikelaw.com) (Cloudflare Pages, custom domain)
- **Repo:** `github.com/somekidpaul/myebikelaw` (private)
- **Auto-deploy:** every push to `main` → CI runs tests → if green, `cloudflare/wrangler-action@v3` ships `dist/`
- **Status:** shipped, polished, every path empirically verified through the form on the live URL
- **Tests:** 91 / 91 passing (Vitest)
- **LinkedIn:** launch post PUBLISHED 2026-05-21 (meniscus origin + all 6 state statuses incl. CA "stalled in committee" + "91 test scenarios")

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
- **NJ S4834 is verified correct against the ENACTED text** — `pub.njleg.gov/Bills/2024/S5000/4834_R1a.HTM` (the **R1a** reprint, NOT the earlier `R1`). Confirmed: act takes effect immediately on enactment (Jan 19, 2026) + six-month grace = **July 19, 2026** deadline; "electric motorized bicycle" (>750W and >28 mph) is folded into the *motorcycle* definition; low-speed = pedal-assist, cuts at 20 mph; the bill sets NO insurance dollar figures (the $35k/$70k/$25k come from NJ's standard auto minimums / DOBI bulletin, which the site cites correctly). ⚠️ A research agent that read the **R1** draft falsely "found" a wrong deadline, no motorcycle category, and moped insurance minimums — those were R1 language that did NOT survive into the enacted law. Always verify against R1a / P.L.2025 c.285, never an earlier reprint.
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
