import { Weekday, Frequency, RuleOptions } from './types'
import { DateTime } from './DateTime/index'
import { validate, FREQValues } from './validate'
import { parseISO } from './DateTime/parseISO'

export interface GroomedOptions {
  byday?: Weekday[]
  interval?: number
  freq: Frequency
  count?: number
  dtstart: DateTime
  until?: DateTime
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
const adjustFreq = ({ byday, freq }: Pick<RuleOptions, 'byday' | 'freq'>) => {
  if (byday) {
    return FREQValues[
      Math.max(FREQValues.indexOf('DAILY'), FREQValues.indexOf(freq))
    ]
  }

  return freq
}

export const groomOptions = (
  options: RuleOptions
): GroomedOptions | undefined => {
  if (!validate(options)) {
    return undefined
  }

  const frequency = adjustFreq({ byday: options.byday, freq: options.freq })
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
