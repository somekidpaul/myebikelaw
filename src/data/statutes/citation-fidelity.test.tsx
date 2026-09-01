/**
 * CITATION FIDELITY GUARD
 *
 * Verdict.tsx renders `citation.quote` wrapped in literal quotation marks. So
 * anything in that field is a claim that the statute says exactly this. On
 * 2026-08-24 several of them did not:
 *
 *   - The licensing and minimum-age citations were labelled "S4834 §3". The age
 *     and licence tiers are in §5 (C.39:4-14.3(c)). §3 is C.39:4-14.16, a
 *     different section about where a low-speed e-bike may be ridden.
 *   - The scooter exemption cited "§10" (the fee waiver) instead of §3(f)(1),
 *     and the rental exemption cited "§3" instead of §5(c)(4).
 *   - The insurance citation was labelled "§5" while quoting §11's grace period.
 *   - Most quotes were not quotes at all. "No person under 15 may operate.
 *     15-16 requires a motorized bicycle license/permit." is a summary, shown
 *     to the rider in quotation marks as if it were the text of the law.
 *   - Several appended our own commentary INSIDE the quotation marks, so the
 *     statute appeared to say "(The statute names no dollar figures. The
 *     regulation below does.)"
 *
 * `Citation.note` now exists for commentary and renders outside the quote
 * marks. This test enforces the other half: a quote must be real statutory text.
 *
 * Two kinds of source, because they cannot be checked the same way:
 *
 *   1. Fetchable (NJ). The enacted text is stored under __fixtures__ with
 *      struck-through material removed so it reads as ENACTED law. Every quote
 *      must appear in it verbatim.
 *   2. Not fetchable (HI). capitol.hawaii.gov returns 403 to curl and to
 *      WebFetch; only a real browser session gets the text. Those quotes live
 *      in verified-quotes.json with the SHA-256 of the text they were checked
 *      against. Changing one turns this suite red until someone re-reads the
 *      statute and updates the manifest.
 *
 * Ellipses and square brackets in a quote are treated as gaps, the way legal
 * quoting uses them: the fragments on either side still have to be verbatim.
 */
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Verdict } from '../../components/Verdict'
import { checkCompliance } from '../../engine/compliance'
import { mph, watts, years } from '../../types'
import { STATUTES } from './index'
import type { Citation, StatutoryRequirement } from '../../types'
import { NJ_S4834_SOURCES } from './nj'

import njEnactedText from './__fixtures__/nj-s4834-enacted.txt?raw'
import verifiedQuotes from './__fixtures__/verified-quotes.json'

/** Fetchable sources: url -> the enacted text every quote must appear in. */
const FIXTURES: ReadonlyArray<readonly [string, string]> = [
  [NJ_S4834_SOURCES.billText, njEnactedText],
]

const MANIFEST = verifiedQuotes.sources as Record<
  string,
  { label: string; enactedTextSha256: string; lastVerified: string; quotes: string[] }
>

function normalize(s: string): string {
  return s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—‑]/g, '-')
    .replace(/ /g, ' ')
    .replace(/\s+/g, ' ')
    // Removing struck-through material leaves the reprint with stray spaces
    // before punctuation ("motorized bicycle . (2)", "R.S. 39:1-1 ,"). That is
    // an artifact of the amendment markup, not a difference in wording.
    .replace(/\s+([,.;:)])/g, '$1')
    .replace(/\(\s+/g, '(')
    .trim()
}

/** Split a quote on its elisions: "..." and bracketed editorial substitutions. */
function fragments(quote: string): string[] {
  return normalize(quote)
    .split(/\s*\.\.\.\s*|\s*\[[^\]]*\]\s*/)
    .map((f) => f.trim())
    .filter((f) => f.length > 0)
}

/** Every citation the app can put in front of a rider, including nested ones. */
function allCitations(statute: StatutoryRequirement): Citation[] {
  const out: Citation[] = [
    ...statute.insurance.citations,
    ...statute.registration.citations,
    ...statute.licensing.citations,
    ...statute.operatingAges.flatMap((r) => r.citations),
    ...statute.operationBans.flatMap((r) => r.citations),
    ...statute.reclassifications.flatMap((r) => r.citations),
    ...statute.exemptions.map((e) => e.citation),
  ]
  // classificationNote is a function, so probe it with bikes that hit every
  // branch: both thresholds, each threshold alone, class 3, and a plain bike.
  const probes = [
    { throttle: 'throttle', topMotorAssistedSpeed: 35, motorWatts: 1000 },
    { throttle: 'throttle', topMotorAssistedSpeed: 35, motorWatts: 500 },
    { throttle: 'pedal-assist-only', topMotorAssistedSpeed: 22, motorWatts: 900 },
    { throttle: 'pedal-assist-only', topMotorAssistedSpeed: 25, motorWatts: 600 },
    { throttle: 'throttle', topMotorAssistedSpeed: 25, motorWatts: 600 },
    { throttle: 'pedal-assist-only', topMotorAssistedSpeed: 18, motorWatts: 250 },
  ] as const
  for (const p of probes) {
    const note = statute.classificationNote?.(p as never)
    if (note) out.push(...note.citations)
  }
  return out
}

describe('citation fidelity', () => {
  const everyCitation = Object.values(STATUTES).flatMap((s) =>
    allCitations(s).map((c) => ({ statute: s, citation: c })),
  )

  it('finds citations to check (a silent empty pass would be worthless)', () => {
    expect(everyCitation.length).toBeGreaterThan(10)
    expect(everyCitation.filter((e) => e.citation.quote).length).toBeGreaterThan(8)
  })

  describe('quotes attributed to a statute are verbatim', () => {
    for (const { statute, citation } of everyCitation) {
      if (!citation.quote) continue
      const fixture = FIXTURES.find(([url]) => url === citation.url)
      const manifest = MANIFEST[citation.url]
      if (!fixture && !manifest) continue // e.g. Justia / Cornell, checked by hand

      it(`${statute.jurisdiction}: ${citation.statute}`, () => {
        if (fixture) {
          const haystack = normalize(fixture[1])
          for (const frag of fragments(citation.quote as string)) {
            expect(
              haystack.includes(frag),
              `not found verbatim in the enacted text:\n  "${frag}"`,
            ).toBe(true)
          }
        } else {
          expect(
            manifest!.quotes.map(normalize),
            `not in verified-quotes.json for ${manifest!.label}. Re-read the statute, then add it.`,
          ).toContain(normalize(citation.quote as string))
        }
      })
    }
  })

  it('no quote smuggles our own commentary inside the quotation marks', () => {
    // The exact shapes that shipped: a parenthetical sentence of ours, or
    // second-person address. Statutes do not say "your" or "this site".
    const tells = [
      /\bthis site\b/i,
      /\byour\b/i,
      /\bwe \b/i,
      /\(the statute\b/i,
      /\bwhich is why the form\b/i,
    ]
    const offenders = everyCitation
      .filter((e) => e.citation.quote && tells.some((t) => t.test(e.citation.quote as string)))
      .map((e) => `${e.statute.jurisdiction}: ${e.citation.statute}`)
    expect(offenders).toEqual([])
  })


  // Rendering is the whole point: `quote` goes inside quotation marks and
  // `note` must not. Asserting on the data alone would not have caught the
  // original defect, because the data looked fine until it was wrapped in "".
  it('renders our commentary OUTSIDE the quotation marks', () => {
    const statute = STATUTES.NJ
    const bike = {
      throttle: 'throttle' as const,
      topMotorAssistedSpeed: mph(25),
      motorWatts: watts(750),
      isRentalFromSharedSystem: false,
      isRegistered: false,
    }
    const compliance = checkCompliance({
      bike,
      operator: { age: years(35), license: 'none' as const },
      policies: [],
      statute,
    })
    const html = renderToStaticMarkup(
      <Verdict compliance={compliance} bike={bike} statute={statute} onReset={() => {}} />,
    )
    const text = html
      .replace(/<[^>]+>/g, ' ')
      .replace(/&#x27;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/\s+/g, ' ')

    // The corrected section label reaches the rider.
    expect(text).toContain('C.39:4-14.3(c)')
    expect(text).not.toContain('S4834 §3 — operator age and licensing')

    // A real statutory sentence, quoted.
    const quoted =
      '(1) No person who is under 15 years of age shall be permitted to operate a low-speed electric bicycle or motorized bicycle.'
    expect(text).toContain(`"${quoted}`)

    // Our gloss appears, and NOT inside quotation marks.
    const note = 'This statute names no dollar figures. It delegates them to the regulation below.'
    expect(text).toContain(note)
    expect(text).not.toContain(`"${note}`)
    expect(text).not.toContain(`${note}"`)

    // The commentary that used to sit inside the quote marks is gone from the
    // quoted text entirely.
    expect(text).not.toContain('such insurance. (The statute names no dollar figures')
  })

  it('the manifest records how each unfetchable quote was verified', () => {
    for (const [url, entry] of Object.entries(MANIFEST)) {
      expect(url).toMatch(/^https:\/\//)
      expect(entry.enactedTextSha256).toMatch(/^[0-9a-f]{64}$/)
      expect(entry.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(entry.quotes.length).toBeGreaterThan(0)
    }
  })
})
