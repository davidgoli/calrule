import { DateTime } from '../DateTime'
import { dayOfWeek } from '../DateTime/units'
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

const unitRule = <T>(unit: ByProperty, byrule: T[] | undefined, def?: T) =>
  byrule
    ? { unit, byrule }
    : typeof def !== 'undefined'
    ? { unit, byrule: [def] }
    : undefined

const smallestTickUnit = ({
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

export const byRuleForUnit = (
  unit: keyof DateTime,
  options: GroomedOptions
): UnitRule | undefined => {
  const smallestUnit = smallestTickUnit(options)
  const smallestUnitIdx = FREQUENCY_ORDER.indexOf(smallestUnit)
  const defaultSecond = smallestUnitIdx < FREQUENCY_ORDER.indexOf('second')
  const defaultMinute = smallestUnitIdx < FREQUENCY_ORDER.indexOf('minute')
  const defaultHour = smallestUnitIdx < FREQUENCY_ORDER.indexOf('hour')
  const defaultDay = smallestUnitIdx < FREQUENCY_ORDER.indexOf('day')
  const defaultWeekday = options.freq === 'WEEKLY'
  const defaultMonth = smallestUnitIdx < FREQUENCY_ORDER.indexOf('month')

  switch (unit) {
    case 'month':
      return unitRule(
        'bymonth',
        options.bymonth,
        defaultMonth ? options.dtstart.month : undefined
      )

    case 'day':
      return (
        unitRule('byyearday', options.byyearday) ||
        unitRule(
          'bymonthday',
          options.bymonthday,
          defaultDay ? options.dtstart.day : undefined
        ) ||
        unitRule(
          'byday',
          options.byday,
          defaultWeekday ? dayOfWeek(options.dtstart) : undefined
        )
      )
    case 'hour':
      return unitRule(
        'byhour',
        options.byhour,
        defaultHour ? options.dtstart.hour : undefined
      )
    case 'minute':
      return unitRule(
        'byminute',
        options.byminute,
        defaultMinute ? options.dtstart.minute : undefined
      )
    case 'second':
      return unitRule(
        'bysecond',
        options.bysecond,
        defaultSecond ? options.dtstart.second : undefined
      )
    default:
      return undefined
  }
}

export const unitForByrule: { [K in ByProperty]: keyof DateTime } = {
  bysecond: 'second',
  byminute: 'minute',
  byhour: 'hour',
  byday: 'day',
  bymonth: 'month',
  bymonthday: 'day',
  byyearday: 'day'
}

export const nextLargerUnit = (unit: keyof DateTime) =>
  FREQUENCY_ORDER[FREQUENCY_ORDER.indexOf(unit) - 1]
