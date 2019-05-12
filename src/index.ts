import { add } from './DateTime/add'
import { compare } from './DateTime/compare'
import { DateTime } from './DateTime/index'
import { toISO } from './DateTime/toISO'
import { RuleOptions, Frequency } from './types'
import { dayOfWeek } from './DateTime/dayOfWeek'
import { GroomedOptions, groomOptions } from './groomOptions'

export const FREQUENCY_COUNTER: { [k in Frequency]: keyof DateTime } = {
  YEARLY: 'year',
  MONTHLY: 'month',
  WEEKLY: 'day',
  DAILY: 'day',
  HOURLY: 'hour',
  MINUTELY: 'minute',
  SECONDLY: 'second'
}

export const rrule = (options: RuleOptions): string[] | undefined => {
  const groomedOptions = groomOptions(options)
  if (!groomedOptions) {
    return undefined
  }

  const iterator = makeIterator(groomedOptions)
  const passesFilter = makeFilter(groomedOptions)

  const output = []
  while (iterator.hasNext(output.length)) {
    if (passesFilter(iterator.current)) {
      output.push(toISO(iterator.current))
    }
    iterator.next()
  }

  return output
}

const makeFilter = ({ byday }: GroomedOptions) => {
  return (current: DateTime) => {
    if (byday) {
      return byday.indexOf(dayOfWeek(current)) !== -1
    }

    return true
  }
}

const makeIterator = ({
  dtstart,
  freq,
  count,
  until,
  interval = 1
}: GroomedOptions) => {
  let current = dtstart

  return {
    hasNext(length: number) {
      return (
        (typeof count === 'number' && length < count) ||
        (typeof until !== 'undefined' && compare(until, current) >= 0)
      )
    },

    next() {
      current = add(current, {
        [FREQUENCY_COUNTER[freq]]: interval * (freq === 'WEEKLY' ? 7 : 1)
      })
    },

    get current() {
      return current
    }
  }
}
