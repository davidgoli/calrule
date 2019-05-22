import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { syncWithRule } from './syncWithRule'
import { FREQUENCY_ORDER } from './units'

// 2 main operations: advance and sync

// advance:
// 1. Find smallest unit based on byX + freq
// 2a. if unit == freq: increment by interval
// 2b. else: increment by 1
// 3. initialize all smaller units to 1 or 0
// 4. sync with rule options

// sync:
// 1. for each second, minute, hour, day, month, year starting from smallest unit:
//   a. if it is < byX:
//     i. increase to byX
//     ii. done
//   b. else:
//     i. set to byX[0]
//     ii. move to the next bigger unit
export const findNext = (initial: DateTime, options: GroomedOptions) => {
  // const freqIdx = FREQUENCY_ORDER.indexOf(FREQUENCY_COUNTER[options.freq])

  let unitIdx = FREQUENCY_ORDER.length - 1

  let next: DateTime = syncWithRule(initial, options)
  if (compare(initial, next) < 0) {
    return next
  }

  // do {
  // if (unitIdx === freqIdx) {
  //   next = advanceFreqUnit(initial, options)
  //   continue
  // }

  const unit = FREQUENCY_ORDER[unitIdx]
  // if (compare(initial, next) >= 0) {
  next = add(next, { [unit]: 1 })
  // }

  next = syncWithRule(next, options)
  // } while (compare(initial, next) >= 0 && --unitIdx >= 0)

  return next
}
