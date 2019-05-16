import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { firstWeekdayOfMonth } from '../DateTime/dayOfWeek'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { Weekday } from '../types'
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

export const tickFreqStep = (
  current: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  let next: DateTime
  if (options.freq === 'WEEKLY') {
    next = advanceToNextWkst(current, options)
  } else {
    next = add(current, {
      [unit]: options.interval || 1
    })
  }

  const byrule = byRuleForUnit(unit, options)
  if (byrule) {
    next = tickByrule(next, unit, byrule)
  }

  if (compare(next, current) === 0) {
    const higherUnit = FREQUENCY_ORDER[FREQUENCY_ORDER.indexOf(unit) - 1]
    next = tickFreqStep(current, higherUnit, options)
  }

  next = syncWithRule(next, options)

  const unitIdx = FREQUENCY_ORDER.indexOf(unit)
  FREQUENCY_ORDER.slice(
    unitIdx + 1,
    FREQUENCY_ORDER.indexOf(smallestTickUnit(options)) + 1
  ).forEach(unit => {
    next[unit] = initialValueForUnit(unit, options, next)
  })

  return next
}

const initialValueForUnit = (
  unit: keyof DateTime,
  options: GroomedOptions,
  newCurrent: DateTime
) => {
  const byrule = byRuleForUnit(unit, options)
  if (unit === 'day') {
    return firstWeekdayOfMonth(newCurrent, (byrule as Weekday[])[0])
  } else if (byrule) {
    return (byrule as number[])[0]
  } else {
    return 0
  }
}

const advanceToNextWkst = (d: DateTime, options: GroomedOptions) => {
  if (options.byday) {
    return add(d, { day: options.interval })
  }

  return add(d, { day: options.interval * 7 })
}
