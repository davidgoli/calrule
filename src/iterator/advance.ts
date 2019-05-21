import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { initializeFrom } from './initializeFrom'
import { nextByrule } from './nextByrule'
import { syncWithRule } from './syncWithRule'
import { byRuleForUnit, FREQUENCY_ORDER, minFreqUnit } from './units'

export const advanceByruleAtUnit = (
  d: DateTime,
  dtunit: keyof DateTime,
  options: GroomedOptions
) => {
  const unitRule = byRuleForUnit(dtunit, options)
  if (unitRule && unitRule.unit !== 'byday') {
    d = add(d, { [dtunit]: 1 })
  }
  return nextByrule(d, unitRule)
}

const advanceToNextWkst = (d: DateTime, options: GroomedOptions) => {
  if (options.byday) {
    return add(d, { day: options.interval })
  }

  return add(d, { day: options.interval * 7 })
}

const advanceFreq = (
  initial: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  let { freq, interval } = options
  if (freq === 'WEEKLY') {
    return advanceToNextWkst(initial, options)
  }

  const next = add(initial, {
    [unit]: interval || 1
  })

  return initializeFrom(next, unit, options)
}

export const advanceFreqUnit = (initial: DateTime, options: GroomedOptions) => {
  let unitIdx = FREQUENCY_ORDER.indexOf(minFreqUnit(options))

  let next: DateTime = syncWithRule(initial, options)
  if (compare(next, initial) !== 0) {
    return next
  }

  do {
    const unit = FREQUENCY_ORDER[unitIdx]

    next = advanceFreq(initial, unit, options)

    next = advanceByruleAtUnit(next, unit, options)
    next = syncWithRule(next, options)
  } while (compare(next, initial) === 0 && --unitIdx >= 0)

  return next
}
