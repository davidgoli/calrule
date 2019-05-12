import { DateTime } from './index'
import { Weekday } from '../types'

const days: Weekday[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']

export const dayOfWeek = (d: DateTime) => {
  const day = new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay()
  return days[day]
}
