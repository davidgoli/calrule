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
        let unitIdx = FREQUENCY_ORDER.length - 1
        let newCurrent: DateTime
        do {
          newCurrent = tick(
            copy(current),
            FREQUENCY_ORDER[Math.max(0, unitIdx)],
            options
          )

          console.log(
            'ticked at',
            FREQUENCY_ORDER[unitIdx],
            {
              newCurrent,
              current
            },
            compare(newCurrent, current)
          )

          unitIdx -= 1
        } while (compare(newCurrent, current) === 0 && unitIdx >= 0)

        current = newCurrent
        console.log('real date', isRealDate(current))
      } while (!isRealDate(current))
      console.log('NEW CURRENT', current)
    },

    get current() {
      return current
    }
  }
}

const tick = (d: DateTime, unit: keyof DateTime, options: GroomedOptions) => {
  const byrule = byRuleForUnit(unit, options)

  if (byrule && byrule.length) {
    console.log('tick at byrule', unit, byrule)
    const newDate = skipBy(unit)(d, byrule)
    console.log({ newDate })

    return newDate
  }

  console.log('tick at freq', options.freq, d)
  const rolledOver = rollOver(d, FREQUENCY_ORDER.indexOf(unit), options)
  console.log({ d, rolledOver })
  return rolledOver
}

const byRuleForUnit = (unit: keyof DateTime, options: GroomedOptions) => {
  switch (unit) {
    case 'hour':
      return options.byhour
    case 'minute':
      return options.byminute
    case 'second':
      return options.bysecond
    default:
      return []
  }
}

const rollOver = (
  current: DateTime,
  refUnitIdx: number,
  options: GroomedOptions
) => {
  const newCurrent = add(current, {
    [FREQUENCY_ORDER[refUnitIdx]]:
      (options.interval || 1) * (options.freq === 'WEEKLY' ? 7 : 1)
  })

  FREQUENCY_ORDER.slice(refUnitIdx + 1).forEach(unit => {
    newCurrent[unit] = (byRuleForUnit(unit, options) || [])[0] || 0
    console.log('newCurrent unit', unit, current[unit], newCurrent[unit])
  })

  return newCurrent
}
