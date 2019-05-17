import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { initializeFrom } from './initializeFrom'
import { nextByday } from './nextByday'
import { nextByruleStep } from './nextByruleStep'
import { syncWithRule } from './syncWithRule'
import { UnitRule } from './types'
import {
  byRuleForUnit,
  FREQUENCY_COUNTER,
  FREQUENCY_ORDER,
  smallestTickUnit
} from './units'

const advanceByruleAtUnit = (d: DateTime, unitRule: UnitRule) => {
  const { unit, byrule } = unitRule
  if (!(byrule && byrule.length)) {
    return d
  }

  if (unit === 'byday' || unit === 'byyearday' || unit === 'bymonthday') {
    return nextByday(d, unitRule)
  }

  return nextByruleStep(d, { unit, byrule: byrule as number[] })
}

const advanceToNextWkst = (d: DateTime, options: GroomedOptions) => {
  if (options.byday) {
    return add(d, { day: options.interval })
  }

  return add(d, { day: options.interval * 7 })
}

const advanceFreq = (
  current: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  if (options.freq === 'WEEKLY') {
    return advanceToNextWkst(current, options)
  }

  const next = add(current, {
    [unit]: options.interval || 1
  })

  return initializeFrom(next, unit, options)
}

const advanceFreqUnit = (current: DateTime, options: GroomedOptions) => {
  let unitIdx = FREQUENCY_ORDER.indexOf(FREQUENCY_COUNTER[options.freq])

  let next: DateTime = syncWithRule(current, options)
  if (compare(next, current) !== 0) {
    return next
  }

  do {
    const unit = FREQUENCY_ORDER[unitIdx]

    next = advanceFreq(current, unit, options)

    const unitRule = byRuleForUnit(unit, options)
    if (unitRule) {
      next = advanceByruleAtUnit(next, unitRule)
    }

    next = syncWithRule(next, options)
    next = initializeFrom(next, unit, options)
  } while (compare(next, current) === 0 && --unitIdx >= 0)

  return next
}

export const findNext = (current: DateTime, options: GroomedOptions) => {
  const freqIdx = FREQUENCY_ORDER.indexOf(FREQUENCY_COUNTER[options.freq])

  let unitIdx = FREQUENCY_ORDER.indexOf(smallestTickUnit(options))

  let next: DateTime = current

  do {
    if (unitIdx === freqIdx) {
      next = advanceFreqUnit(current, options)
      continue
    }

    const unit = FREQUENCY_ORDER[unitIdx]
    const unitRule = byRuleForUnit(unit, options)
    if (unitRule) {
      next = advanceByruleAtUnit(current, unitRule)
    }
  } while (compare(next, current) === 0 && --unitIdx >= 0)

  return next
}
