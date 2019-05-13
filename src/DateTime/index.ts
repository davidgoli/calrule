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

export type MONTHS = keyof typeof MONTH_LENGTHS

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

export interface DateTime {
  year: number
  month: MONTHS
  day: number
  hour: number
  minute: number
  second: number
}
