import { firstWeekdayOfMonth } from '../DateTime/dayOfWeek'
import { DateTime } from '../DateTime/index'
import { set } from '../DateTime/set'
import { GroomedOptions } from '../groomOptions'
import { Weekday } from '../types'
import { UnitRule } from './types'
import {
  byRuleForUnit,
  FREQUENCY_ORDER,
  smallestTickUnit,
  FREQUENCY_COUNTER
} from './units'

const initialValueForUnit = (
  unit: keyof DateTime,
  unitRule: UnitRule | undefined,
  newCurrent: DateTime
) => {
  const byrule = unitRule ? unitRule.byrule : undefined
  if (unit === 'day' && byrule && typeof byrule[0] === 'string') {
    return firstWeekdayOfMonth(newCurrent, (byrule as Weekday[])[0])
  }

  if (byrule) {
    return (byrule as number[])[0]
  }

  if (unit === 'month' || unit === 'day') {
    return 1
  }

  return 0
}

export const initializeFrom = (
  initial: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  const unitIdx = FREQUENCY_ORDER.indexOf(unit)
  const smallestUnitIdx = FREQUENCY_ORDER.indexOf(smallestTickUnit(options))

  let next = initial
  FREQUENCY_ORDER.slice(unitIdx + 1, smallestUnitIdx + 1).forEach(unit => {
    const value = initialValueForUnit(unit, byRuleForUnit(unit, options), next)
    next = set(next, unit, value)
  })

  return next
}
