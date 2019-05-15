import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { days, firstWeekdayOfMonth } from '../DateTime/dayOfWeek'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { Weekday } from '../types'
import { syncWithRule } from './syncWithRule'
import { tickByrule } from './tickByrule'
import { byRuleForUnit, FREQUENCY_ORDER, smallestTickUnit } from './units'

export const tickFreqStep = (
  current: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  const weeklyByday = options.byday
    ? days.indexOf(options.byday[options.byday.length - 1])
    : 0

  let next: DateTime
  if (options.freq === 'WEEKLY') {
    next = advanceToNextWkst(current, options)
  } else {
    next = add(current, {
      [unit]: options.interval || 1
    })
  }

  next = tickByrule(next, unit, options)

  if (compare(next, current) === 0) {
    const higherUnit = FREQUENCY_ORDER[FREQUENCY_ORDER.indexOf(unit) - 1]
    next = tickFreqStep(current, higherUnit, options)
  }

  next = syncWithRule(next, options)
  console.log({ byrule: next[unit] })

  const unitIdx = FREQUENCY_ORDER.indexOf(unit)
  FREQUENCY_ORDER.slice(
    unitIdx + 1,
    FREQUENCY_ORDER.indexOf(smallestTickUnit(options)) + 1
  ).forEach(unit => {
    next[unit] = initialValueForUnit(unit, options, next)
    console.log('newCurrent unit', unit, current[unit], next[unit])
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
