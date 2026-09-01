/**
 * The bounds the FORM is allowed to produce.
 *
 * Why this exists: the app encodes the rider's answers into a share URL
 * (encodeAnswers) and decodes them back through a Zod schema (decodeAnswers).
 * If the form can produce a value the decoder rejects, the app hands the rider
 * a "Copy share link" button that yields a dead link — it opens the splash
 * instead of their result. That shipped twice:
 *
 *   - Age accepted 0 in the input while the decoder required a >= 1.
 *   - Speed/wattage bounds were only enforced while the throttle question was
 *     answered "has a throttle". Switching to "no motor" unmounted the inputs
 *     but kept their values in state, so a 100 mph bike sailed past both the
 *     browser's native validation and validate(), got encoded as s=100, and
 *     failed the decoder's max of 50.
 *
 * THE INVARIANT, enforced by src/lib/share-roundtrip.test.ts: every value these
 * bounds permit must survive encodeAnswers -> decodeAnswers unchanged. The Zod
 * schema in share.ts is deliberately allowed to be MORE permissive than this
 * (it still accepts s=0 / w=0 so that links shared before these bounds existed
 * keep working); it must never be LESS permissive.
 */
export const FORM_BOUNDS = {
  /** Top motor-assisted speed, mph. */
  topSpeed: { min: 1, max: 50 },
  /** Motor wattage, W. */
  motorWatts: { min: 1, max: 5000 },
  /** Operator age, years. */
  age: { min: 1, max: 120 },
  /**
   * A single liability limit, USD. The cap is not a legal figure — it exists
   * so the encoded value stays a safe integer the decoder can parse back.
   */
  coverage: { min: 0, max: 10_000_000 },
} as const

/** Values used when a hidden field's answer is not part of the rider's actual answer. */
export const FORM_DEFAULTS = {
  topSpeed: '20',
  motorWatts: '500',
} as const
