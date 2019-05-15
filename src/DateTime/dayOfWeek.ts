import { Weekday } from '../types'
import { DateTime } from './index'
import { toMillis } from './toMillis'

export const days: Weekday[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

export const dayOrdinalOfWeek = (d: DateTime) => {
  return new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay()
}

export const dayOfWeek = (d: DateTime) => {
  return days[dayOrdinalOfWeek(d)]
}

export const dayOfMonth = (d: DateTime) => {
  return new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDate()
}

export const lengthOfMonth = (d: DateTime) => {
  return new Date(Date.UTC(d.year, d.month, 0)).getDate()
}

export const firstWeekdayOfMonth = (d: DateTime, day: Weekday) => {
  const firstOfMonthOrdinal = dayOrdinalOfWeek({
    year: d.year,
    month: d.month,
    day: d.day,
    hour: 0,
    minute: 0,
    second: 0
  })

  const dayOrdinalDesired = days.indexOf(day)
  let diff = dayOrdinalDesired - firstOfMonthOrdinal
  while (diff < d.day) {
    diff += 7
  }

  return diff
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
