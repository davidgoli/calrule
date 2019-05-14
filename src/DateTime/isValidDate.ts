import { DateTime, daysInMonth } from './index'
import { inRange } from './inRange'

export const isValidDate = (iso8601: string | undefined): iso8601 is string =>
  typeof iso8601 !== 'undefined' && !isNaN(new Date(iso8601).getTime())

export const isRealDate = (date: DateTime | undefined) =>
  !!date &&
  inRange(date.second, 0, 59) &&
  inRange(date.minute, 0, 59) &&
  inRange(date.hour, 0, 23) &&
  inRange(date.day, 0, daysInMonth(date.month, date.year)) &&
  inRange(date.month, 1, 12)
