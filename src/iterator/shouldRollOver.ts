import { DateTime } from '../DateTime'
import { dayOfWeek, dayOfYear } from '../DateTime/units'
import { GroomedOptions } from '../groomOptions'
import { Weekday } from '../types'
import { byRuleForUnit } from './byRuleForUnit'
import { BYRULE_ORDER, unitForByrule } from './units'

export const shouldRollOver = (next: DateTime, options: GroomedOptions) => {
  for (let i = BYRULE_ORDER.length - 1; i >= 0; i--) {
    const byprop = BYRULE_ORDER[i]
    const unitRule = byRuleForUnit(next, byprop, options)
    if (!unitRule || !unitRule.byrule) {
      console.log('continuing', byprop)
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
      byruleUnit === 'byweekno' &&
      (byrule as number[]).indexOf(Math.ceil(dayOfYear(next) / 7)) !== -1
    ) {
      return undefined
    }

    if (
      byruleUnit === 'byday' &&
      (byrule as Weekday[]).indexOf(dayOfWeek(next)) === -1
    ) {
      return byprop
    }

    const unit = unitForByrule[byprop]
    if (
      byruleUnit !== 'byday' &&
      (byrule as number[]).indexOf(next[unit]) === -1
    ) {
      // if (unit === 'day') console.log('should roll over', byprop, unit)
      return byprop
    }
  }

  return undefined
}
