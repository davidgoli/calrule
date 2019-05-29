import { DateTime } from '../DateTime'
import { set } from '../DateTime/set'
import { Unit } from './types'
import { UNIT_ORDER } from './units'

const initialValueForUnit = (unit: Unit) => {
  if (unit === 'month' || unit === 'day') {
    return 1
  }

  return 0
}

export const initializeSmallerUnits = (next: DateTime, unit: Unit) => {
  const unitIdx = UNIT_ORDER.indexOf(unit)
  const smallestUnitIdx = UNIT_ORDER.length - 1

  UNIT_ORDER.slice(unitIdx + 1, smallestUnitIdx + 1).forEach(unit => {
    const value = initialValueForUnit(unit)
    next = set(next, unit, value)
  })

  return next
}
