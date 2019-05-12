import { GroomedOptions } from './groomOptions'
import { Frequency } from './types'
import { DateTime } from './DateTime/index'
import { compare } from './DateTime/compare'
import { add } from './DateTime/add'

export const FREQUENCY_COUNTER: { [k in Frequency]: keyof DateTime } = {
  YEARLY: 'year',
  MONTHLY: 'month',
  WEEKLY: 'day',
  DAILY: 'day',
  HOURLY: 'hour',
  MINUTELY: 'minute',
  SECONDLY: 'second'
}

export const makeIterator = ({
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
