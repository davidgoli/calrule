import { copy } from '../copy'
import { DateTime } from '../DateTime'
import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { dayOfWeek, dayOrdinalOfWeek } from '../DateTime/units'
import { GroomedOptions } from '../groomOptions'
import { initializeSmallerUnits } from './initializeSmallerUnits'
import { shouldRollOver } from './shouldRollOver'
import { syncByrule } from './syncByrule'
import { byRuleForUnit, FREQUENCY_COUNTER, FREQUENCY_ORDER } from './units'

const strideToRollover = (
  next: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  const lastByday = options.byday && options.byday[options.byday.length - 1]
  const wday = dayOfWeek(next)

  const weeklyStride =
    unit === 'day' &&
    options.freq === 'WEEKLY' &&
    (!options.byday || (wday === lastByday && options.interval > 1))

  const base = weeklyStride ? 7 : 1
  const interval =
    unit === FREQUENCY_COUNTER[options.freq] ? options.interval : 1

  return base * interval - (weeklyStride ? dayOrdinalOfWeek(next) : 0)
}

const advanceUnit = (
  next: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) =>
  add(next, {
    [unit]: strideToRollover(next, unit, options)
  })

const diffToNextByruleValue = (
  next: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  const byrule = byRuleForUnit(unit, options)
  return byrule ? syncByrule(next, byrule) : {}
}

const nextHigherUnit = (unit: keyof DateTime) =>
  FREQUENCY_ORDER[FREQUENCY_ORDER.indexOf(unit) - 1]

export const syncWithRule = (initial: DateTime, options: GroomedOptions) => {
  let next = copy(initial)
  let unit: keyof DateTime | undefined

  while ((unit = shouldRollOver(next, options))) {
    let unitDiff: number | undefined = 0

    do {
      next = advanceUnit(next, unit, options)
      next = initializeSmallerUnits(next, unit)

      const diff = diffToNextByruleValue(next, unit, options)

      next = add(next, diff)
      unitDiff = diff[unit]

      unit = nextHigherUnit(unit)
    } while (unitDiff && unitDiff < 0)

    if (compare(initial, next) >= 0) {
      break
    }
  }

  return next
}
