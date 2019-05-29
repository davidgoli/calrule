import { DateTime } from '../DateTime'
import { add } from '../DateTime/add'
import { compare } from '../DateTime/compare'
import { GroomedOptions } from '../groomOptions'
import { syncWithRule } from './syncWithRule'

export const findNext = (initial: DateTime, options: GroomedOptions) => {
  let next = syncWithRule(initial, options)
  if (compare(initial, next) < 0) {
    return next
  }

  next = add(next, {
    second: options.freq === 'SECONDLY' ? options.interval : 1
  })

  return syncWithRule(next, options)
}
