import { add } from './add'
import { copy } from './copy'
import { DateTime, parseISO } from './parseISO'
import { toISO } from './toISO'

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
  count: number
  interval?: number
}

export const rrule = ({
  dtstart,
  freq,
  count,
  interval = 1
}: RuleOptions): string[] | undefined => {
  const dtstartDate = parseISO(dtstart)
  if (!dtstartDate) {
    return undefined
  }

  let counter = copy(dtstartDate)
  const output = []
  while (output.length < count) {
    output.push(copy(counter))
    counter = add(counter, {
      [FREQUENCY_COUNTER[freq]]: interval * (freq === 'WEEKLY' ? 7 : 1)
    })
  }

  return output.map(toISO)
}
