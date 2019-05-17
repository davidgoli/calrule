import { DateTime } from '../DateTime/index'
import { ByProperty, GroomedOptions } from '../groomOptions'
import { Frequency } from '../types'
import { UnitRule } from './types'

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
): UnitRule | undefined => {
  switch (unit) {
    case 'month':
      return unitRule('bymonth', options.bymonth)

    case 'day':
      return (
        unitRule('byyearday', options.byyearday) ||
        unitRule('bymonthday', options.bymonthday) ||
        unitRule('byday', options.byday)
      )
    case 'hour':
      return unitRule('byhour', options.byhour)
    case 'minute':
      return unitRule('byminute', options.byminute)
    case 'second':
      return unitRule('bysecond', options.bysecond)
    default:
      return undefined
  }
}

export const unitForByrule = (byruleUnit: ByProperty): keyof DateTime => {
  const mappings: { [K in ByProperty]: keyof DateTime } = {
    bysecond: 'second',
    byminute: 'minute',
    byhour: 'hour',
    byday: 'day',
    bymonth: 'month',
    bymonthday: 'day',
    byyearday: 'day'
  }
  return mappings[byruleUnit]
}

export const unitRule = <T>(unit: ByProperty, byrule: T[] | undefined) => {
  return byrule ? { unit, byrule } : undefined
}

export const smallestTickUnit = ({
  freq,
  bysecond,
  byminute,
  byhour,
  byday,
  bymonth,
  bymonthday,
  byyearday
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

  if (
    freq === 'DAILY' ||
    freq === 'WEEKLY' ||
    byday ||
    byyearday ||
    bymonthday
  ) {
    return 'day'
  }

  if (freq === 'MONTHLY' || bymonth) {
    return 'month'
  }

  return 'year'
}
