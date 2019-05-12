export type Frequency =
  | 'YEARLY'
  | 'MONTHLY'
  | 'WEEKLY'
  | 'DAILY'
  | 'HOURLY'
  | 'MINUTELY'
  | 'SECONDLY'

export type Weekday = 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA'

export interface RuleOptions {
  freq: Frequency
  dtstart: string
  count?: number
  until?: string
  interval?: number
  byday?: Weekday[]
  byhour?: number[]
  byminute?: number[]
}
