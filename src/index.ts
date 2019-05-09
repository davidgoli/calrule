import { parse } from "./parse/parse"

enum Frequency {
  DAILY = "DAILY"
}

interface RuleOptions {
  freq: Frequency
  dtstart: string
  until: string
}

export const rrule = ({ dtstart, freq, until }: RuleOptions) => {
  const dtstartDate = parse(dtstart)
  const untilDate = parse(until)
}
