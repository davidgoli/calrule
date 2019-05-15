import { compare } from '../DateTime/compare'
import { isRealDate } from '../DateTime/isValidDate'
import { GroomedOptions } from '../groomOptions'
import { skipAhead } from './skipAhead'
import { smallestTickUnit } from './units'
import { findNext } from './findNext'

export const makeIterator = (options: GroomedOptions) => {
  const { dtstart, count, until } = options
  const baseUnit = smallestTickUnit(options)
  let current = skipAhead(dtstart, options)

  return {
    hasNext(length: number) {
      return (
        (typeof count === 'number' && length < count) ||
        (typeof until !== 'undefined' && compare(until, current) >= 0)
      )
    },

    next() {
      do {
        current = findNext(current, baseUnit, options)
      } while (!isRealDate(current))
      console.log('NEW CURRENT', current)
    },

    get current() {
      return current
    }
  }
}
