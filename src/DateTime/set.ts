import { copy } from '../copy'
import { DateTime, MONTHS } from './index'

export const set = (d: DateTime, unit: keyof DateTime, value: number) => {
  const newD = copy(d)
  if (unit === 'month') {
    newD.month = value as MONTHS
  } else {
    newD[unit] = value
  }
  return newD
}
