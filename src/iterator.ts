import { copy } from './copy'
import { add } from './DateTime/add'
import { compare } from './DateTime/compare'
import { dayOfWeek, dayOfYear, days } from './DateTime/dayOfWeek'
import { DateTime } from './DateTime/index'
import { isRealDate } from './DateTime/isValidDate'
import { GroomedOptions } from './groomOptions'
import { Frequency, Weekday } from './types'
import { set } from './DateTime/set'
import { skipAhead, skipBy } from './iter/skipAhead'

export const FREQUENCY_COUNTER: { [k in Frequency]: keyof DateTime } = {
  YEARLY: 'year',
  MONTHLY: 'month',
  WEEKLY: 'day',
  DAILY: 'day',
  HOURLY: 'hour',
  MINUTELY: 'minute',
  SECONDLY: 'second'
}

const FREQUENCY_ORDER: (keyof DateTime)[] = [
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second'
]

export const makeIterator = (options: GroomedOptions) => {
  const { dtstart, count, until, freq, interval = 1 } = options
  let current = skipAhead(copy(dtstart), options)

  return {
    hasNext(length: number) {
      return (
        (typeof count === 'number' && length < count) ||
        (typeof until !== 'undefined' && compare(until, current) >= 0)
      )
    },

    // freq = secondly
    // bysecond 1, 2
    // dtstart minute: 0, second: 0
    // -> minute: 0, second: 1
    // -> minute: 0, second: 2
    // -> minute: 1, second: 1
    //
    // freq = minutely
    // interval = 2
    // bysecond 1, 2
    // dtstart minute: 0, second: 0
    // -> minute: 0, second: 1
    // -> minute: 0, second: 2
    // -> minute: 2, second: 1
    next() {
      do {
        const unit = smallestTickUnit(options)
        let unitIdx = FREQUENCY_ORDER.indexOf(unit)
        const freqIdx = FREQUENCY_ORDER.indexOf(FREQUENCY_COUNTER[freq])

        let newCurrent: DateTime
        do {
          if (unitIdx > freqIdx) {
            newCurrent = tickByrule(copy(current), unit, options)
          } else {
            newCurrent = tick(
              copy(current),
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

const tick = (d: DateTime, unit: keyof DateTime, options: GroomedOptions) => {
  if (byRuleForUnit(unit, options)) {
    return tickByrule(d, unit, options)
  }

  return rollOver(d, FREQUENCY_ORDER.indexOf(unit), options)
}

const tickByrule = (
  d: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  const byrule = byRuleForUnit(unit, options)

  if (byrule && byrule.length) {
    return skipBy(unit)(d, byrule)
  }

  return d
}

const byRuleForUnit = (unit: keyof DateTime, options: GroomedOptions) => {
  switch (unit) {
    case 'month':
      return options.bymonth
    case 'hour':
      return options.byhour
    case 'minute':
      return options.byminute
    case 'second':
      return options.bysecond
    default:
      return undefined
  }
}

const rollOver = (
  current: DateTime,
  refUnitIdx: number,
  options: GroomedOptions
) => {
  const newCurrent = add(current, {
    [FREQUENCY_ORDER[refUnitIdx]]:
      (options.interval || 1) * (options.freq === 'WEEKLY' ? 7 : 1)
  })

  FREQUENCY_ORDER.slice(
    refUnitIdx + 1,
    FREQUENCY_ORDER.indexOf(smallestTickUnit(options)) + 1
  ).forEach(unit => {
    newCurrent[unit] = (byRuleForUnit(unit, options) || [])[0] || 0
    console.log('newCurrent unit', unit, current[unit], newCurrent[unit])
  })

  return newCurrent
}

const smallestTickUnit = ({
  freq,
  bysecond,
  byminute,
  byhour,
  byday,
  bymonth
}: GroomedOptions): keyof DateTime => {
  if (freq === 'SECONDLY' || bysecond) {
    return 'second'
  }

  if (freq === 'MINUTELY' || byminute) {
    return 'minute'
  }

  if (freq === 'HOURLY' || byhour) {
    return 'hour'
  }

  if (freq === 'DAILY' || byday) {
    return 'day'
  }

  if (freq === 'MONTHLY' || bymonth) {
    return 'month'
  }

  return 'year'
}
