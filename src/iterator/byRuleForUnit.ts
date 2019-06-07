import { DateTime } from '../DateTime/index'
import {
  dayOfWeek,
  daysInMonth,
  daysInYear,
  weeksInYear
} from '../DateTime/units'
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

const weeknos = (initial: DateTime, steps: number[]) => {
  const len = weeksInYear(initial.year)

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

const defaultForUnit = (
  unit: Unit,
  options: GroomedOptions
): number | undefined => {
  const smallestUnit = smallestTickUnit(options)
  const smallestUnitIdx = UNIT_ORDER.indexOf(smallestUnit)

  switch (unit) {
    default:
      return smallestUnitIdx < UNIT_ORDER.indexOf(unit)
        ? options.dtstart[unit]
        : undefined
  }
}

const defaultWeekday = (options: GroomedOptions) => {
  return options.freq === 'WEEKLY' ? dayOfWeek(options.dtstart) : undefined
}

export const byRuleForUnit = (
  current: DateTime,
  unit: Unit,
  options: GroomedOptions
): UnitRule | undefined => {
  switch (unit) {
    case 'month':
      return unitRule(
        'bymonth',
        options.bymonth,
        defaultForUnit('month', options)
      )

    case 'day':
      return (
        unitRule(
          'byyearday',
          options.byyearday ? yeardays(current, options.byyearday) : undefined
        ) ||
        unitRule(
          'byweekno',
          options.byweekno ? weeknos(current, options.byweekno) : undefined
        ) ||
        unitRule(
          'bymonthday',
          options.bymonthday
            ? monthdays(current, options.bymonthday)
            : undefined,
          defaultForUnit('day', options)
        ) ||
        unitRule('byday', options.byday, defaultWeekday(options))
      )

    case 'hour':
      return unitRule('byhour', options.byhour, defaultForUnit('hour', options))

    case 'minute':
      return unitRule(
        'byminute',
        options.byminute,
        defaultForUnit('minute', options)
      )

    case 'second':
      return unitRule(
        'bysecond',
        options.bysecond,
        defaultForUnit('second', options)
      )

    default:
      return undefined
  }
}
