import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { FREQUENCY_ORDER, smallestTickUnit, byRuleForUnit } from './units'
import { add } from '../DateTime/add'
import { firstWeekdayOfMonth } from '../DateTime/dayOfWeek'
import { Weekday } from '../types'

export const rollOver = (
  current: DateTime,
  refUnitIdx: number,
  options: GroomedOptions
) => {
  const unit = FREQUENCY_ORDER[refUnitIdx]
  const newCurrent = add(current, {
    [unit]: (options.interval || 1) * (options.freq === 'WEEKLY' ? 7 : 1)
  })

  const byrule = byRuleForUnit(unit, options)
  if (byrule) {
    newCurrent[unit] = nextValueForUnit(unit, options, newCurrent)
  }

  FREQUENCY_ORDER.slice(
    refUnitIdx + 1,
    FREQUENCY_ORDER.indexOf(smallestTickUnit(options)) + 1
  ).forEach(unit => {
    newCurrent[unit] = nextValueForUnit(unit, options, newCurrent)
    console.log('newCurrent unit', unit, current[unit], newCurrent[unit])
  })

  return newCurrent
}

const nextValueForUnit = (
  unit: keyof DateTime,
  options: GroomedOptions,
  newCurrent: DateTime
) => {
  const byrule = byRuleForUnit(unit, options)
  if (unit === 'day') {
    return firstWeekdayOfMonth(newCurrent, (byrule as Weekday[])[0])
  } else if (byrule) {
    return (byrule as number[])[0]
  } else {
    return 0
  }
}
