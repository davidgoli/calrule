import { DateTime } from '../DateTime'
import { dayOfWeek, dayOfYear } from '../DateTime/units'
import { GroomedOptions } from '../groomOptions'
import { Weekday } from '../types'
import { byRuleForUnit } from './byRuleForUnit'
import { UNIT_ORDER } from './units'

export const shouldRollOver = (next: DateTime, options: GroomedOptions) => {
  for (let i = UNIT_ORDER.length - 1; i > 0; i--) {
    const unit = UNIT_ORDER[i]
    const unitRule = byRuleForUnit(next, unit, options)
    if (!unitRule || !unitRule.byrule) {
      continue
    }

    const { unit: byruleUnit, byrule } = unitRule

    if (
      byruleUnit === 'byyearday' &&
      (byrule as number[]).indexOf(dayOfYear(next)) !== -1
    ) {
      return undefined
    }

    if (
      byruleUnit !== 'byday' &&
      (byrule as number[]).indexOf(next[unit]) === -1
    ) {
      return unit
    }

    if (
      byruleUnit === 'byday' &&
      (byrule as Weekday[]).indexOf(dayOfWeek(next)) === -1
    ) {
      return unit
    }
  }

  return undefined
}
