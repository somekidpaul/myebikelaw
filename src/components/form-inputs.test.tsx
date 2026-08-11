/**
 * FORM INPUT-ATTRIBUTE GUARD
 *
 * validateFormState() is the real gate, but the `min`/`max` attributes are what
 * the BROWSER enforces, and they are what a rider bumps into while typing. They
 * were hand-written numbers that drifted from the decoder's schema: the age
 * input said min=0 while the decoder required >= 1.
 *
 * This renders the actual Form for both statutes and reads the attributes off
 * the emitted HTML, so the numbers a browser sees and the numbers FORM_BOUNDS
 * declares cannot diverge.
 */
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { Form } from './Form'
import { FORM_BOUNDS } from '../lib/field-bounds'
import { STATUTES } from '../data/statutes'
import type { StatutoryRequirement } from '../types'

function renderForm(statute: StatutoryRequirement): string {
  return renderToStaticMarkup(<Form statute={statute} onSubmit={() => {}} />)
}

/** Every <input type="number"> with its min/max, in document order. */
function numberInputs(html: string): Array<{ min: string | null; max: string | null; placeholder: string | null }> {
  return [...html.matchAll(/<input\b[^>]*type="number"[^>]*>/g)].map((m) => {
    const tag = m[0]
    const attr = (name: string) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] ?? null
    return { min: attr('min'), max: attr('max'), placeholder: attr('placeholder') }
  })
}

describe('form number inputs are bounded by FORM_BOUNDS', () => {
  for (const [code, statute] of Object.entries(STATUTES)) {
    const html = renderForm(statute)
    const inputs = numberInputs(html)

    it(`${code}: every number input declares both a min and a max`, () => {
      expect(inputs.length).toBeGreaterThan(0)
      for (const i of inputs) {
        expect(i.min, `an input has no min: ${JSON.stringify(i)}`).not.toBeNull()
        expect(i.max, `an input has no max: ${JSON.stringify(i)}`).not.toBeNull()
      }
    })

    it(`${code}: the age input matches FORM_BOUNDS.age`, () => {
      // Identified by its placeholder so this does not depend on field order.
      const age = inputs.find((i) => i.placeholder === '35')
      expect(age, 'no age input found (placeholder "35")').toBeDefined()
      expect(age?.min).toBe(String(FORM_BOUNDS.age.min))
      expect(age?.max).toBe(String(FORM_BOUNDS.age.max))
    })

    it(`${code}: every declared bound is one of the FORM_BOUNDS values`, () => {
      const allowedMins = new Set(Object.values(FORM_BOUNDS).map((b) => String(b.min)))
      const allowedMaxes = new Set(Object.values(FORM_BOUNDS).map((b) => String(b.max)))
      for (const i of inputs) {
        expect(allowedMins, `min="${i.min}" is not a FORM_BOUNDS min`).toContain(i.min)
        expect(allowedMaxes, `max="${i.max}" is not a FORM_BOUNDS max`).toContain(i.max)
      }
    })
  }

  it('the statute drives which questions appear', () => {
    // NJ asks about license and insurance; HI asks neither. If this inverts,
    // the form is showing a rider requirements their state does not have.
    const nj = renderForm(STATUTES.NJ)
    const hi = renderForm(STATUTES.HI)
    expect(nj).toMatch(/Your license/)
    expect(hi).not.toMatch(/Your license/)
    expect(nj).toMatch(/insurance|policy/i)
    expect(hi).not.toMatch(/Bodily injury/)
  })

  it('the registered-with checkbox names the right authority per statute', () => {
    for (const [, statute] of Object.entries(STATUTES)) {
      // Unescape first: renderToStaticMarkup emits &#x27; for the apostrophe
      // in "your county's director of finance".
      const text = renderForm(statute)
        .replace(/<[^>]+>/g, ' ')
        .replace(/&#x27;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/\s+/g, ' ')
      const name = statute.registration.authority.name
      expect(text).toContain(`already registered with ${name}`)
      // The same doubled-article failure as the verdict copy, one layer up.
      expect(text).not.toMatch(/\b(the|your|a|an) (the|your|a|an)\b/i)
    }
  })
})
