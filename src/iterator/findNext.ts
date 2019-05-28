import { DateTime } from '../DateTime'
import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { GroomedOptions } from '../groomOptions'
import { syncWithRule } from './syncWithRule'
import { FREQUENCY_COUNTER, FREQUENCY_ORDER } from './units'

export const findNext = (initial: DateTime, options: GroomedOptions) => {
  let unitIdx = FREQUENCY_ORDER.length - 1

  let next: DateTime = syncWithRule(initial, options)
  if (compare(initial, next) < 0) {
    return next
  }

  const unit = FREQUENCY_ORDER[unitIdx]
  const interval =
    unit === FREQUENCY_COUNTER[options.freq] ? options.interval : 1

  next = add(next, { [unit]: interval })
  next = syncWithRule(next, options)

  return next
}
