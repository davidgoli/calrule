import { copy } from '../copy'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { nextByruleStep } from './nextByruleStep'
import { nextDay } from './nextDay'
import { byRuleForUnit, FREQUENCY_ORDER } from './units'

export const syncWithRule = (current: DateTime, options: GroomedOptions) => {
  let next = copy(current)
  FREQUENCY_ORDER.forEach(unit => {
    const byrule = byRuleForUnit(unit, options)
    if (!byrule) {
      return
    }

    if (unit === 'day') {
      next = nextDay(next, byrule, options)
    } else {
      next = nextByruleStep(unit)(next, byrule as number[], false)
    }
  })

  return next
}
