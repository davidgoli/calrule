import { DateTime } from "./parseISO"

export const add = (base: DateTime, addend: DateTime): DateTime => {
  const { minute: minuteRemainder, second } = addSecond(
    base.second,
    addend.second
  )

  return {
    year: base.year + addend.year,
    month: base.month + addend.month,
    day: base.day + addend.day,
    hour: base.hour + addend.hour,
    minute: base.minute + addend.minute + minuteRemainder,
    second
  }
}

const addSecond = (s1: number, s2: number) => {
  const newSeconds = s1 + s2
  const minute = Math.floor(newSeconds / 60)
  const second = newSeconds % 60

  return {
    minute,
    second
  }
}
