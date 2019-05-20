import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { initializeFrom } from './initializeFrom'
import { nextByrule } from './nextByruleStep'
import {
  byRuleForUnit,
  FREQUENCY_COUNTER,
  FREQUENCY_ORDER,
  minFreqUnit
} from './units'

export const syncWithRule = (initial: DateTime, options: GroomedOptions) => {
  let next = initial
  FREQUENCY_ORDER.forEach(unit => {
    const byrule = byRuleForUnit(unit, options)
    if (!byrule) {
      return
    }

    let nextUnit: DateTime = nextByrule(next, byrule, false)

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
  const { interval } = options
  const freqUnit = minFreqUnit(options)
  const freqDiff = after[freqUnit] - before[freqUnit]

  if (freqDiff <= 0 || freqDiff === interval) {
    return after
  }

  let adjusted = add(before, { [freqUnit]: interval })

  return initializeFrom(adjusted, freqUnit, options)
}
