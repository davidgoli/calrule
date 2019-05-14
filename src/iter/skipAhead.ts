import { DateTime } from '../DateTime/index'
import { set } from '../DateTime/set'
import { Weekday } from '../types'
import { dayOfWeek, days, dayOfYear } from '../DateTime/dayOfWeek'
import { add } from '../DateTime/add'
import { GroomedOptions } from '../groomOptions'
import { compare } from '../DateTime/compare'

export const skipBy = (unit: keyof DateTime) => (
  current: DateTime,
  stops: number[]
) => {
  for (let i = 0; i < stops.length; i++) {
    if (current[unit] < stops[i]) {
      return set(current, unit, stops[i])
    }
  }

  // const currentUnitIndex = FREQUENCY_ORDER.indexOf(unit)
  // const nextUnitIndex = Math.max(currentUnitIndex - 1, 0)
  // const nextUnit = FREQUENCY_ORDER[nextUnitIndex]

  // console.log({ unit, nextUnit })
  // current = add(current, { [nextUnit]: interval })
  // current[unit] = stops[0]

  return set(current, unit, stops[stops.length - 1])
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

export const skipAhead = (current: DateTime, options: GroomedOptions) => {
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
