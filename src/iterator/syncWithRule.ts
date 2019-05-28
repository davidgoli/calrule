import { copy } from '../copy'
import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { DateTime, DateTimeDiff } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { initializeFrom } from './initializeFrom'
import { shouldRollOver } from './shouldRollOver'
import { syncByrule } from './syncByrule'
import { byRuleForUnit, FREQUENCY_COUNTER, FREQUENCY_ORDER } from './units'

export const syncWithRule = (initial: DateTime, options: GroomedOptions) => {
  let safety = 0
  let next = copy(initial)
  let toRollOver: keyof DateTime | 'freq' | undefined

  do {
    if (safety++ > 100) {
      throw new Error('INFINITE LOOP')
    }

    toRollOver = shouldRollOver(next, initial, options)
    if (!toRollOver) {
      break
    }

    if (toRollOver === 'freq') {
      next = add(next, { [FREQUENCY_COUNTER[options.freq]]: options.interval })
      next = initializeFrom(next, FREQUENCY_COUNTER[options.freq])
      continue
    }

    let diff: DateTimeDiff
    let diffValue: number | undefined = 0
    do {
      if (safety++ > 100) {
        throw new Error('INFINITE LOOP')
      }
      const base =
        toRollOver === 'day' && options.freq === 'WEEKLY' && !options.byday
          ? 7
          : 1
      const interval =
        toRollOver === FREQUENCY_COUNTER[options.freq] ? options.interval : 1

      next = add(next, { [toRollOver]: base * interval })
      const byrule = byRuleForUnit(toRollOver, options)
      diff = syncByrule(next, byrule)
      next = initializeFrom(next, toRollOver)
      next = add(next, diff)
      diffValue = diff[toRollOver]
      if (typeof diffValue === 'number' && diffValue < 0) {
        toRollOver = FREQUENCY_ORDER[FREQUENCY_ORDER.indexOf(toRollOver) - 1]
      }
    } while (typeof diffValue === 'number' && diffValue < 0)
    toRollOver = shouldRollOver(next, initial, options)
  } while (compare(initial, next) >= 0 || toRollOver)

  return next
}
