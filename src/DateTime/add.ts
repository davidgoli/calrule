import { DateTime } from './index'

const MONTH_LENGTHS = {
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

const MONTH_LENGTHS_LEAP = {
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

type MONTHS = keyof typeof MONTH_LENGTHS

const divmod = (n: number, base: number = 60) => {
  const bigHand = Math.floor(n / base)
  const littleHand = n % base

  return [bigHand, littleHand]
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

const divmodMonths = (d: number, m: MONTHS, y: number) => {
  let monthLength: number
  let monthRemainder = 0
  while (
    ((monthLength = (isLeapYear(y) ? MONTH_LENGTHS_LEAP : MONTH_LENGTHS)[m]),
    d >= monthLength)
  ) {
    m += 1
    monthRemainder += 1
    d -= monthLength
  }

  return [monthRemainder, d]
}

export const add = (base: DateTime, addend: Partial<DateTime>): DateTime => {
  const [minuteRemainder, second] = divmod(base.second + (addend.second || 0))

  const [hourRemainder, minute] = divmod(
    base.minute + minuteRemainder + (addend.minute || 0)
  )

  const [dayRemainder, hour] = divmod(
    base.hour + hourRemainder + (addend.hour || 0),
    24
  )

  const [monthRemainder, day] = divmodMonths(
    base.day + dayRemainder + (addend.day || 0) - 1,
    base.month as MONTHS,
    base.year
  )

  const [yearRemainder, month] = divmod(
    base.month + (addend.month || 0) + monthRemainder - 1,
    12
  )

  const year = base.year + (addend.year || 0) + yearRemainder

  return {
    year,
    month: month + 1,
    day: day + 1,
    hour,
    minute,
    second
  }
}
