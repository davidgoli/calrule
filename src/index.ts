import { add } from './add'
import { copy } from './copy'
import { parseISO } from './parseISO'
import { toISO } from './toISO'

export enum Frequency {
  DAILY = 'DAILY'
}

export interface RuleOptions {
  freq: Frequency
  dtstart: string
  count: number
}

export const rrule = ({
  dtstart,
  freq,
  count
}: RuleOptions): string[] | undefined => {
  const dtstartDate = parseISO(dtstart)
  if (!dtstartDate) {
    return undefined
  }

  let counter = copy(dtstartDate)
  const output = []
  while (output.length < count) {
    output.push(copy(counter))
    counter = add(counter, { day: 1 })
  }

  return output.map(toISO)
}
