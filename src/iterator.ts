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
  stops: number[]
) => {
  for (let i = 0; i < stops.length; i++) {
    console.log(unit, current[unit], stops[i])
    if (current[unit] < stops[i]) {
      current[unit] = stops[i]
      console.log(`returning ${unit} ${stops[i]}`)
      return current
    }
  }

  // const currentUnitIndex = FREQUENCY_ORDER.indexOf(unit)
  // const nextUnitIndex = Math.max(currentUnitIndex - 1, 0)
  // const nextUnit = FREQUENCY_ORDER[nextUnitIndex]

  // console.log({ unit, nextUnit })
  // current = add(current, { [nextUnit]: interval })
  // current[unit] = stops[0]

  current[unit] = stops[stops.length - 1]
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
    if (daydiff > 0) {
      current.day += daydiff
      return current
    }
  }

  // const unit = 'day'
  // const currentUnitIndex = FREQUENCY_ORDER.indexOf(unit)
  // const nextUnitIndex = Math.max(currentUnitIndex - 1, 0)
  // const nextUnit = FREQUENCY_ORDER[nextUnitIndex]

  // const day = 7 + days.indexOf(stops[0]) - currentDayOfWeekIdx
  // return add(current, { day })
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

  // current = add(current, { year: 1 })
  // current.month = 1
  // current.day = 0
  // return add(current, { day: stops[0] })
  return current
}

const skipAhead = (current: DateTime, options: GroomedOptions) => {
  if (options.bysecond) {
    const next = nextSecond(current, options.bysecond)
    if (compare(next, current) !== 0) {
      return next
    }
  }

  if (options.byminute) {
    const next = nextMinute(current, options.byminute)
    if (compare(next, current) !== 0) {
      return next
    }
  }

  if (options.byhour) {
    const next = nextHour(current, options.byhour)
    if (compare(next, current) !== 0) {
      return next
    }
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
  let current = skipAhead(copy(dtstart), options)

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
    // -> minute: 1, second: 1
    //
    // freq = minutely
    // interval = 2
    // bysecond 1, 2
    // dtstart minute: 0, second: 0
    // -> minute: 0, second: 1
    // -> minute: 0, second: 2
    // -> minute: 2, second: 1
    //
    // date = dtstart
    // forever:
    //   advance to all bysteps larger than freq
    //   advance to all bysteps smaller than freq
    //   if bystep at freq, advance to next bystep & advance at larger freq
    //   else, advance at freq
    //   zero out bysteps smaller than freq
    next() {
      do {
        const newCurrent = skipAhead(copy(current), options)
        console.log({ newCurrent, current })
        if (compare(newCurrent, current) === 0) {
          console.log('no change')
          const freqUnit = FREQUENCY_COUNTER[freq]
          const freqUnitIdx = FREQUENCY_ORDER.indexOf(freqUnit)
          if (byRuleAtFreq(options)) {
            const nextLargerUnitIdx = Math.max(0, freqUnitIdx - 1)
            const nextLargerUnit = FREQUENCY_ORDER[nextLargerUnitIdx]
            current = add(current, {
              [nextLargerUnit]: 1
            })
            zeroSmallerUnits(nextLargerUnitIdx, current)
          } else {
            current = add(current, {
              [FREQUENCY_COUNTER[freq]]: interval * (freq === 'WEEKLY' ? 7 : 1)
            })
            zeroSmallerUnits(freqUnitIdx, current)
          }

          current = skipAhead(current, options)
          console.log({ current })
        } else {
          current = newCurrent
        }
      } while (!isRealDate(current))
    },

    get current() {
      return current
    }
  }
}

const byRuleAtFreq = (options: GroomedOptions) => {
  switch (options.freq) {
    case 'MINUTELY':
      return !!options.byminute
    case 'SECONDLY':
      return !!options.bysecond
    default:
      return false
  }
}

const zeroSmallerUnits = (refUnitIdx: number, current: DateTime) => {
  FREQUENCY_ORDER.slice(refUnitIdx + 1).forEach(unit => {
    current[unit] = 0
  })
}
