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

const tickFreqStep = (
  current: DateTime,
  unitIdx: number,
  options: GroomedOptions
) => {
  let next: DateTime = syncWithRule(current, options)
  if (compare(next, current) !== 0) {
    return next
  }

  do {
    const unit = FREQUENCY_ORDER[unitIdx]
    next = advanceFreq(current, unit, options)
    next = tickByrule(next, unit, options)

    next = syncWithRule(next, options)
    next = initializeFrom(next, unit, options)
  } while (compare(next, current) === 0 && --unitIdx >= 0)

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
      next = tickFreqStep(current, unitIdx, options)
      continue
    }

    next = tickByrule(current, currentUnit, options)
  } while (compare(next, current) === 0 && --unitIdx >= 0)

  return next
}
