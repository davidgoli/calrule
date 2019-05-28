import { Weekday } from '../types'
import { DateTime, daysInMonth } from './index'
import { set } from './set'
import { toMillis } from './toMillis'

export const WEEKDAYS: Weekday[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

export const dayOrdinalOfWeek = (d: DateTime) => {
  return new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay()
}

export const dayOfWeek = (d: DateTime) => {
  return WEEKDAYS[dayOrdinalOfWeek(d)]
}

export const dayOfMonth = (d: DateTime) => {
  return new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDate()
}

export const firstWeekdayOfMonth = (d: DateTime, day: Weekday) => {
  const firstOfMonthOrdinal = dayOrdinalOfWeek({
    year: d.year,
    month: d.month,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  })

  const dayOrdinalDesired = WEEKDAYS.indexOf(day)
  let diff = dayOrdinalDesired - firstOfMonthOrdinal
  while (diff < d.day - 1) {
    diff += 7
  }

  return diff + 1
}

export const dayOfYear = (d: DateTime) =>
  (toMillis(d) -
    toMillis({
      year: d.year,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0
    })) /
    (60 * 60 * 24 * 1000) +
  1

export const weekdaysInMonthByRule = (d: DateTime, byday: Weekday[]) => {
  const len = daysInMonth(d.month, d.year)
  const days: number[] = []

  for (let i = 1; i <= len; i++) {
    const date = set(d, 'day', i)
    if (byday.indexOf(dayOfWeek(date)) !== -1) {
      days.push(i)
    }
  }

  return days
}

export const diffInDays = (a: DateTime, b: DateTime) => {
  return dayOfYear(a) - dayOfYear(b)
}
