import { compare } from '../DateTime/compare'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { advanceByruleAtUnit, advanceFreqUnit } from './advance'
import { syncWithRule } from './syncWithRule'
import { FREQUENCY_COUNTER, FREQUENCY_ORDER, smallestTickUnit } from './units'

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
  const freqIdx = FREQUENCY_ORDER.indexOf(FREQUENCY_COUNTER[options.freq])

  let unitIdx = FREQUENCY_ORDER.indexOf(smallestTickUnit(options))

  let next: DateTime = initial

  do {
    const unit = FREQUENCY_ORDER[unitIdx]
    console.log({ unit, initial })
    if (unitIdx === freqIdx) {
      next = advanceFreqUnit(initial, options)
      continue
    }

    next = advanceByruleAtUnit(initial, unit, options)
    next = syncWithRule(next, options)
    console.log({ initial, next })
  } while (compare(initial, next) >= 0 && --unitIdx >= 0)

  return next
}
