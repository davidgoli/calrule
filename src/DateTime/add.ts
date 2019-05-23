import { DateTime, DateTimeDiff, daysInMonth, MONTHS } from './index'

const divmod = (n: number, base: number = 60) => {
  const bigHand = Math.floor(n / base)
  const littleHand = n % base

  return [bigHand, littleHand]
}

const divmodMonths = (d: number, m: MONTHS, y: number) => {
  let monthLength: number
  let monthRemainder = 0
  while (((monthLength = daysInMonth(m, y)), d >= monthLength)) {
    m += 1
    monthRemainder += 1
    d -= monthLength
  }

  return [monthRemainder, d]
}

export const add = (base: DateTime, addend: DateTimeDiff): DateTime => {
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
    month: (month + 1) as MONTHS,
    day: day + 1,
    hour,
    minute,
    second
  }
}
