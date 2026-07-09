import { cloneElement, isValidElement, useEffect, useId, useRef, useState } from 'react'
import type {
  BikeProfile,
  ExistingPolicy,
  LicenseKind,
  OperatorProfile,
  StatutoryRequirement,
  ThrottleKind,
} from '../types'
import { mph, usd, watts, years } from '../types'

type FormState = {
  throttle: ThrottleKind
  topSpeed: string
  motorWatts: string
  isRental: boolean
  isRegistered: boolean
  age: string
  license: LicenseKind
  policy: 'specialty' | 'homeowners' | 'renters' | 'auto' | 'none'
  bipp: string
  bipa: string
  pd: string
}

const initialState: FormState = {
  throttle: 'pedal-assist-only',
  topSpeed: '20',
  motorWatts: '500',
  isRental: false,
  isRegistered: false,
  age: '',
  license: 'basic-drivers',
  policy: 'none',
  bipp: '',
  bipa: '',
  pd: '',
}

export type FormResult = {
  bike: BikeProfile
  operator: OperatorProfile
  policies: ReadonlyArray<ExistingPolicy>
}

export function Form({
  statute,
  onSubmit,
}: {
  statute: StatutoryRequirement
  onSubmit: (r: FormResult) => void
}) {
  const [s, setS] = useState<FormState>(initialState)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {},
  )

  // Sections are statute-driven: a state with no licensing or insurance
  // requirement simply never shows those questions.
  const asksLicense = statute.licensing.appliesToCategories.length > 0
  const asksInsurance = statute.insurance.appliesToCategories.length > 0

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setS((prev) => ({ ...prev, [k]: v }))
    // Clear a field's error as soon as the user edits it.
    setErrors((prev) => (prev[k] ? { ...prev, [k]: undefined } : prev))
  }

  // Validate the two load-bearing bike inputs: a blank/zero speed or wattage
  // would otherwise coerce to 0 and yield a confident verdict for a bike that
  // doesn't exist. Only enforced when the bike has a motor.
  const validate = (): Partial<Record<keyof FormState, string>> => {
    const next: Partial<Record<keyof FormState, string>> = {}
    if (s.throttle !== 'none') {
      const speed = Number(s.topSpeed)
      if (s.topSpeed.trim() === '' || !Number.isFinite(speed) || speed < 1) {
        next.topSpeed = 'Enter a top speed of at least 1 mph.'
      } else if (speed > 50) {
        next.topSpeed = 'Enter a speed of 50 mph or less.'
      }
      const wattsVal = Number(s.motorWatts)
      if (s.motorWatts.trim() === '' || !Number.isFinite(wattsVal) || wattsVal < 1) {
        next.motorWatts = 'Enter a motor wattage of at least 1 W.'
      } else if (wattsVal > 5000) {
        next.motorWatts = 'Enter a wattage of 5000 W or less.'
      }
    }
    return next
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const found = validate()
    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }
    const ageNum = Number(s.age) || 0
    onSubmit({
      bike: {
        motorWatts: watts(Number(s.motorWatts) || 0),
        topMotorAssistedSpeed: mph(Number(s.topSpeed) || 0),
        throttle: s.throttle,
        isRentalFromSharedSystem: s.isRental,
        isRegistered: s.isRegistered,
      },
      operator: {
        age: years(ageNum),
        license: asksLicense ? s.license : 'none',
      },
      policies: [asksInsurance ? buildPolicy(s) : { kind: 'none' }],
    })
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <Card title="About your e-bike" number="1">
        <Field label="Throttle or pedal-assist?">
          <Select
            value={s.throttle}
            onChange={(v) => set('throttle', v as ThrottleKind)}
            options={[
              { value: 'pedal-assist-only', label: 'Pedal-assist only' },
              { value: 'throttle', label: 'Has a throttle' },
              { value: 'none', label: 'No motor (regular bike)' },
            ]}
          />
        </Field>

        {s.throttle !== 'none' && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Top motor-assisted speed (mph)">
                <Input
                  type="number"
                  value={s.topSpeed}
                  onChange={(v) => set('topSpeed', v)}
                  min={1}
                  max={50}
                  step={1}
                  error={errors.topSpeed}
                />
              </Field>
              <Field label="Motor wattage (W)">
                <Input
                  type="number"
                  value={s.motorWatts}
                  onChange={(v) => set('motorWatts', v)}
                  min={1}
                  max={5000}
                  step={1}
                  error={errors.motorWatts}
                />
              </Field>
            </div>
            <Field label="">
              <Checkbox
                checked={s.isRental}
                onChange={(v) => set('isRental', v)}
                label="This is a rental from a shared system (Citi Bike, Lime, etc.)"
              />
            </Field>
            <Field label="">
              <Checkbox
                checked={s.isRegistered}
                onChange={(v) => set('isRegistered', v)}
                label={`This bike is already registered with ${statute.registration.authority.name}`}
              />
            </Field>
          </>
        )}
      </Card>

      <Card title="About you" number="2">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your age">
            <Input
              type="number"
              value={s.age}
              onChange={(v) => set('age', v)}
              min={0}
              max={120}
              required
              placeholder="35"
            />
          </Field>
          {asksLicense && (
            <Field label="Your license">
              <Select
                value={s.license}
                onChange={(v) => set('license', v as LicenseKind)}
                options={[
                  { value: 'basic-drivers', label: "Basic driver's license" },
                  { value: 'motorized-bicycle', label: 'Motorized bicycle license' },
                  { value: 'none', label: 'Neither' },
                ]}
              />
            </Field>
          )}
        </div>
      </Card>

      {asksInsurance && (
      <Card title="Your most relevant insurance" number="3">
        <Field label="What's your current coverage?">
          <Select
            value={s.policy}
            onChange={(v) => set('policy', v as FormState['policy'])}
            options={[
              { value: 'none', label: "I don't have any policy I think might apply" },
              { value: 'specialty', label: 'A specialty e-bike / bicycle policy' },
              { value: 'auto', label: 'My auto policy (might extend to e-bike)' },
              { value: 'homeowners', label: 'Homeowners insurance' },
              { value: 'renters', label: 'Renters insurance' },
            ]}
          />
        </Field>

        {s.policy === 'specialty' && (
          <div
            className="space-y-4 rounded-xl p-4"
            style={{ background: 'rgba(255, 255, 255, 0.03)' }}
          >
            <p className="text-sm text-[var(--color-ink-soft)]">
              Enter your specialty policy limits — find these on your declarations page.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Bodily injury / person ($)">
                <Input
                  type="number"
                  value={s.bipp}
                  onChange={(v) => set('bipp', v)}
                  min={0}
                  placeholder="35000"
                />
              </Field>
              <Field label="Bodily injury / accident ($)">
                <Input
                  type="number"
                  value={s.bipa}
                  onChange={(v) => set('bipa', v)}
                  min={0}
                  placeholder="70000"
                />
              </Field>
              <Field label="Property damage ($)">
                <Input
                  type="number"
                  value={s.pd}
                  onChange={(v) => set('pd', v)}
                  min={0}
                  placeholder="25000"
                />
              </Field>
            </div>
            <p className="text-xs text-[var(--color-ink-faint)]">
              PIP isn't asked for — the statute's e-bike policy is
              liability-only (PIP rides on your own auto policy, separately).
            </p>
          </div>
        )}
      </Card>
      )}

      <button type="submit" className="btn btn-primary w-full">
        Check my compliance →
      </button>
    </form>
  )
}

function buildPolicy(s: FormState): ExistingPolicy {
  if (s.policy === 'none') return { kind: 'none' }
  if (s.policy === 'specialty') {
    return {
      kind: 'specialty-ebike',
      coverage: {
        bodilyInjuryPerPerson: usd(Number(s.bipp) || 0),
        bodilyInjuryPerAccident: usd(Number(s.bipa) || 0),
        propertyDamage: usd(Number(s.pd) || 0),
        pip: null,
      },
    }
  }
  if (s.policy === 'auto') {
    return {
      kind: 'auto',
      extendsToEbike: 'unknown',
      coverage: {
        bodilyInjuryPerPerson: usd(0),
        bodilyInjuryPerAccident: usd(0),
        propertyDamage: usd(0),
        pip: null,
      },
    }
  }
  return {
    kind: s.policy,
    includesEbike: 'unknown',
    coverage: {
      bodilyInjuryPerPerson: null,
      bodilyInjuryPerAccident: null,
      propertyDamage: null,
      pip: null,
    },
  }
}

function Card({
  title,
  number,
  children,
}: {
  title: string
  number: string
  children: React.ReactNode
}) {
  return (
    <div className="card space-y-5">
      <div className="flex items-center gap-3">
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
          style={{ background: 'rgba(234, 88, 12, 0.12)', color: 'var(--color-brand)' }}
        >
          {number}
        </span>
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      {children}
    </div>
  )
}

// A <label> only programmatically associates with a native control it wraps —
// not with the custom Select's <button> or (via wrapping) reliably with the
// nested <input>. So Field mints an id, puts it on the visible label <span>,
// and injects it into its single child as `labelId`, which Select/Input turn
// into aria-labelledby. Falls back gracefully for children that ignore it.
function Field({ label, children }: { label: string; children: React.ReactElement }) {
  const labelId = useId()
  const labelled =
    label && isValidElement(children)
      ? cloneElement(children as React.ReactElement<{ labelId?: string }>, {
          labelId,
        })
      : children
  return (
    <label className="block space-y-2">
      {label && (
        <span
          id={labelId}
          className="block text-sm font-medium text-[var(--color-ink-soft)]"
        >
          {label}
        </span>
      )}
      {labelled}
    </label>
  )
}

function Input({
  type,
  value,
  onChange,
  min,
  max,
  step,
  required,
  placeholder,
  error,
  labelId,
}: {
  type: 'number' | 'text'
  value: string
  onChange: (v: string) => void
  min?: number
  max?: number
  step?: number
  required?: boolean
  placeholder?: string
  error?: string
  labelId?: string
}) {
  const errorId = useId()
  return (
    <>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        step={step}
        required={required}
        placeholder={placeholder}
        aria-labelledby={labelId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={error ? 'input-invalid' : undefined}
      />
      {error && (
        <span id={errorId} role="alert" className="field-error">
          {error}
        </span>
      )}
    </>
  )
}

// Custom accessible dropdown that replaces the native <select> — one component,
// so every menu on the form upgrades at once. Trigger + floating panel with a
// chevron that flips on open; full keyboard support (arrows / Enter / Esc /
// Home / End via aria-activedescendant), click-outside-to-close, and a CSS
// open animation (collapsed by the global reduced-motion rule). Same props as
// the old native Select, so all 11 call sites are untouched.
function Select<T extends string>({
  value,
  onChange,
  options,
  labelId,
}: {
  value: T
  onChange: (v: T) => void
  options: ReadonlyArray<{ value: T; label: string }>
  labelId?: string
}) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const listId = useId()
  // Type-ahead buffer: printable chars accumulate for a short window so
  // "ho" jumps to "Homeowners", matching native <select> behavior.
  const typeahead = useRef({ query: '', at: 0 })

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  )
  const current = options[selectedIndex] ?? options[0]

  const openMenu = () => {
    setActiveIndex(selectedIndex)
    setOpen(true)
  }
  const choose = (v: T) => {
    onChange(v)
    setOpen(false)
    triggerRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  // Keep the active option in view — aria-activedescendant alone doesn't scroll
  // the panel, so an ArrowDown past the visible rows would leave the highlight
  // below the fold. Native <select> auto-scrolls; this restores that.
  useEffect(() => {
    if (!open) return
    const active = listRef.current?.children[activeIndex] as
      | HTMLElement
      | undefined
    active?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Type-ahead: a printable character jumps to the next option whose label
    // starts with the accumulated query (native <select> parity).
    if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
      const now = Date.now()
      const ta = typeahead.current
      ta.query = now - ta.at > 500 ? e.key : ta.query + e.key
      ta.at = now
      const q = ta.query.toLowerCase()
      const from = open ? activeIndex : selectedIndex
      // Search from the current position forward, wrapping around.
      const n = options.length
      for (let step = 1; step <= n; step++) {
        const idx = (from + step) % n
        const opt = options[idx]
        if (opt && opt.label.toLowerCase().startsWith(q)) {
          e.preventDefault()
          if (open) setActiveIndex(idx)
          else choose(opt.value)
          return
        }
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        if (!open) return openMenu()
        setActiveIndex((i) => Math.min(i + 1, options.length - 1))
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!open) return openMenu()
        setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case 'Home':
        if (open) {
          e.preventDefault()
          setActiveIndex(0)
        }
        break
      case 'End':
        if (open) {
          e.preventDefault()
          setActiveIndex(options.length - 1)
        }
        break
      case 'Enter':
      case ' ': {
        e.preventDefault()
        if (!open) return openMenu()
        const opt = options[activeIndex]
        if (opt) choose(opt.value)
        break
      }
      case 'Escape':
        if (open) {
          e.preventDefault()
          setOpen(false)
        }
        break
      case 'Tab':
        if (open) setOpen(false)
        break
    }
  }

  return (
    <div className={`select-dd${open ? ' is-open' : ''}`} ref={wrapRef}>
      <button
        type="button"
        ref={triggerRef}
        className="select-dd-trigger"
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={labelId}
        aria-activedescendant={open ? `${listId}-opt-${activeIndex}` : undefined}
      >
        <span className="select-dd-value">{current?.label}</span>
        <span className="select-dd-chevron" aria-hidden="true">
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open && (
        <ul
          className="select-dd-panel"
          id={listId}
          role="listbox"
          ref={listRef}
          aria-labelledby={labelId}
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${listId}-opt-${i}`}
              role="option"
              aria-selected={o.value === value}
              className={`select-dd-option${o.value === value ? ' is-selected' : ''}${
                i === activeIndex ? ' is-active' : ''
              }`}
              onMouseEnter={() => setActiveIndex(i)}
              // preventDefault stops the wrapping <label> from re-firing this
              // click onto the trigger button (which would reopen the menu)
              onClick={(e) => {
                e.preventDefault()
                choose(o.value)
              }}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <span className="flex cursor-pointer items-center gap-3 text-[var(--color-ink-soft)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </span>
  )
}
