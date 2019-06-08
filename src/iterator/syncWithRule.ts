import { copy } from '../copy'
import { DateTime } from '../DateTime'
import { add } from '../DateTime/add'
import { ByProperty, GroomedOptions } from '../groomOptions'
import { advanceUnit } from './advance'
import { byRuleForUnit } from './byRuleForUnit'
import { diffToNextUnitRule } from './diffToNextUnitRule'
import { initializeSmallerUnits } from './initializeSmallerUnits'
import { shouldRollOver } from './shouldRollOver'
import { nextLargerUnit, unitForByrule } from './units'

const diffToNextByruleValue = (
  next: DateTime,
  byprop: ByProperty,
  options: GroomedOptions
) => {
  const byrule = byRuleForUnit(next, byprop, options)
  return byrule ? diffToNextUnitRule(next, byrule) : {}
}

export const syncWithRule = (initial: DateTime, options: GroomedOptions) => {
  let next = copy(initial)
  let byprop: ByProperty | undefined

  while ((byprop = shouldRollOver(next, options))) {
    let unit = unitForByrule[byprop]
    let diffValues: number[]
    if (unit === 'day') console.log({ byprop, unit })

    do {
      next = advanceUnit(next, unit, options)
      next = initializeSmallerUnits(next, unit)

      const diff = diffToNextByruleValue(next, byprop, options)

      next = add(next, diff)
      diffValues = Object.values(diff)
      if (unit === 'day' || Object.keys(diff).indexOf('day') !== -1)
        console.log({ unit, diff, diffValues })

      unit = nextLargerUnit(unit)
    } while (diffValues.length > 0 && diffValues[0] < 0)
  }

  return next
}
