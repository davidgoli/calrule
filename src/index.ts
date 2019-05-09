import { parseISO } from "./parseISO"

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

  return [dtstart]
}
