import { copy } from '../copy'
import { DateTime } from './index'

export const set = (d: DateTime, unit: keyof DateTime, value: number) => {
  const newD = copy(d)
  newD[unit] = value
  return newD
}
