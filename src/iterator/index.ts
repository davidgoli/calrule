import { compare } from '../DateTime/compare'
import { isRealDate } from '../DateTime/isValidDate'
import { GroomedOptions } from '../groomOptions'
import { findNext } from './findNext'
import { syncWithRule } from './syncWithRule'

export const makeIterator = (options: GroomedOptions) => {
  const { dtstart, count, until } = options
  let current = syncWithRule(dtstart, options)
  console.log('STARTING CURRENT', current)

  return {
    hasNext(length: number) {
      return (
        (typeof count === 'number' && length < count) ||
        (typeof until !== 'undefined' && compare(until, current) >= 0)
      )
    },

    next() {
      do {
        current = findNext(current, options)
      } while (!isRealDate(current))
      console.log('NEW CURRENT', current)
    },

    get current() {
      return current
    }
  }
}
