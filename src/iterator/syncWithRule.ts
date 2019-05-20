import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { nextByday } from './nextByday'
import { nextByruleStep } from './nextByruleStep'
import {
  byRuleForUnit,
  FREQUENCY_ORDER,
  FREQUENCY_COUNTER,
  smallestTickUnit
} from './units'
import { set } from '../DateTime/set'

export const syncWithRule = (current: DateTime, options: GroomedOptions) => {
  let next = current
  FREQUENCY_ORDER.forEach(unit => {
    const byrule = byRuleForUnit(unit, options)
    if (!byrule) {
      return
    }

    let nextUnit: DateTime
    if (unit === 'day') {
      nextUnit = nextByday(next, byrule, false)
    } else {
      nextUnit = nextByruleStep(next, byrule, false)
    }
    nextUnit = syncWithFreqInterval(nextUnit, nextUnit, options)

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

const syncWithFreqInterval = (
  before: DateTime,
  after: DateTime,
  options: GroomedOptions
) => {
  const { freq, interval } = options
  const freqDiff =
    after[FREQUENCY_COUNTER[freq]] - before[FREQUENCY_COUNTER[freq]]
  if (freqDiff > 0 && freqDiff !== interval) {
    let adjusted = add(before, { [FREQUENCY_COUNTER[freq]]: interval })

    const unitIdx = FREQUENCY_ORDER.indexOf(FREQUENCY_COUNTER[freq])
    const smallestUnitIdx = FREQUENCY_ORDER.indexOf(smallestTickUnit(options))

    FREQUENCY_ORDER.slice(unitIdx + 1, smallestUnitIdx + 1).forEach(unit => {
      adjusted = set(adjusted, unit, 1)
    })

    return syncWithRule(adjusted, options)
  }
  return after
}
