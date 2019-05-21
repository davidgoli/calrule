import { copy } from '../copy'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { syncByrule } from './syncByrule'
import { byRuleForUnit, FREQUENCY_ORDER } from './units'

export const syncWithRule = (initial: DateTime, options: GroomedOptions) => {
  let next = copy(initial)
  FREQUENCY_ORDER.forEach(unit => {
    next = syncByrule(next, byRuleForUnit(unit, options))
  })

  return next
}
