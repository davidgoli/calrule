import { copy } from '../copy'
import { DateTime, DateTimeDiff } from '../DateTime'
import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { dayOfWeek, dayOrdinalOfWeek } from '../DateTime/units'
import { GroomedOptions } from '../groomOptions'
import { initializeFrom } from './initializeFrom'
import { shouldRollOver } from './shouldRollOver'
import { syncByrule } from './syncByrule'
import { byRuleForUnit, FREQUENCY_COUNTER, FREQUENCY_ORDER } from './units'

export const syncWithRule = (initial: DateTime, options: GroomedOptions) => {
  let next = copy(initial)
  let toRollOver: keyof DateTime | 'freq' | undefined

  do {
    toRollOver = shouldRollOver(next, options)
    if (!toRollOver) {
      break
    }

    let diff: DateTimeDiff
    let diffValue: number | undefined = 0

    do {
      const lastByday = options.byday && options.byday[options.byday.length - 1]
      const wday = dayOfWeek(next)

      const weeklyStride =
        toRollOver === 'day' &&
        options.freq === 'WEEKLY' &&
        (!options.byday || (wday === lastByday && options.interval > 1))

      const base = weeklyStride ? 7 : 1
      const interval =
        toRollOver === FREQUENCY_COUNTER[options.freq] ? options.interval : 1

      const stride =
        base * interval - (weeklyStride ? dayOrdinalOfWeek(next) : 0)
      const byrule1 = byRuleForUnit(toRollOver, options)
      diff = byrule1 ? syncByrule(next, byrule1) : {}

      next = add(next, { [toRollOver]: stride })

      const byrule = byRuleForUnit(toRollOver, options)
      diff = byrule ? syncByrule(next, byrule) : {}
      next = initializeFrom(next, toRollOver)

      next = add(next, diff)
      diffValue = diff[toRollOver]
      if (typeof diffValue === 'number' && diffValue < 0) {
        toRollOver = FREQUENCY_ORDER[FREQUENCY_ORDER.indexOf(toRollOver) - 1]
      }
    } while (typeof diffValue === 'number' && diffValue < 0)

    toRollOver = shouldRollOver(next, options)
  } while (compare(initial, next) >= 0 || toRollOver)

  return next
}
