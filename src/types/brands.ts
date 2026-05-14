declare const brand: unique symbol

type Brand<T, B> = T & { readonly [brand]: B }

export type USD = Brand<number, 'USD'>
export type MPH = Brand<number, 'MPH'>
export type Watts = Brand<number, 'Watts'>
export type Years = Brand<number, 'Years'>

export const usd = (n: number): USD => n as USD
export const mph = (n: number): MPH => n as MPH
export const watts = (n: number): Watts => n as Watts
export const years = (n: number): Years => n as Years
