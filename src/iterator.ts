import { GroomedOptions } from './groomOptions'
import { Frequency, Weekday } from './types'
import { DateTime } from './DateTime/index'
import { compare } from './DateTime/compare'
import { add } from './DateTime/add'
import { dayOfWeek, days } from './DateTime/dayOfWeek'

export const FREQUENCY_COUNTER: { [k in Frequency]: keyof DateTime } = {
  YEARLY: 'year',
  MONTHLY: 'month',
  WEEKLY: 'day',
  DAILY: 'day',
  HOURLY: 'hour',
  MINUTELY: 'minute',
  SECONDLY: 'second'
}

const skipBy = (
  current: DateTime,
  unit: keyof DateTime,
  nextUnit: keyof DateTime,
  stops: number[]
) => {
  for (let i = 0; i < stops.length; i++) {
    if (current[unit] <= stops[i]) {
      current[unit] = stops[i]
      return current
    }
  }

  current = add(current, { [nextUnit]: 1 })
  current[unit] = stops[0]
  return current
}

const nextSecond = (current: DateTime, bysecond: number[]) =>
  skipBy(current, 'second', 'minute', bysecond)

const nextMinute = (current: DateTime, byminute: number[]) =>
  skipBy(current, 'minute', 'hour', byminute)

const nextHour = (current: DateTime, byhour: number[]) =>
  skipBy(current, 'hour', 'day', byhour)

const nextMonthday = (current: DateTime, bymonthday: number[]) =>
  skipBy(current, 'day', 'month', bymonthday)

const nextDay = (current: DateTime, byday: Weekday[]) => {
  const currentDayOfWeekIdx = days.indexOf(dayOfWeek(current))

  for (let i = 0; i < byday.length; i++) {
    const daydiff = days.indexOf(byday[i]) - currentDayOfWeekIdx
    if (daydiff >= 0) {
      current.day += daydiff
      return current
    }
  }

  const day = 7 + days.indexOf(byday[0]) - currentDayOfWeekIdx
  return add(current, { day })
}

const skipAhead = (current: DateTime, options: GroomedOptions) => {
  if (options.bysecond) {
    return nextSecond(current, options.bysecond)
  }

  if (options.byminute) {
    return nextMinute(current, options.byminute)
  }

  if (options.byhour) {
    return nextHour(current, options.byhour)
  }

  if (options.byday) {
    return nextDay(current, options.byday)
  }

  if (options.bymonthday) {
    return nextMonthday(current, options.bymonthday)
  }

  return current
}

export const makeIterator = (options: GroomedOptions) => {
  const { dtstart, count, until, freq, interval = 1 } = options
  let current = skipAhead(dtstart, options)

  return {
    hasNext(length: number) {
      return (
        (typeof count === 'number' && length < count) ||
        (typeof until !== 'undefined' && compare(until, current) >= 0)
      )
    },

    next() {
      current = add(current, {
        [FREQUENCY_COUNTER[freq]]: interval * (freq === 'WEEKLY' ? 7 : 1)
      })

      current = skipAhead(current, options)
    },

    get current() {
      return current
    }
  }
}
