import { DateTime } from './index'

export const toMillis = (d: DateTime): number =>
  new Date(d.year, d.month - 1, d.day, d.hour, d.minute, d.second, 0).getTime()
