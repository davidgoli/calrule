import { copy } from '../copy'
import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { initializeFrom } from './initializeFrom'
import { shouldRollOver } from './shouldRollOver'
import { syncByrule } from './syncByrule'
import { byRuleForUnit, FREQUENCY_COUNTER } from './units'

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
      console.log({ freq: options.freq })
      next = add(next, { [FREQUENCY_COUNTER[options.freq]]: options.interval })
      next = initializeFrom(next, FREQUENCY_COUNTER[options.freq])
      continue
    }

    console.log({ next })
    next = add(next, { [toRollOver]: 1 })
    const byrule = byRuleForUnit(toRollOver, options)
    const diff = syncByrule(next, byrule)
    next = initializeFrom(next, toRollOver)
    console.log({ toRollOver, byrule, diff })
    // const unitDiff = diff[toRollOver]
    next = add(next, diff)
    console.log({ initial, next })
  } while (compare(initial, next) >= 0 || toRollOver)
  // for (let i = 0; i < FREQUENCY_ORDER.length; i++) {
  //   const unit = FREQUENCY_ORDER[i]

  //   const byrule = byRuleForUnit(unit, options)
  //   const diff = syncByrule(next, byrule)
  //   console.log({ unit, byrule, diff })
  //   const unitDiff = diff[unit]
  //   next = add(next, diff)
  //   console.log({ initial, next, unitDiff })

  //   if (
  //     byrule &&
  //     ((typeof unitDiff === 'number' && unitDiff < 0) ||
  //       compare(next, initial) >= 0)
  //   ) {
  //     const { nextUnit, interval } = nextUnitToCarry(byrule, options)
  //     console.log({ nextUnit, interval })

  //     next = add(next, { [nextUnit]: interval })
  //     next = initializeFrom(next, nextUnit)
  //     i = Math.max(0, FREQUENCY_ORDER.indexOf(nextUnit) - 2)
  //   } else if (compare(next, initial) >= 0) {
  //     i = Math.max(0, i - 2)
  //   }
  // }
  // console.log('compare', compare(next, initial))

  return next
}

// const nextUnitToCarry = (
//   byrule: UnitRule,
//   options: GroomedOptions
// ): { nextUnit: keyof DateTime; interval: number } => {
//   const freqIdx = FREQUENCY_ORDER.indexOf(FREQUENCY_COUNTER[options.freq])
//   const nextByruleUnit = nextUnitForByrule(byrule)
//   const nextByrule = byRuleForUnit(nextByruleUnit, options)
//   const nextByruleIdx = FREQUENCY_ORDER.indexOf(nextByruleUnit)

//   if (freqIdx === nextByruleIdx) {
//     if (options.freq === 'WEEKLY' && nextByruleUnit === 'day' && !nextByrule) {
//       console.log('HIIIIII', byrule, nextByrule)
//       return { nextUnit: 'day', interval: options.interval * 7 }
//     }

//     return {
//       nextUnit: FREQUENCY_COUNTER[options.freq],
//       interval: options.interval
//     }
//   }

//   return { nextUnit: nextByruleUnit, interval: 1 }
// }

// const nextUnitForByrule = (byrule: UnitRule): keyof DateTime => {
//   switch (byrule.unit) {
//     case 'byyearday':
//       return 'year'
//     case 'bymonthday':
//       return 'month'
//     case 'byday':
//       return 'month'
//     case 'byhour':
//       return 'day'
//     case 'byminute':
//       return 'hour'
//     case 'bysecond':
//       return 'minute'
//     default:
//       return 'second'
//   }
// }
