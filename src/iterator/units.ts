import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { Frequency } from '../types'

export const FREQUENCY_COUNTER: { [k in Frequency]: keyof DateTime } = {
  YEARLY: 'year',
  MONTHLY: 'month',
  WEEKLY: 'day',
  DAILY: 'day',
  HOURLY: 'hour',
  MINUTELY: 'minute',
  SECONDLY: 'second'
}

export const FREQUENCY_ORDER: (keyof DateTime)[] = [
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second'
]

export const byRuleForUnit = (
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  switch (unit) {
    case 'month':
      return options.bymonth
    case 'hour':
      return options.byhour
    case 'day':
      return options.byyearday || options.bymonthday || options.byday
    case 'minute':
      return options.byminute
    case 'second':
      return options.bysecond
    default:
      return undefined
  }
}

export const smallestTickUnit = ({
  freq,
  bysecond,
  byminute,
  byhour,
  byday,
  bymonth
}: GroomedOptions): keyof DateTime => {
  if (freq === 'SECONDLY' || bysecond) {
    return 'second'
  }

  if (freq === 'MINUTELY' || byminute) {
    return 'minute'
  }

  if (freq === 'HOURLY' || byhour) {
    return 'hour'
  }

  if (freq === 'DAILY' || byday) {
    return 'day'
  }

  if (freq === 'WEEKLY') {
    return 'day'
  }

  if (freq === 'MONTHLY' || bymonth) {
    return 'month'
  }

  return 'year'
}
