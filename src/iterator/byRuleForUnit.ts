import { DateTime } from '../DateTime/index'
import { dayOfWeek, daysInMonth, daysInYear } from '../DateTime/units'
import { ByProperty, GroomedOptions } from '../groomOptions'
import { Unit, UnitRule } from './types'
import { UNIT_ORDER } from './units'

const monthdays = (initial: DateTime, steps: number[]) => {
  const len = daysInMonth(initial.month, initial.year)

  return steps
    .map(step => (step < 0 ? len + (step + 1) : step))
    .sort((a, b) => a - b)
}

const yeardays = (initial: DateTime, steps: number[]) => {
  const len = daysInYear(initial.year)

  return steps
    .map(step => (step < 0 ? len + (step + 1) : step))
    .sort((a, b) => a - b)
}

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
}: GroomedOptions): Unit => {
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
  current: DateTime,
  unit: Unit,
  options: GroomedOptions
): UnitRule | undefined => {
  const smallestUnit = smallestTickUnit(options)
  const smallestUnitIdx = UNIT_ORDER.indexOf(smallestUnit)
  const defaultMonth = smallestUnitIdx < UNIT_ORDER.indexOf('month')
  const defaultDay = smallestUnitIdx < UNIT_ORDER.indexOf('day')
  const defaultWeekday = options.freq === 'WEEKLY'
  const defaultHour = smallestUnitIdx < UNIT_ORDER.indexOf('hour')
  const defaultMinute = smallestUnitIdx < UNIT_ORDER.indexOf('minute')
  const defaultSecond = smallestUnitIdx < UNIT_ORDER.indexOf('second')

  switch (unit) {
    case 'month':
      return unitRule(
        'bymonth',
        options.bymonth,
        defaultMonth ? options.dtstart.month : undefined
      )

    case 'day':
      return (
        unitRule(
          'byyearday',
          options.byyearday ? yeardays(current, options.byyearday) : undefined
        ) ||
        unitRule(
          'bymonthday',
          options.bymonthday
            ? monthdays(current, options.bymonthday)
            : undefined,
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
