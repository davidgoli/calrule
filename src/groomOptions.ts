import { Weekday, Frequency, RuleOptions } from './types'
import { DateTime } from './DateTime/index'
import { validate, FREQValues } from './validate'
import { parseISO } from './DateTime/parseISO'
import { days } from './DateTime/dayOfWeek'

export interface GroomedOptions {
  byday?: Weekday[]
  byhour?: number[]
  byminute?: number[]
  bysecond?: number[]
  interval?: number
  freq: Frequency
  count?: number
  dtstart: DateTime
  until?: DateTime
}

const maxFreq = (limit: Frequency, current: Frequency) =>
  FREQValues[Math.max(FREQValues.indexOf(limit), FREQValues.indexOf(current))]

const normalizeByUnit = <T>(
  unit: T[] | undefined,
  compareFn: (a: T, b: T) => number = (a, b) =>
    ((a as unknown) as number) - ((b as unknown) as number)
) => {
  if (!unit || unit.length === 0) {
    return undefined
  }

  return unit.filter(i => typeof i !== 'undefined').sort(compareFn)
}

// Per the RFC:
//
// "BYxxx rule parts for a period of time less than the frequency generally
// increase or expand the number of occurrences of the recurrence.
// For example, "FREQ=YEARLY;BYMONTH=1,2" increases the number of
// days within the yearly recurrence set from 1 (if BYMONTH rule part
// is not present) to 2."
//
// This has no functional difference from FREQ=MONTHLY;BYMONTH=1,2,
// so for freq periods greater than the BYxxx, we just set
// freq=xxx
const adjustFreq = ({
  byday,
  byhour,
  byminute,
  bysecond,
  freq
}: Pick<
RuleOptions,
'byday' | 'byhour' | 'byminute' | 'bysecond' | 'freq'
>) => {
  if (byday) {
    return maxFreq('DAILY', freq)
  }

  if (byhour) {
    return maxFreq('HOURLY', freq)
  }

  if (byminute) {
    return maxFreq('MINUTELY', freq)
  }

  if (bysecond) {
    return maxFreq('SECONDLY', freq)
  }

  return freq
}

export const groomOptions = (
  options: RuleOptions
): GroomedOptions | undefined => {
  if (!validate(options)) {
    return undefined
  }

  const frequency = adjustFreq(options)
  const dtstartDate = parseISO(options.dtstart)
  if (!dtstartDate) {
    return undefined
  }

  const untilDate = parseISO(options.until)
  const groomedOptions: Partial<GroomedOptions> = {
    interval: options.interval || 1
  }

  if (options.count) {
    groomedOptions.count = options.count
  }

  ;(['byhour', 'byminute', 'bysecond'] as (
    | 'byhour'
    | 'byminute'
    | 'bysecond')[]).forEach(unit => {
    const normalized = normalizeByUnit(options[unit])
    if (normalized) {
      groomedOptions[unit] = normalized
    }
  })

  const byday = normalizeByUnit(
    options.byday,
    (a, b) => days.indexOf(a) - days.indexOf(b)
  )

  if (byday) {
    groomedOptions.byday = byday
  }

  return {
    ...groomedOptions,
    until: untilDate,
    dtstart: dtstartDate,
    freq: frequency
  }
}
