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
}

export const bikeCategoryLabels: Readonly<Record<BikeCategory, string>> = {
  'low-speed-electric': 'Low-speed electric bicycle',
  'motorized': 'Motorized bicycle',
  'electric-motorized': 'Electric motorized bicycle',
  'standard': 'Standard (non-electric) bicycle',
}
