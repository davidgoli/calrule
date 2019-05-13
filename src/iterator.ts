import { add } from './DateTime/add'
import { compare } from './DateTime/compare'
import { dayOfWeek, dayOfYear, days } from './DateTime/dayOfWeek'
import { DateTime } from './DateTime/index'
import { isRealDate } from './DateTime/isValidDate'
import { GroomedOptions } from './groomOptions'
import { Frequency, Weekday } from './types'

export const FREQUENCY_COUNTER: { [k in Frequency]: keyof DateTime } = {
  YEARLY: 'year',
  MONTHLY: 'month',
  WEEKLY: 'day',
  DAILY: 'day',
  HOURLY: 'hour',
  MINUTELY: 'minute',
  SECONDLY: 'second'
}

const skipBy = (unit: keyof DateTime, nextUnit: keyof DateTime) => (
  current: DateTime,
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

const nextSecond = skipBy('second', 'minute')
const nextMinute = skipBy('minute', 'hour')
const nextHour = skipBy('hour', 'day')
const nextMonthday = skipBy('day', 'month')
const nextMonth = skipBy('month', 'year')

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

const nextYearday = (current: DateTime, stops: number[]) => {
  const currentDayOfYear = dayOfYear(current)

  for (let i = 0; i < stops.length; i++) {
    if (currentDayOfYear <= stops[i]) {
      current.month = 1
      current.day = 0
      return add(current, { day: stops[i] })
    }
  }

  current = add(current, { year: 1 })
  current.month = 1
  current.day = 0
  return add(current, { day: stops[0] })
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

  if (options.bymonth) {
    return nextMonth(current, options.bymonth)
  }

  if (options.byyearday) {
    return nextYearday(current, options.byyearday)
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
      do {
        current = add(current, {
          [FREQUENCY_COUNTER[freq]]: interval * (freq === 'WEEKLY' ? 7 : 1)
        })

        current = skipAhead(current, options)
      } while (!isRealDate(current))
    },

    get current() {
      return current
    }
  }
}
