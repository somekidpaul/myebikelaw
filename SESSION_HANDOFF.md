# MyEBikeLaw — Session Handoff

Reference doc for picking up in a new Claude Code session without losing context. Persistent project memory lives at `~/.claude/projects/-Users-paul-Desktop/memory/project_ebikelaw.md` — read that first; this file is the commit-level log.

## Where the site stands

- **Live:** [myebikelaw.com](https://myebikelaw.com) (Cloudflare Pages, custom domain)
- **Repo:** `github.com/somekidpaul/myebikelaw` (private)
- **Auto-deploy:** every push to `main` → CI runs tests → if green, `cloudflare/wrangler-action@v3` ships `dist/`
- **Status:** shipped, polished, every path empirically verified through the form on the live URL
- **Tests:** 91 / 91 passing (Vitest)
- **LinkedIn:** post drafted in chat history; not yet posted

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

## Important correctness notes

- **News coverage of S4834 is unreliable.** The Asbury Park Press (May 15, 2026) said low-speed e-bikes have "no requirements" — that's wrong. The statute (§5c, §6) requires registration AND a license for low-speed; only insurance (§5e) is motorized-only. The site reads the bill correctly and the FAQ addresses this.
- The Class 3 e-bike (pedal-assist 21–28 mph) is a real statutory gap in S4834. The site classifies it conservatively as `motorized` and shows the alternate `low-speed-electric` reading with a visible ambiguity note — do NOT silently pick one.
- VOOM is currently flagged `status: 'waitlist'` because they aren't writing NJ e-bike policies yet (despite earlier marketing). When that changes, edit `src/data/insurance/nj-carriers.ts`.
- The "last reviewed" date in the footer is **hardcoded** ("May 14, 2026") — by design, not a bug.
- The countdown ("X days to comply") is **client-only** by design — never put it back into the server render or you'll ship stale day counts to crawlers.

## Open items / phase 2

- Per-state pages (`/nj`, `/ca`, etc.) — build when each state's bill actually becomes law. Thin per-state pages now would hurt SEO.
- LinkedIn post is drafted in chat; not yet shared. Standard move when posting: paste `https://myebikelaw.com` in body, wait for card to render, then delete the URL line — card stays.
- Optional: license the engine B2B (bike advocacy orgs, law firms). Insurance affiliate revenue is **not** an option — it would burn the neutrality moat for pennies.

## Things NOT to do

- Don't add affiliate links to carrier listings (load-bearing for trust; explicit "no affiliate links" in hero + footer + carrier directory text)
- Don't switch to `hydrateRoot` for the prerender — the initial state is URL/time-dependent and hydration would mismatch
- Don't build thin per-state pages preemptively — wait until a state has a real law
- Don't cite `ebikelaw.app` — the domain is `myebikelaw.com`
