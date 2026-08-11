import type { MPH, Watts } from './brands'

export type BikeCategory =
  // New Jersey (S4834) categories
  | 'low-speed-electric'
  | 'motorized'
  | 'electric-motorized'
  // Hawaii (HB 2021) categories — the standard 3-class system plus the
  // high-speed category the act bans from public infrastructure
  | 'class-1'
  | 'class-2'
  | 'class-3'
  | 'high-speed-electric'
  // Any jurisdiction: no motor
  | 'standard'

export type ThrottleKind = 'none' | 'pedal-assist-only' | 'throttle'

export type BikeProfile = {
  readonly motorWatts: Watts
  readonly topMotorAssistedSpeed: MPH
  readonly throttle: ThrottleKind
  readonly isRentalFromSharedSystem: boolean
  /**
   * Whether the bike is already registered with the state. Optional: when
   * omitted (or false) the engine treats it as not yet registered and
   * surfaces registration as a gap.
   */
  readonly isRegistered?: boolean
}

/**
 * Lowercase forms, for dropping into the middle of a sentence ("we classified
 * it conservatively as a class 3 electric bicycle"). Separate from
 * bikeCategoryLabels because that one is Title Case for standalone display.
 *
 * Typed as a total Record on purpose: adding a category to BikeCategory
 * without adding its prose here is a COMPILE error. It used to be a loose
 * lookup with a `?? slug` fallback, which is how every Hawaii category
 * silently rendered as "class-3" / "high-speed-electric" in the verdict copy.
 */
export const bikeCategoryProse: Readonly<Record<BikeCategory, string>> = {
  'low-speed-electric': 'low-speed electric bicycle',
  motorized: 'motorized bicycle',
  'electric-motorized': 'electric motorized bicycle',
  'class-1': 'class 1 electric bicycle',
  'class-2': 'class 2 electric bicycle',
  'class-3': 'class 3 electric bicycle',
  'high-speed-electric': 'high-speed electric device',
  standard: 'standard bicycle',
}

export const bikeCategoryLabels: Readonly<Record<BikeCategory, string>> = {
  'low-speed-electric': 'Low-speed electric bicycle',
  'motorized': 'Motorized bicycle',
  'electric-motorized': 'Electric motorized bicycle',
  'class-1': 'Class 1 electric bicycle',
  'class-2': 'Class 2 electric bicycle',
  'class-3': 'Class 3 electric bicycle',
  'high-speed-electric': 'High-speed electric bicycle',
  'standard': 'Standard (non-electric) bicycle',
}
