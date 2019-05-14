import { compare } from '../DateTime/compare'
import { DateTime } from '../DateTime/index'
import { isRealDate } from '../DateTime/isValidDate'
import { GroomedOptions } from '../groomOptions'
import { skipAhead } from './skipAhead'
import { smallestTickUnit, FREQUENCY_ORDER, FREQUENCY_COUNTER } from './units'
import { tickByrule, tick } from './tick'

export const makeIterator = (options: GroomedOptions) => {
  const { dtstart, count, until, freq } = options
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
        const unit = smallestTickUnit(options)
        let unitIdx = FREQUENCY_ORDER.indexOf(unit)
        const freqIdx = FREQUENCY_ORDER.indexOf(FREQUENCY_COUNTER[freq])

        let newCurrent: DateTime
        do {
          if (unitIdx > freqIdx) {
            newCurrent = tickByrule(current, unit, options)
          } else {
            newCurrent = tick(
              current,
              FREQUENCY_ORDER[Math.max(0, unitIdx)],
              options
            )
          }

          unitIdx -= 1
        } while (compare(newCurrent, current) === 0 && unitIdx > 0)

        current = newCurrent
      } while (!isRealDate(current))
      console.log('NEW CURRENT', current)
    },

    get current() {
      return current
    }
  }
}
