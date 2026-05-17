import type { MPH, Watts } from './brands'

export type BikeCategory =
  | 'low-speed-electric'
  | 'motorized'
  | 'electric-motorized'
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

export const bikeCategoryLabels: Readonly<Record<BikeCategory, string>> = {
  'low-speed-electric': 'Low-speed electric bicycle',
  'motorized': 'Motorized bicycle',
  'electric-motorized': 'Electric motorized bicycle',
  'standard': 'Standard (non-electric) bicycle',
}
