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

const skipBy = (unit: keyof DateTime) => (
  current: DateTime,
  stops: number[]
) => {
  for (let i = 0; i < stops.length; i++) {
    if (current[unit] <= stops[i]) {
      current[unit] = stops[i]
      return current
    }
  }

  return current
}

const nextSecond = skipBy('second')
const nextMinute = skipBy('minute')
const nextHour = skipBy('hour')
const nextMonthday = skipBy('day')
const nextMonth = skipBy('month')

const nextDay = (current: DateTime, byday: Weekday[]) => {
  const currentDayOfWeekIdx = days.indexOf(dayOfWeek(current))

  for (let i = 0; i < byday.length; i++) {
    const daydiff = days.indexOf(byday[i]) - currentDayOfWeekIdx
    if (daydiff >= 0) {
      current.day += daydiff
      return current
    }
  }

  return current
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

  return current
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
  let slowHand = skipAhead(dtstart, options)
  let fastHand = [slowHand]
  let fastHandIndex = 0

  return {
    hasNext(length: number) {
      return (
        (typeof count === 'number' && length < count) ||
        (typeof until !== 'undefined' &&
          compare(until, fastHand[fastHandIndex]) >= 0)
      )
    },

    next() {
      while (fastHand.length) {
        if (fastHandIndex === fastHand.length) {
          slowHand = add(slowHand, {
            [FREQUENCY_COUNTER[freq]]: interval * (freq === 'WEEKLY' ? 7 : 1)
          })

          fastHandIndex = 0
          fastHand = calculateFastHand(slowHand, options)
        } else {
          fastHandIndex += 1
        }

        if (isRealDate(fastHand[fastHandIndex])) {
          return fastHand[fastHandIndex]
        }
      }
    },

    get current() {
      return fastHand[fastHandIndex]
    }
  }
}

const calculateFastHand = (slowHand: DateTime, options: GroomedOptions) => {
  return [slowHand]
}
