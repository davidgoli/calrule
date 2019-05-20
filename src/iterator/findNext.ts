import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { dayOfMonth } from '../DateTime/dayOfWeek'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { initializeFrom } from './initializeFrom'
import { nextByrule } from './nextByruleStep'
import { syncWithRule } from './syncWithRule'
import {
  byRuleForUnit,
  FREQUENCY_COUNTER,
  FREQUENCY_ORDER,
  smallestTickUnit
} from './units'

const advanceByruleAtUnit = (
  d: DateTime,
  dtunit: keyof DateTime,
  options: GroomedOptions
) => {
  const unitRule = byRuleForUnit(dtunit, options)
  if (!unitRule) {
    return d
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
  current: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  let { freq, interval } = options
  if (freq === 'WEEKLY') {
    return advanceToNextWkst(current, options)
  }

  if (
    freq === 'YEARLY' &&
    options.bymonthday &&
    dayOfMonth(current) === options.bymonthday[options.bymonthday.length - 1]
  ) {
    unit = 'month'
  }

  if (freq === 'MONTHLY' && options.byday) {
    unit = 'day'
  }

  const next = add(current, {
    [unit]: interval || 1
  })

  return initializeFrom(next, unit, options)
}

const minFreqUnit = (options: GroomedOptions) => {
  if (options.freq === 'MONTHLY' && options.byday) {
    return 'day'
  }

  if (options.freq === 'YEARLY' && options.bymonthday) {
    return 'month'
  }

  return FREQUENCY_COUNTER[options.freq]
}

const advanceFreqUnit = (current: DateTime, options: GroomedOptions) => {
  let unitIdx = FREQUENCY_ORDER.indexOf(minFreqUnit(options))

  let next: DateTime = syncWithRule(current, options)
  if (compare(next, current) !== 0) {
    return next
  }

  do {
    const unit = FREQUENCY_ORDER[unitIdx]
    next = add(next, { [unit]: 1 })

    next = advanceFreq(current, unit, options)
    next = advanceByruleAtUnit(next, unit, options)

    next = syncWithRule(next, options)
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
    next = advanceByruleAtUnit(current, unit, options)
  } while (compare(next, current) === 0 && --unitIdx >= 0)

  return next
}
