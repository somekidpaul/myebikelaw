/**
 * DUPLICATED-FACT GUARD
 *
 * Several facts live in more than one file and have to agree. Nothing was
 * keeping them in sync, so they drifted:
 *
 *   - public/sitemap.xml said the page last changed 2026-07-09 while the
 *     footer said August 2026, after three shipped releases in between.
 *   - index.html's meta and og descriptions named five tracked states while
 *     the grid rendered seven, so every social share undercounted the product.
 *   - The README's CI badge pointed at github.com/somekidpaul/ebikelaw, which
 *     404s. The repo is myebikelaw.
 *
 * These read the real files off disk rather than importing constants, because
 * the whole failure mode is a copy that lives outside the type system.
 */
import { describe, expect, it } from 'vitest'
import { LAST_REVIEWED, formatLastReviewed } from './site-meta'
import { PENDING_STATE_BILLS } from './pending-bills'
import { NJ_CARRIERS } from './insurance/nj-carriers'
import { STATUTES } from './statutes'

// Loaded through Vite's ?raw so this stays inside the app's tsconfig (no node
// types, no __dirname) while still asserting on the real file contents.
import appSource from '../App.tsx?raw'
import indexHtml from '../../index.html?raw'
import readmeSource from '../../README.md?raw'
import sitemapSource from '../../public/sitemap.xml?raw'
import faqSource from '../components/Faq.tsx?raw'
import headersSource from '../../public/_headers?raw'

const FILES: Record<string, string> = {
  'src/App.tsx': appSource,
  'index.html': indexHtml,
  'README.md': readmeSource,
  'public/sitemap.xml': sitemapSource,
  'src/components/Faq.tsx': faqSource,
  'public/_headers': headersSource,
}
const read = (p: string): string => {
  const f = FILES[p]
  if (f === undefined) throw new Error(`site-consistency: no raw import registered for ${p}`)
  return f
}

const ISO = /^\d{4}-\d{2}-\d{2}$/

describe('the review date has one source of truth', () => {
  it('LAST_REVIEWED is a real ISO date', () => {
    expect(LAST_REVIEWED).toMatch(ISO)
    expect(Number.isNaN(Date.parse(`${LAST_REVIEWED}T00:00:00Z`))).toBe(false)
  })

  it('the footer renders it rather than hardcoding a second copy', () => {
    const app = read('src/App.tsx')
    expect(app).toContain('formatLastReviewed()')
    // A literal "Month D, YYYY" next to "last reviewed" means someone typed the
    // date in again instead of using the constant.
    expect(app).not.toMatch(/last reviewed[\s\S]{0,120}?[A-Z][a-z]+ \d{1,2}, \d{4}/)
  })

  it('the sitemap source carries the same date', () => {
    const lastmod = read('public/sitemap.xml').match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]
    expect(lastmod, 'no <lastmod> in public/sitemap.xml').toBeDefined()
    expect(lastmod).toBe(LAST_REVIEWED)
  })

  it('formats without shifting a day across timezones', () => {
    expect(formatLastReviewed('2026-01-01')).toBe('January 1, 2026')
    expect(formatLastReviewed('2026-12-31')).toBe('December 31, 2026')
  })
})

describe('verification dates are real and not in the future', () => {
  // Compared against LAST_REVIEWED, not the wall clock: a test that reads the
  // clock would start failing on its own with no code change.
  for (const bill of PENDING_STATE_BILLS) {
    it(`${bill.state} card lastVerified`, () => {
      expect(bill.lastVerified).toMatch(ISO)
      expect(bill.lastVerified <= LAST_REVIEWED).toBe(true)
    })
  }
  for (const carrier of NJ_CARRIERS) {
    it(`${carrier.id} lastVerified`, () => {
      expect(carrier.source.lastVerified).toMatch(ISO)
      expect(carrier.source.lastVerified <= LAST_REVIEWED).toBe(true)
    })
  }

  // VOOM's card says "still pre-launch in NJ as of <date>" in prose while its
  // real re-check date lives in source.lastVerified. That is the same
  // one-fact-in-two-places shape as the sitemap/footer drift: on 2026-08-17 the
  // prose still read August 10 after the carrier had been re-checked, so the
  // card asserted a staleness it no longer had. Any carrier that dates itself
  // in copy has to date itself the day it was actually verified.
  for (const carrier of NJ_CARRIERS) {
    const dated = carrier.oneLiner.match(/as of ([A-Z][a-z]+ \d{1,2}, \d{4})/)
    if (dated === null) continue
    it(`${carrier.id} oneLiner's "as of" date matches its lastVerified`, () => {
      expect(dated[1]).toBe(formatLastReviewed(carrier.source.lastVerified))
    })
  }
})

describe('index.html describes the product the app actually ships', () => {
  const html = read('index.html')
  const descriptions = [...html.matchAll(/(?:name="description"|property="og:description")\s*\n?\s*content="([^"]+)"/g)]
    .map((m) => m[1] ?? '')

  it('has both description tags', () => {
    expect(descriptions).toHaveLength(2)
  })

  for (const bill of PENDING_STATE_BILLS) {
    it(`names ${bill.state} as tracked`, () => {
      for (const d of descriptions) {
        expect(d, `"${bill.state}" missing from: ${d}`).toContain(bill.state)
      }
    })
  }

  for (const code of Object.keys(STATUTES)) {
    const name = code === 'NJ' ? 'New Jersey' : 'Hawaii'
    it(`names ${name} as a live checker`, () => {
      for (const d of descriptions) expect(d).toContain(name)
    })
  }
})

describe('README points at the real repo', () => {
  const readme = read('README.md')

  it('the CI badge uses the correct repo slug', () => {
    const badge = readme.match(/!\[CI\]\((https:\/\/github\.com\/[^)]+)\)/)?.[1]
    expect(badge, 'no CI badge found').toBeDefined()
    expect(badge).toContain('/somekidpaul/myebikelaw/')
  })

  it('does not quote a test count that will go stale', () => {
    expect(readme).not.toMatch(/\b\d+\s+(?:Vitest\s+)?cases\b/)
  })

  it('does not describe Hawaii as pending', () => {
    expect(readme).not.toMatch(/Hawaii's pending/i)
  })
})

describe('the conjunctive threshold is never stated as a disjunction', () => {
  // S4834 defines an "electric motorized bicycle" as >750 W AND >28 mph. The
  // site said "or" in two places while saying "and" in a third, which is the
  // difference between settled law and this tool's conservative routing.
  const sources = ['src/components/Faq.tsx', 'README.md', 'index.html']

  for (const file of sources) {
    it(`${file} does not say "750 W or 28 mph"`, () => {
      const text = read(file).replace(/\s+/g, ' ')
      expect(text).not.toMatch(/750\s*W?\s*or\s*(?:more than\s*)?28\s*mph/i)
      expect(text).not.toMatch(/over 750W? or 28 mph/i)
    })
  }
})

describe('the CSP does not block Cloudflare Web Analytics', () => {
  // Cloudflare Pages injects its beacon at the edge, for browser requests only.
  // A CSP of script-src 'self' blocked it silently from launch until 2026-08-10:
  // zero analytics collected, and a console error for every visitor. curl never
  // shows the tag, so nothing but a real browser or this test catches it.
  const headers = read('public/_headers')
  const csp = headers.match(/Content-Security-Policy:\s*([^\n]+)/)?.[1] ?? ''

  const directive = (name: string): string => {
    const m = csp.match(new RegExp(`(?:^|;)\\s*${name}\\s+([^;]+)`))
    return (m?.[1] ?? '').trim()
  }

  it('has a CSP to check', () => {
    expect(csp, 'no Content-Security-Policy in public/_headers').not.toBe('')
  })

  it('script-src allows the beacon host', () => {
    // beacon.min.js is served from here. Verified by reading the script itself.
    expect(directive('script-src')).toContain('https://static.cloudflareinsights.com')
  })

  it('connect-src allows the RUM endpoint', () => {
    // On a proxied zone the beacon POSTs to same-origin /cdn-cgi/rum ('self'
    // covers that); this is the documented cross-origin fallback it hardcodes.
    const connect = directive('connect-src')
    expect(connect).toContain("'self'")
    expect(connect).toContain('https://cloudflareinsights.com')
  })

  it('still locks down everything else', () => {
    // Allowing analytics must not become a general loosening.
    expect(directive('default-src')).toBe("'self'")
    expect(directive('object-src')).toBe("'none'")
    expect(directive('frame-ancestors')).toBe("'none'")
    expect(directive('base-uri')).toBe("'self'")
    expect(csp).not.toContain('*')
  })
})

describe('privacy copy stays true now that analytics is on', () => {
  it('does not claim nothing at all is collected', () => {
    // "We never store, share, or sell anything" and "No data is collected"
    // both became false the moment the beacon was unblocked. The promise that
    // survives, and the one that matters, is about the rider's ANSWERS.
    const app = read('src/App.tsx')
    expect(app).not.toMatch(/never store, share, or sell anything/i)
    expect(read('README.md')).not.toMatch(/No data is collected/i)
  })

  it('the site discloses the analytics somewhere a visitor can read it', () => {
    expect(read('src/components/Faq.tsx')).toMatch(/Cloudflare Web Analytics/)
  })
})
