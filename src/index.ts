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

  const { dtstart, freq, count, until, interval = 1 } = options
  const dtstartDate = parseISO(dtstart)
  if (!dtstartDate) {
    return undefined
  }

  let counter = copy(dtstartDate)
  const complete = iterationTerminator(count, until)
  const passesFilter = makeFilter(options)

  const output = []
  while (!complete(counter, output.length)) {
    if (passesFilter(counter)) output.push(copy(counter))

    counter = add(counter, {
      [FREQUENCY_COUNTER[freq]]: interval * (freq === 'WEEKLY' ? 7 : 1)
    })
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
