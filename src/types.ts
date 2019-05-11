export type Frequency =
  | 'YEARLY'
  | 'MONTHLY'
  | 'WEEKLY'
  | 'DAILY'
  | 'HOURLY'
  | 'MINUTELY'
  | 'SECONDLY'

export type BYDAY = 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA' | 'SU'

export interface RuleOptions {
  freq: Frequency
  dtstart: string
  count?: number
  until?: string
  interval?: number
}
