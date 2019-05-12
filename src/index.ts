import { copy } from './copy'
import { add } from './DateTime/add'
import { compare } from './DateTime/compare'
import { DateTime } from './DateTime/index'
import { parseISO } from './DateTime/parseISO'
import { toISO } from './DateTime/toISO'
import { RuleOptions, Frequency } from './types'
import { validate } from './validate'
import { dayOfWeek } from './DateTime/dayOfWeek'

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
  if (!validate(options)) {
    return undefined
  }

  const { count, until, interval = 1 } = options
  const complete = iterationTerminator(count, until)
  const passesFilter = makeFilter(options)
  const iterator = makeIterator(options)
  if (!iterator) {
    return undefined
  }

  const output = []
  while (!complete(iterator.current(), output.length)) {
    if (passesFilter(iterator.current())) output.push(copy(iterator.current()))
    iterator.next()
  }

  return output.map(toISO)
}

const iterationTerminator = (count?: number, until?: string) => {
  const untilDate = parseISO(until)
  return (current: DateTime, length: number) => {
    return (
      (typeof count === 'number' && length >= count) ||
      (typeof untilDate !== 'undefined' && compare(untilDate, current) < 0)
    )
  }
}

const makeFilter = ({ byday }: RuleOptions) => {
  return (current: DateTime) => {
    if (byday) {
      return byday.indexOf(dayOfWeek(current)) !== -1
    }

    return true
  }
}

const adjustFreq = (options: RuleOptions) => {
  if (options.byday) {
    return 'DAILY'
  }

  return options.freq
}

const makeIterator = (options: RuleOptions) => {
  const dtstartDate = parseISO(options.dtstart)
  if (!dtstartDate) {
    return undefined
  }

  let counter = copy(dtstartDate)
  const freq = adjustFreq(options)
  const { interval = 1 } = options

  return {
    next() {
      counter = add(counter, {
        [FREQUENCY_COUNTER[freq]]: interval * (freq === 'WEEKLY' ? 7 : 1)
      })
    },

    current() {
      return counter
    }
  }
}
