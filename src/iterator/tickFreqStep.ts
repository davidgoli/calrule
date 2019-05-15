import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { FREQUENCY_ORDER, smallestTickUnit, byRuleForUnit } from './units'
import { add } from '../DateTime/add'
import { firstWeekdayOfMonth } from '../DateTime/dayOfWeek'
import { Weekday } from '../types'
import { tickByrule } from './tickByrule'
import { compare } from '../DateTime/compare'

export const tickFreqStep = (
  current: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  let next = add(current, {
    [unit]: (options.interval || 1) * (options.freq === 'WEEKLY' ? 7 : 1)
  })

  console.log({ next })
  const byrule = byRuleForUnit(unit, options)
  if (byrule) {
    next = tickByrule(next, unit, options)
    if (compare(next, current) === 0) {
      const higherUnit = FREQUENCY_ORDER[FREQUENCY_ORDER.indexOf(unit) - 1]
      next = tickFreqStep(current, higherUnit, options)
    }
  }

  console.log({ byrule: next[unit] })

  const unitIdx = FREQUENCY_ORDER.indexOf(unit)
  FREQUENCY_ORDER.slice(
    unitIdx + 1,
    FREQUENCY_ORDER.indexOf(smallestTickUnit(options)) + 1
  ).forEach(unit => {
    next[unit] = nextValueForUnit(unit, options, next)
    console.log('newCurrent unit', unit, current[unit], next[unit])
  })

  return next
}

const nextValueForUnit = (
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
