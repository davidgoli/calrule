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

  return {
    year: base.year + (addend.year || 0),
    month: base.month + (addend.month || 0),
    day: base.day + (addend.day || 0) + dayRemainder,
    hour,
    minute,
    second
  }
}

const divmod = (s: number, base: number = 60) => {
  const bigHand = Math.floor(s / base)
  const littleHand = s % base

  return [bigHand, littleHand]
}
