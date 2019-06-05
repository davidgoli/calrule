import { Weekday } from '../types'
import { DateTime, MONTHS } from './index'
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

export type DateValue = Pick<DateTime, 'year' | 'month' | 'day'>

export const dayOrdinalOfWeek = (d: DateValue) =>
  new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay()

export const dayOfWeek = (d: DateValue) => WEEKDAYS[dayOrdinalOfWeek(d)]

export const dayOfMonth = (d: DateValue) =>
  new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDate()

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

export const daysInYear = (y: number) => (isLeapYear(y) ? 366 : 365)

export const weeksInYear = (y: number) => {
  const isLong =
    dayOfWeek({ year: y, month: 1, day: 1 }) === 'TH' ||
    dayOfWeek({ year: y, month: 12, day: 31 }) === 'TH'
  return 52 + (isLong ? 1 : 0)
}

export const firstWeekdayOfMonth = (y: number, m: MONTHS, day: Weekday) => {
  const firstOfMonthOrdinal = dayOrdinalOfWeek({
    year: y,
    month: m,
    day: 1
  })

  const dayOrdinalDesired = WEEKDAYS.indexOf(day)
  const diff = dayOrdinalDesired - firstOfMonthOrdinal

  return diff + 1
}

export const dayOfYear = (d: DateTime) =>
  Math.floor(
    (toMillis(d) -
      toMillis({
        year: d.year,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0
      })) /
      (60 * 60 * 24 * 1000)
  ) + 1

export const diffInDays = (a: DateTime, b: DateTime) =>
  dayOfYear(a) - dayOfYear(b)
