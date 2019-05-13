import { Weekday } from '../types'
import { DateTime } from './index'
import { toMillis } from './toMillis'

export const days: Weekday[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

export const dayOfWeek = (d: DateTime) => {
  const day = new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay()
  return days[day]
}

export const dayOfYear = (d: DateTime) =>
  (toMillis(d) -
    toMillis({
      year: d.year,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0
    })) /
    (60 * 60 * 24 * 1000) +
  1
