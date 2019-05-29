import { copy } from '../copy'
import { DateTime } from '../DateTime'
import { add } from '../DateTime/add'
import { GroomedOptions } from '../groomOptions'
import { advanceUnit } from './advance'
import { diffToNextUnitRule } from './diffToNextUnitRule'
import { initializeSmallerUnits } from './initializeSmallerUnits'
import { shouldRollOver } from './shouldRollOver'
import { byRuleForUnit, nextLargerUnit } from './units'

const diffToNextByruleValue = (
  next: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  const byrule = byRuleForUnit(unit, options)
  return byrule ? diffToNextUnitRule(next, byrule) : {}
}

export const syncWithRule = (initial: DateTime, options: GroomedOptions) => {
  let next = copy(initial)
  let unit: keyof DateTime | undefined

  while ((unit = shouldRollOver(next, options))) {
    let unitDiff: number | undefined = 0

    do {
      next = advanceUnit(next, unit, options)
      next = initializeSmallerUnits(next, unit)

      const diff = diffToNextByruleValue(next, unit, options)

      next = add(next, diff)
      unitDiff = diff[unit]

      unit = nextLargerUnit(unit)
    } while (unitDiff && unitDiff < 0)
  }

  return next
}
