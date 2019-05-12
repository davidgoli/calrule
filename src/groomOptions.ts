import { Weekday, Frequency, RuleOptions } from './types'
import { DateTime } from './DateTime/index'
import { validate, FREQValues } from './validate'
import { parseISO } from './DateTime/parseISO'

export interface GroomedOptions {
  byday?: Weekday[]
  byhour?: number[]
  interval?: number
  freq: Frequency
  count?: number
  dtstart: DateTime
  until?: DateTime
}

const maxFreq = (limit: Frequency, current: Frequency) =>
  FREQValues[Math.max(FREQValues.indexOf(limit), FREQValues.indexOf(current))]

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
  freq
}: Pick<RuleOptions, 'byday' | 'byhour' | 'freq'>) => {
  if (byday) {
    return maxFreq('DAILY', freq)
  }

  if (byhour) {
    return maxFreq('HOURLY', freq)
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

  return {
    ...options,
    until: untilDate,
    dtstart: dtstartDate,
    freq: frequency
  }
}
