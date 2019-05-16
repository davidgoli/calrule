import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { Weekday } from '../types'
import { initializeFrom } from './initializeFrom'
import { nextByruleStep, nextDayStep } from './nextByruleStep'
import { syncWithRule } from './syncWithRule'
import {
  byRuleForUnit,
  FREQUENCY_COUNTER,
  FREQUENCY_ORDER,
  smallestTickUnit
} from './units'

export const findNext = (current: DateTime, options: GroomedOptions) => {
  const { freq } = options
  const baseUnit = smallestTickUnit(options)

  let unitIdx = FREQUENCY_ORDER.indexOf(baseUnit)
  const freqIdx = FREQUENCY_ORDER.indexOf(FREQUENCY_COUNTER[freq])
  let next: DateTime

  do {
    const currentUnit = FREQUENCY_ORDER[unitIdx]

    const byrule = byRuleForUnit(currentUnit, options)

    if (unitIdx === freqIdx) {
      next = tickFreqStep(current, currentUnit, options)
    } else if (byrule) {
      next = tickByrule(current, currentUnit, byrule)
    } else {
      next = current
    }
  } while (compare(next, current) === 0 && unitIdx-- > 0)

  return next
}

const tickByrule = (
  d: DateTime,
  unit: keyof DateTime,
  byrule: number[] | Weekday[]
) => {
  if (byrule && byrule.length) {
    if (unit === 'day') {
      return nextDayStep(d, byrule as Weekday[])
    }

    return nextByruleStep(unit)(d, byrule as number[])
  }

  return d
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
  console.log({ current, next, compare: compare(next, current) })
  if (compare(next, current) !== 0) {
    return next
  }

  if (options.freq === 'WEEKLY') {
    next = advanceToNextWkst(current, options)
  } else {
    console.log({ current })
    next = add(current, {
      [unit]: options.interval || 1
    })
  }

  console.log({ 'after advance': next })
  const byrule = byRuleForUnit(unit, options)
  if (byrule) {
    next = tickByrule(next, unit, byrule)
  }

  console.log({ 'after byrule tick': next })
  if (compare(next, current) === 0) {
    const higherUnit = FREQUENCY_ORDER[FREQUENCY_ORDER.indexOf(unit) - 1]
    next = tickFreqStep(current, higherUnit, options)
  }

  console.log({ 'after recursive freq step': next })
  next = syncWithRule(next, options)

  console.log({ 'after sync with rule': next })
  next = initializeFrom(next, unit, options)

  console.log({ final: next })
  return next
}
