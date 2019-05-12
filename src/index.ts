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

  const passesFilter = makeFilter(options)
  const iterator = makeIterator(options)
  if (!iterator) {
    return undefined
  }

  const output = []
  while (iterator.hasNext(output.length)) {
    if (passesFilter(iterator.current())) output.push(copy(iterator.current()))
    iterator.next()
  }

  return output.map(toISO)
}

const makeFilter = ({ byday }: RuleOptions) => {
  return (current: DateTime) => {
    if (byday) {
      return byday.indexOf(dayOfWeek(current)) !== -1
    }

    return true
  }
}

const adjustFreq = ({ byday, freq }: Pick<RuleOptions, 'byday' | 'freq'>) => {
  if (byday) {
    return 'DAILY'
  }

  return freq
}

const makeIterator = ({
  dtstart,
  freq,
  count,
  until,
  byday,
  interval = 1
}: RuleOptions) => {
  const dtstartDate = parseISO(dtstart)
  if (!dtstartDate) {
    return undefined
  }

  const untilDate = parseISO(until)
  let counter = copy(dtstartDate)
  const frequency = adjustFreq({ byday, freq })

  return {
    hasNext(length: number) {
      return (
        (typeof count === 'number' && length < count) ||
        (typeof untilDate !== 'undefined' && compare(untilDate, counter) >= 0)
      )
    },

    next() {
      counter = add(counter, {
        [FREQUENCY_COUNTER[frequency]]:
          interval * (frequency === 'WEEKLY' ? 7 : 1)
      })
    },

    current() {
      return counter
    }
  }
}
