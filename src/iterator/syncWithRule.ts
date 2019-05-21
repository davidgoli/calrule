import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { syncByrule } from './syncByrule'
import { byRuleForUnit, FREQUENCY_COUNTER, FREQUENCY_ORDER } from './units'

export const syncWithRule = (initial: DateTime, options: GroomedOptions) => {
  let next = initial
  FREQUENCY_ORDER.forEach(unit => {
    const byrule = byRuleForUnit(unit, options)
    if (!byrule) {
      return
    }

    let nextUnit: DateTime = syncByrule(next, byrule)

    if (compare(nextUnit, next) < 0) {
      const biggerUnit = FREQUENCY_ORDER[FREQUENCY_ORDER.indexOf(unit) - 1]
      const interval =
        biggerUnit === FREQUENCY_COUNTER[options.freq] ? options.interval : 1

      nextUnit = syncWithRule(
        add(nextUnit, { [biggerUnit]: interval }),
        options
      )
    }

    next = nextUnit
  })

  return next
}
