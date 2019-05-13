import { DateTime, MONTHS } from './index'
import { isValidDate } from './isValidDate'

const iso8601Regex = /(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(?:[+-](\d{2}):(\d{2}))?)?/

export const parseISO = (iso8601: string | undefined): DateTime | undefined => {
  if (!isValidDate(iso8601)) {
    return undefined
  }

  const parsed = iso8601Regex.exec(iso8601)
  if (!parsed) {
    return undefined
  }

  const [_, year, month, day, hour, minute, second] = parsed

  return {
    year: parseInt(year, 10),
    month: parseInt(month, 10) as MONTHS,
    day: parseInt(day, 10),
    hour: parseInt(hour, 10) || 0,
    minute: parseInt(minute, 10) || 0,
    second: parseInt(second, 10) || 0
  }
}
