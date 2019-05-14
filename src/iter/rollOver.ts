import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { FREQUENCY_ORDER, smallestTickUnit, byRuleForUnit } from './units'
import { add } from '../DateTime/add'

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
    newCurrent[unit] = (byRuleForUnit(unit, options) || [])[0] || 0
    console.log('newCurrent unit', unit, current[unit], newCurrent[unit])
  })

  return newCurrent
}
