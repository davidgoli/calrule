import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { initializeFrom } from './initializeFrom'
import { nextByday } from './nextByday'
import { nextByruleStep } from './nextByruleStep'
import { syncWithRule } from './syncWithRule'
import {
  byRuleForUnit,
  FREQUENCY_COUNTER,
  FREQUENCY_ORDER,
  smallestTickUnit
} from './units'

const tickByrule = (
  d: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  const byrule = byRuleForUnit(unit, options)
  if (!(byrule && byrule.length)) {
    return d
  }

  if (unit === 'day') {
    return nextByday(d, byrule, options)
  }

  return nextByruleStep(unit)(d, byrule as number[])
}

const advanceToNextWkst = (d: DateTime, options: GroomedOptions) => {
  if (options.byday) {
    return add(d, { day: options.interval })
  }

  return add(d, { day: options.interval * 7 })
}

const tickFreqStep = (
  current: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  let next: DateTime = syncWithRule(current, options)
  if (compare(next, current) !== 0) {
    return next
  }

  if (options.freq === 'WEEKLY') {
    next = advanceToNextWkst(current, options)
  } else {
    next = add(current, {
      [unit]: options.interval || 1
    })
    next = initializeFrom(next, unit, options)
  }

  next = tickByrule(next, unit, options)

  if (compare(next, current) === 0) {
    const higherUnit = FREQUENCY_ORDER[FREQUENCY_ORDER.indexOf(unit) - 1]
    next = tickFreqStep(current, higherUnit, options)
  }

  next = syncWithRule(next, options)
  next = initializeFrom(next, unit, options)

  return next
}

export const findNext = (current: DateTime, options: GroomedOptions) => {
  const { freq } = options
  const baseUnit = smallestTickUnit(options)

  let unitIdx = FREQUENCY_ORDER.indexOf(baseUnit)
  const freqIdx = FREQUENCY_ORDER.indexOf(FREQUENCY_COUNTER[freq])
  let next: DateTime = current

  do {
    const currentUnit = FREQUENCY_ORDER[unitIdx]
    if (unitIdx === freqIdx) {
      next = tickFreqStep(current, currentUnit, options)
      continue
    }

    next = tickByrule(current, currentUnit, options)
  } while (compare(next, current) === 0 && unitIdx-- > 0)

  return next
}
