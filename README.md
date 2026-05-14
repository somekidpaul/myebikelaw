# MyEBikeLaw

![CI](https://github.com/somekidpaul/ebikelaw/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6.svg)

A neutral compliance checker for New Jersey's e-bike law (**S4834 / P.L.2025, c.285**, effective Jan 19, 2026 — compliance deadline July 19, 2026).

Cycling-insurance carriers all want to sell you a policy. The NJ MVC has a static info page. Every blog says "you need insurance now" — but the statute is more nuanced than that. This tool reads the actual bill, checks your specific situation against it, and tells you what (if anything) you need to do.

It will not try to sell you a policy.

## Why it exists

The bill defines **three** categories of e-bike, not one. Each category has different rules:

| Category | License | Registration | Insurance |
|---|---|---|---|
| Low-speed electric bicycle (pedal-assist ≤20 mph) | ✅ | ✅ | ❌ **not required** |
| Motorized bicycle (throttle, or 21–28 mph) | ✅ | ✅ | ✅ |
| Electric motorized bicycle (>750W or >28 mph) | — reclassified as **motorcycle** — |

Blog headlines lumping all e-bikes together as "needs insurance" are wrong, and that gap was the moat for this tool.

## What it does

1. Asks the rider 6 questions about their bike + age + license + existing coverage
2. Classifies the bike under the statute's three categories
3. Runs a typed compliance engine against the matching rules
4. Returns a verdict: **compliant**, **gaps** (with specific shortfalls), **prohibited** (under-15 operator), **reclassified** (now a motorcycle), or **not-applicable**
5. For motorized-bicycle riders with an insurance gap, surfaces a non-affiliate carrier directory with a "last verified" stamp
6. Surfaces statutory ambiguity (e.g., Class 3 e-bikes) instead of silently picking a side

Every claim links back to the cited statute or official NJ government source.

## Architecture

The engine is the portfolio piece. Single-page React app on top, but the interesting code is in `src/types/`, `src/data/`, and `src/engine/`.

### Typed rules engine

- **Branded types** (`USD`, `MPH`, `Watts`, `Years`) prevent unit confusion at compile time
- **Discriminated unions** for question types, policy kinds, gap kinds, and the four compliance outcomes (each with exhaustive switch handling)
- **Effective-dated statutes** — `StatutoryRequirement` records carry their own effective and deadline dates so amendments are a data update, not a code change
- **Category-aware requirements** — `insurance.appliesToCategories`, `registration.appliesToCategories`, and `licensing.appliesToCategories` are per-category, not blanket booleans
- **Reclassification rules** — `reclassifications` array routes electric-motorized bikes out of the motorized-bicycle path and into a dedicated motorcycle status
- **Classification ambiguity** surfaced explicitly — `classificationNote` returns a structured record when the bike falls in a statutory gap (Class 3) so the user sees both readings instead of silent defaults

### Pure functions, fully unit-tested

```ts
function checkCompliance(input: ComplianceInput): Compliance
```

Pure function in `src/engine/compliance.ts`. 28 Vitest cases cover every bike category × every operator path × every policy kind × every gap shape × the ambiguity flagging.

### Multi-state ready

The engine is jurisdiction-keyed from day one. Adding California's AB 1942, Hawaii's pending registration bill, or Florida's SB 382 would be a data PR — drop in a new `StatutoryRequirement`, add the corresponding route, no engine changes.

### Static carrier directory

`src/data/insurance/nj-carriers.ts` is a typed dataset of NJ-compliant insurance carriers. Each entry is honest about what's published (some are quote-only, some have starting prices) and carries a `lastVerified` ISO date. No affiliate codes.

## Stack

- **Vite 8** + **React 19** + **TypeScript 6** in strict mode (`strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`)
- **Tailwind v4** via `@tailwindcss/vite` + a small `@theme` token block for the dark-warm palette
- **Zod** available for runtime schema validation at boundaries
- **Vitest** for the engine test suite
- **Oswald** + **Inter** typography (Google Fonts)

## Run

```sh
npm install
npm run dev       # localhost:5174
npm test          # 28 cases
npm run build     # production bundle
```

## Project layout

```
src/
├── types/                  Branded types + discriminated unions
│   ├── brands.ts           USD, MPH, Watts, Years
│   ├── coverage.ts         Coverage shape + axis enum
│   ├── bike.ts             BikeCategory + BikeProfile
│   ├── operator.ts         OperatorProfile + license kinds
│   ├── policy.ts           ExistingPolicy discriminated union
│   ├── statute.ts          StatutoryRequirement + ClassificationNote
│   ├── compliance.ts       Compliance verdict union (5 statuses)
│   └── carrier.ts          CarrierEntry for the directory
├── data/
│   ├── statutes/nj.ts      S4834 encoded as data, with citations
│   └── insurance/nj-carriers.ts
├── engine/
│   ├── compliance.ts       Pure checkCompliance() function
│   └── compliance.test.ts  Vitest suite (28 cases)
└── components/             React UI on top
    ├── Form.tsx
    ├── Verdict.tsx
    ├── CarrierDirectory.tsx
    ├── ErrorBoundary.tsx
    └── Faq.tsx
```

## Disclaimers

MyEBikeLaw.com is an **informational tool**, not a law firm or insurance broker. It does not provide legal or insurance advice. The output reflects a good-faith reading of the cited statutes; verify all details with your insurance agent and [the NJ MVC](https://www.nj.gov/mvc/vehicletopics/ebike.htm) before relying on it.

No affiliate links. No referral fees. No data is collected; answers stay in the browser.

## License

MIT.
