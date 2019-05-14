import { DateTime } from '../DateTime/index'
import { set } from '../DateTime/set'
import { Weekday } from '../types'
import { days, dayOfYear, dayOrdinalOfWeek } from '../DateTime/dayOfWeek'
import { add } from '../DateTime/add'
import { GroomedOptions } from '../groomOptions'
import { compare } from '../DateTime/compare'
import { copy } from '../copy'

export const skipBy = (unit: keyof DateTime) => (
  current: DateTime,
  stops: number[]
) => {
  for (let i = 0; i < stops.length; i++) {
    if (current[unit] < stops[i]) {
      return set(current, unit, stops[i])
    }
  }

  return set(current, unit, stops[stops.length - 1])
}

const nextSecond = skipBy('second')
const nextMinute = skipBy('minute')
const nextHour = skipBy('hour')
const nextMonthday = skipBy('day')
const nextMonth = skipBy('month')

export const nextDay = (current: DateTime, stops: Weekday[]) => {
  const currentDayOfWeekIdx = dayOrdinalOfWeek(current)

  for (let i = 0; i < stops.length; i++) {
    const daydiff = days.indexOf(stops[i]) - currentDayOfWeekIdx
    if (daydiff > 0) {
      return add(current, { day: daydiff })
    }
  }

  return current
}

const nextYearday = (current: DateTime, stops: number[]) => {
  const currentDayOfYear = dayOfYear(current)

  for (let i = 0; i < stops.length; i++) {
    if (currentDayOfYear <= stops[i]) {
      const newCurrent = copy(current)
      newCurrent.month = 1
      newCurrent.day = 0
      return add(newCurrent, { day: stops[i] })
    }
  }

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
    const next = nextDay(current, options.byday)
    if (compare(next, current) !== 0) {
      return next
    }
  }

  if (options.bymonthday) {
    const next = nextMonthday(current, options.bymonthday)
    if (compare(next, current) !== 0) {
      return next
    }
  }

  if (options.bymonth) {
    const next = nextMonth(current, options.bymonth)
    if (compare(next, current) !== 0) {
      return next
    }
  }

  if (options.byyearday) {
    const next = nextYearday(current, options.byyearday)
    if (compare(next, current) !== 0) {
      return next
    }
  }

  return current
}
