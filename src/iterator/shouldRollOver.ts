import { compare } from '../DateTime/compare'
import { dayOfWeek, dayOfYear } from '../DateTime/dayOfWeek'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { Weekday } from '../types'
import { byRuleForUnit, FREQUENCY_ORDER } from './units'

export const shouldRollOver = (
  next: DateTime,
  initial: DateTime,
  options: GroomedOptions
) => {
  for (let i = FREQUENCY_ORDER.length - 1; i > 0; i--) {
    const unit = FREQUENCY_ORDER[i]
    const unitRule = byRuleForUnit(unit, options)
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

  if (compare(initial, next) > 0) {
    return 'freq'
  }

  return undefined
}
