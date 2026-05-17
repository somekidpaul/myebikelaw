import { useState } from 'react'
import type {
  BikeProfile,
  ExistingPolicy,
  LicenseKind,
  OperatorProfile,
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
  pip: string
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
  pip: '',
}

export type FormResult = {
  bike: BikeProfile
  operator: OperatorProfile
  policies: ReadonlyArray<ExistingPolicy>
}

export function Form({ onSubmit }: { onSubmit: (r: FormResult) => void }) {
  const [s, setS] = useState<FormState>(initialState)

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setS((prev) => ({ ...prev, [k]: v }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
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
        license: s.license,
      },
      policies: [buildPolicy(s)],
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
                  min={0}
                  max={50}
                />
              </Field>
              <Field label="Motor wattage (W)">
                <Input
                  type="number"
                  value={s.motorWatts}
                  onChange={(v) => set('motorWatts', v)}
                  min={0}
                  max={5000}
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
                label="This bike is already registered with the NJ MVC"
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
        </div>
      </Card>

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
              <Field label="PIP per person ($)">
                <Input
                  type="number"
                  value={s.pip}
                  onChange={(v) => set('pip', v)}
                  min={0}
                  placeholder="15000"
                />
              </Field>
            </div>
          </div>
        )}
      </Card>

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
        pip: s.pip ? usd(Number(s.pip)) : null,
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      {label && (
        <span className="block text-sm font-medium text-[var(--color-ink-soft)]">
          {label}
        </span>
      )}
      {children}
    </label>
  )
}

function Input({
  type,
  value,
  onChange,
  min,
  max,
  required,
  placeholder,
}: {
  type: 'number' | 'text'
  value: string
  onChange: (v: string) => void
  min?: number
  max?: number
  required?: boolean
  placeholder?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      min={min}
      max={max}
      required={required}
      placeholder={placeholder}
    />
  )
}

function Select<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: ReadonlyArray<{ value: T; label: string }>
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as T)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
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
