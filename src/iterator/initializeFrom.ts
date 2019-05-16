import { firstWeekdayOfMonth } from '../DateTime/dayOfWeek'
import { DateTime } from '../DateTime/index'
import { set } from '../DateTime/set'
import { GroomedOptions } from '../groomOptions'
import { Weekday } from '../types'
import { byRuleForUnit, FREQUENCY_ORDER, smallestTickUnit } from './units'

const initialValueForUnit = (
  unit: keyof DateTime,
  byrule: number[] | Weekday[] | undefined,
  newCurrent: DateTime
) => {
  if (unit === 'day') {
    return byrule && typeof byrule[0] === 'string'
      ? firstWeekdayOfMonth(newCurrent, (byrule as Weekday[])[0])
      : 1
  }

  if (byrule) {
    return (byrule as number[])[0]
  }
  if (unit === 'month') {
    return 1
  }

  return 0
}

export const initializeFrom = (
  next: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  const unitIdx = FREQUENCY_ORDER.indexOf(unit)
  const smallestUnitIdx = FREQUENCY_ORDER.indexOf(smallestTickUnit(options)) + 1

  FREQUENCY_ORDER.slice(unitIdx + 1, smallestUnitIdx).forEach(unit => {
    const value = initialValueForUnit(unit, byRuleForUnit(unit, options), next)
    console.log({ unit, value })
    next = set(next, unit, value)
  })

  return next
}
