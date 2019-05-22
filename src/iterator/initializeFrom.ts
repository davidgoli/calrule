import { DateTime } from '../DateTime/index'
import { set } from '../DateTime/set'
import { FREQUENCY_ORDER } from './units'

const initialValueForUnit = (unit: keyof DateTime) => {
  if (unit === 'month' || unit === 'day') {
    return 1
  }

  return 0
}

export const initializeFrom = (next: DateTime, unit: keyof DateTime) => {
  const unitIdx = FREQUENCY_ORDER.indexOf(unit)
  const smallestUnitIdx = FREQUENCY_ORDER.length - 1

  FREQUENCY_ORDER.slice(unitIdx + 1, smallestUnitIdx + 1).forEach(unit => {
    const value = initialValueForUnit(unit)
    next = set(next, unit, value)
  })

  return next
}
