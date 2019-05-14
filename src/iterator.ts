import { copy } from './copy'
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

const FREQUENCY_ORDER: (keyof DateTime)[] = [
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second'
]

const skipBy = (unit: keyof DateTime) => (
  current: DateTime,
  stops: number[],
  interval: number
) => {
  for (let i = 0; i < stops.length; i++) {
    console.log(current[unit], stops[i])
    if (current[unit] < stops[i]) {
      current[unit] = stops[i]
      return current
    }
  }

  const currentUnitIndex = FREQUENCY_ORDER.indexOf(unit)
  const nextUnitIndex = Math.max(currentUnitIndex - 1, 0)
  const nextUnit = FREQUENCY_ORDER[nextUnitIndex]

  console.log({ unit, nextUnit })
  current = add(current, { [nextUnit]: interval })
  current[unit] = stops[0]

  return current
}

const nextSecond = skipBy('second')
const nextMinute = skipBy('minute')
const nextHour = skipBy('hour')
const nextMonthday = skipBy('day')
const nextMonth = skipBy('month')

const nextDay = (current: DateTime, stops: Weekday[]) => {
  const currentDayOfWeekIdx = days.indexOf(dayOfWeek(current))

  for (let i = 0; i < stops.length; i++) {
    const daydiff = days.indexOf(stops[i]) - currentDayOfWeekIdx
    if (daydiff >= 0) {
      current.day += daydiff
      return current
    }
  }

  // const unit = 'day'
  // const currentUnitIndex = FREQUENCY_ORDER.indexOf(unit)
  // const nextUnitIndex = Math.max(currentUnitIndex - 1, 0)
  // const nextUnit = FREQUENCY_ORDER[nextUnitIndex]

  const day = 7 + days.indexOf(stops[0]) - currentDayOfWeekIdx
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
    return nextSecond(current, options.bysecond, options.interval)
  }

  if (options.byminute) {
    return nextMinute(current, options.byminute, options.interval)
  }

  if (options.byhour) {
    return nextHour(current, options.byhour, options.interval)
  }

  if (options.byday) {
    return nextDay(current, options.byday)
  }

  if (options.bymonthday) {
    return nextMonthday(current, options.bymonthday, options.interval)
  }

  if (options.bymonth) {
    return nextMonth(current, options.bymonth, options.interval)
  }

  if (options.byyearday) {
    return nextYearday(current, options.byyearday)
  }

  return current
}

export const makeIterator = (options: GroomedOptions) => {
  const { dtstart, count, until, freq, interval = 1 } = options
  let current = copy(dtstart)

  return {
    hasNext(length: number) {
      return (
        (typeof count === 'number' && length < count) ||
        (typeof until !== 'undefined' && compare(until, current) >= 0)
      )
    },

    // freq = secondly
    // bysecond 1, 2
    // dtstart minute: 0, second: 0
    // -> minute: 0, second: 1
    // -> minute: 0, second: 2
    // if
    next() {
      do {
        const newCurrent = skipAhead(current, options)
        console.log({ newCurrent })
        if (compare(newCurrent, current) === 0) {
          // const nextOrderIdx = Math.max(
          //   FREQUENCY_ORDER.indexOf(FREQUENCY_COUNTER[freq]),
          //   0
          // )

          // const nextOrder = FREQUENCY_ORDER[nextOrderIdx]
          // current = add(current, {
          //   [FREQUENCY_COUNTER[freq]]: interval * (freq === 'WEEKLY' ? 7 : 1)
          // })

          const freqOrder = FREQUENCY_ORDER.indexOf(FREQUENCY_COUNTER[freq])
          if (freqOrder !== FREQUENCY_ORDER.length - 1) {
            FREQUENCY_ORDER.slice(freqOrder + 1).forEach(f => {
              current[f] = 0 //dtstart[f]
            })
          }

          current = skipAhead(current, options)
          console.log({ current })
        }
      } while (!isRealDate(current))
    },

    get current() {
      return current
    }
  }
}
