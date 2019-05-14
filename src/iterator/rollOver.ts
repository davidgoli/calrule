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
  const newCurrent = add(current, {
    [FREQUENCY_ORDER[refUnitIdx]]:
      (options.interval || 1) * (options.freq === 'WEEKLY' ? 7 : 1)
  })

  FREQUENCY_ORDER.slice(
    refUnitIdx + 1,
    FREQUENCY_ORDER.indexOf(smallestTickUnit(options)) + 1
  ).forEach(unit => {
    const byrule = byRuleForUnit(unit, options)
    if (unit === 'day') {
      newCurrent[unit] = firstWeekdayOfMonth(
        newCurrent,
        (byrule as Weekday[])[0]
      )
    } else {
      newCurrent[unit] = ((byrule as number[]) || [])[0] || 0
    }
    console.log('newCurrent unit', unit, current[unit], newCurrent[unit])
  })

  return newCurrent
}
