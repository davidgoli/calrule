import { DateTime } from './index'

const zeroPad = (n: number, length: number = 2): string => {
  let s = n.toString()
  while (s.length < length) {
    s = '0' + s
  }

  return s
}

export const toISO = ({
  year,
  month,
  day,
  hour,
  minute,
  second
}: DateTime): string => {
  return `${year}-${zeroPad(month)}-${zeroPad(day)}T${zeroPad(hour)}:${zeroPad(
    minute
  )}:${zeroPad(second)}`
}
