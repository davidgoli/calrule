import { Weekday, Frequency, RuleOptions } from './types'
import { DateTime } from './DateTime/index'
import { validate } from './validate'
import { parseISO } from './DateTime/parseISO'

export interface GroomedOptions {
  byday?: Weekday[]
  interval?: number
  freq: Frequency
  count?: number
  dtstart: DateTime
  until?: DateTime
}

const adjustFreq = ({ byday, freq }: Pick<RuleOptions, 'byday' | 'freq'>) => {
  if (byday) {
    return 'DAILY'
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
