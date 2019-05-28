import { Weekday } from '../types'
import { MONTHS } from './index'
import { DateTime } from './index'
import { toMillis } from './toMillis'

export const WEEKDAYS: Weekday[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

type MONTH_LENGTH = 28 | 29 | 30 | 31

const MONTH_LENGTHS: { [k in MONTHS]: MONTH_LENGTH } = {
  1: 31,
  2: 28,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31
}

const MONTH_LENGTHS_LEAP: { [k in MONTHS]: MONTH_LENGTH } = {
  1: 31,
  2: 29,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31
}

export const dayOrdinalOfWeek = (d: DateTime) => {
  return new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay()
}

export const dayOfWeek = (d: DateTime) => {
  return WEEKDAYS[dayOrdinalOfWeek(d)]
}

export const dayOfMonth = (d: DateTime) => {
  return new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDate()
}

const isLeapYear = (y: number) => {
  if (y % 4 !== 0) {
    return false
  }

  if (y % 100 !== 0) {
    return true
  }

  if (y % 400 !== 0) {
    return false
  }

  return true
}

export const daysInMonth = (m: MONTHS, y: number) =>
  (isLeapYear(y) ? MONTH_LENGTHS_LEAP : MONTH_LENGTHS)[m]

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
  const diff = dayOrdinalDesired - firstOfMonthOrdinal

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

export const diffInDays = (a: DateTime, b: DateTime) => {
  return dayOfYear(a) - dayOfYear(b)
}
