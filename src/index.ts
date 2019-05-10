import { copy } from './copy'
import { add } from './DateTime/add'
import { compare } from './DateTime/compare'
import { DateTime } from './DateTime/index'
import { parseISO } from './DateTime/parseISO'
import { toISO } from './DateTime/toISO'

type Frequency =
  | 'YEARLY'
  | 'MONTHLY'
  | 'WEEKLY'
  | 'DAILY'
  | 'HOURLY'
  | 'MINUTELY'
  | 'SECONDLY'

const FREQUENCY_COUNTER: { [k in Frequency]: keyof DateTime } = {
  YEARLY: 'year',
  MONTHLY: 'month',
  WEEKLY: 'day',
  DAILY: 'day',
  HOURLY: 'hour',
  MINUTELY: 'minute',
  SECONDLY: 'second'
}

export interface RuleOptions {
  freq: Frequency
  dtstart: string
  count?: number
  until?: string
  interval?: number
}

export const rrule = ({
  dtstart,
  freq,
  count,
  until,
  interval = 1
}: RuleOptions): string[] | undefined => {
  const dtstartDate = parseISO(dtstart)
  if (!dtstartDate) {
    return undefined
  }

  let counter = copy(dtstartDate)
  const complete = iterationTerminator(count, until)

  const output = []
  while (!complete(counter, output.length)) {
    output.push(copy(counter))
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
