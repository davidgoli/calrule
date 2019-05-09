import { parseISO } from "./parseISO"
import { toISO } from "./toISO"

export enum Frequency {
  DAILY = "DAILY"
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

  const counter = Object.assign({}, dtstartDate)
  const output = []
  while (output.length < count) {
    output.push(Object.assign({}, counter))
  }

  return output.map(toISO)
}
