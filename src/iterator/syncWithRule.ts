import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { nextByruleStep } from './nextByruleStep'
import { nextByday } from './nextDay'
import { byRuleForUnit, FREQUENCY_ORDER } from './units'

export const syncWithRule = (current: DateTime, options: GroomedOptions) => {
  let next = current
  FREQUENCY_ORDER.forEach(unit => {
    const byrule = byRuleForUnit(unit, options)
    if (!byrule) {
      return
    }

    let nextUnit: DateTime
    if (unit === 'day') {
      nextUnit = nextByday(next, byrule, options)
    } else {
      nextUnit = nextByruleStep(unit)(next, byrule as number[], false)
    }

    if (compare(nextUnit, next) < 0) {
      const biggerUnit = FREQUENCY_ORDER[FREQUENCY_ORDER.indexOf(unit) - 1]
      nextUnit = syncWithRule(add(nextUnit, { [biggerUnit]: 1 }), options)
    }

    next = nextUnit
  })

  return next
}
