import { WEEKDAYS } from './DateTime/units'
import { DateTime } from './DateTime'
import { parseISO } from './DateTime/parseISO'
import { Frequency, RuleOptions, Weekday } from './types'
import { validate } from './validate'

export interface GroomedOptions {
  byyearday?: number[]
  bymonth?: number[]
  bymonthday?: number[]
  byday?: Weekday[]
  byhour?: number[]
  byminute?: number[]
  bysecond?: number[]
  interval: number
  freq: Frequency
  count?: number
  dtstart: DateTime
  until?: DateTime
}

export type ByProperty = keyof Pick<
RuleOptions,
| 'byhour'
| 'byminute'
| 'bysecond'
| 'byday'
| 'bymonthday'
| 'bymonth'
| 'byyearday'
>

const byProperties: ByProperty[] = [
  'byhour',
  'byminute',
  'bysecond',
  'byday',
  'bymonthday',
  'bymonth',
  'byyearday'
]

const compareNumbers = <T>(a: T, b: T) =>
  ((a as unknown) as number) - ((b as unknown) as number)

const normalizeByUnit = <T>(
  unit: T[] | undefined,
  compareFn: (a: T, b: T) => number = compareNumbers
) => {
  if (!unit) {
    return undefined
  }

  const filtered = unit.filter(i => typeof i !== 'undefined').sort(compareFn)
  if (filtered.length === 0) {
    return undefined
  }

  return filtered
}

export const groomOptions = (
  options: RuleOptions
): GroomedOptions | undefined => {
  if (validate(options)[0] === false) {
    return undefined
  }

  const { freq } = options
  const dtstart = parseISO(options.dtstart)
  if (!dtstart) {
    return undefined
  }

  const groomedOptions: GroomedOptions = {
    dtstart,
    freq,
    interval: options.interval || 1
  }

  if (options.count) {
    groomedOptions.count = options.count
  }

  byProperties
    .filter(p => p !== 'byday')
    .forEach(unit => {
      const normalized = normalizeByUnit(options[unit] as number[])
      if (normalized) {
        groomedOptions[unit] = normalized
      }
    })

  const byday = normalizeByUnit(
    options.byday,
    (a, b) => WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b)
  )

  if (byday) {
    groomedOptions.byday = byday
  }

  const untilDate = parseISO(options.until)

  if (untilDate) {
    groomedOptions.until = untilDate
  }

  return groomedOptions
}
