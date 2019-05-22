import { copy } from '../copy'
import { add } from '../DateTime/add'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { initializeFrom } from './initializeFrom'
import { syncByrule } from './syncByrule'
import { UnitRule } from './types'
import { byRuleForUnit, FREQUENCY_COUNTER, FREQUENCY_ORDER } from './units'

export const syncWithRule = (initial: DateTime, options: GroomedOptions) => {
  let next = copy(initial)
  for (let i = 0; i < FREQUENCY_ORDER.length; i++) {
    const unit = FREQUENCY_ORDER[i]

    const byrule = byRuleForUnit(unit, options)
    const diff = syncByrule(next, byrule)
    const unitDiff = diff[unit]
    next = add(next, diff)

    if (byrule && typeof unitDiff === 'number' && unitDiff < 0) {
      const { nextUnit, interval } = nextUnitToCarry(byrule, options)

      next = add(next, { [nextUnit]: interval })
      next = initializeFrom(next, nextUnit)
      i = FREQUENCY_ORDER.indexOf(nextUnit) - 1
    }
  }

  return next
}

const nextUnitToCarry = (
  byrule: UnitRule,
  options: GroomedOptions
): { nextUnit: keyof DateTime; interval: number } => {
  const freqIdx = FREQUENCY_ORDER.indexOf(FREQUENCY_COUNTER[options.freq])
  const nextByrule = nextUnitForByrule(byrule)
  const nextByruleIdx = FREQUENCY_ORDER.indexOf(nextByrule)

  if (freqIdx === nextByruleIdx) {
    if (options.freq === 'WEEKLY' && nextByrule === 'day') {
      return { nextUnit: 'day', interval: options.interval * 7 }
    }

    return {
      nextUnit: FREQUENCY_COUNTER[options.freq],
      interval: options.interval
    }
  }

  return { nextUnit: nextByrule, interval: 1 }
}

const nextUnitForByrule = (byrule: UnitRule): keyof DateTime => {
  switch (byrule.unit) {
    case 'byyearday':
      return 'year'
    case 'bymonthday':
      return 'month'
    case 'byday':
      return 'month'
    case 'byhour':
      return 'day'
    case 'byminute':
      return 'hour'
    case 'bysecond':
      return 'minute'
    default:
      return 'second'
  }
}
