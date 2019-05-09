import { DateTime } from "./parseISO"

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
    base.day + dayRemainder + (addend.day || 0),
    base.month as MONTHS
  )

  return {
    year: base.year + (addend.year || 0),
    month: base.month + (addend.month || 0) + monthRemainder,
    day,
    hour,
    minute,
    second
  }
}

const divmod = (n: number, base: number = 60) => {
  const bigHand = Math.floor(n / base)
  const littleHand = n % base

  return [bigHand, littleHand]
}

const divmodMonths = (d: number, m: MONTHS) => {
  const monthLength = MONTH_LENGTHS[m]
  return divmod(d, monthLength)
}

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

type MONTHS = keyof typeof MONTH_LENGTHS
