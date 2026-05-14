/**
 * Minimal RFC 5545 .ics generator for the S4834 compliance deadline.
 * Self-contained — no library dependency. Triggers a download client-side.
 */

type CalendarEvent = {
  readonly uid: string
  readonly summary: string
  readonly description: string
  readonly url?: string
  /** ISO date — all-day event */
  readonly date: string
  /** Days before the date to fire reminders */
  readonly reminderDaysBefore?: ReadonlyArray<number>
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

function formatDateOnly(iso: string): string {
  return iso.replace(/-/g, '')
}

function buildVAlarm(daysBefore: number, summary: string): string {
  return [
    'BEGIN:VALARM',
    `TRIGGER:-P${daysBefore}D`,
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcsText(summary)} — ${daysBefore} day${daysBefore === 1 ? '' : 's'} until deadline`,
    'END:VALARM',
  ].join('\r\n')
}

export function buildIcs(event: CalendarEvent): string {
  const start = formatDateOnly(event.date)
  // All-day events end on the next day in iCalendar.
  const next = new Date(event.date + 'T00:00:00Z')
  next.setUTCDate(next.getUTCDate() + 1)
  const end = formatDateOnly(next.toISOString().slice(0, 10))

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MyEBikeLaw.com//NJ S4834 Deadline//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${formatDateOnly(new Date().toISOString().slice(0, 10))}T000000Z`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${escapeIcsText(event.summary)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    ...(event.url ? [`URL:${event.url}`] : []),
    'STATUS:CONFIRMED',
    'TRANSP:TRANSPARENT',
    ...(event.reminderDaysBefore ?? []).map((d) => buildVAlarm(d, event.summary)),
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n')
}

export function downloadIcs(filename: string, ics: string): void {
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export const NJ_S4834_DEADLINE_EVENT: CalendarEvent = {
  uid: 'nj-s4834-deadline@myebikelaw.com',
  summary: 'NJ e-bike compliance deadline (S4834)',
  description:
    "Last day to obtain registration, license, and (for motorized bicycles) insurance for your e-bike under New Jersey's S4834. Verify your situation at https://myebikelaw.com",
  date: '2026-07-19',
  url: 'https://myebikelaw.com',
  reminderDaysBefore: [14, 7, 1],
}
