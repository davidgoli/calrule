import { RuleOptions, Frequency } from './types'
import { parseISO } from './DateTime/parseISO'

const FREQValues: Frequency[] = [
  'YEARLY',
  'MONTHLY',
  'WEEKLY',
  'DAILY',
  'HOURLY',
  'MINUTELY',
  'SECONDLY'
]

const error = (param: string, value: any) =>
  `Invalid value "${value}" for parameter ${param}`

export const validate = (options: RuleOptions) => {
  const errors = []
  if (FREQValues.indexOf(options.freq) === -1) {
    errors.push(error('FREQ', options.freq))
  }

  if (!parseISO(options.dtstart)) {
    errors.push(error('DTSTART', options.dtstart))
  }

  if (errors.length) {
    return [false, { errors }]
  }

  return [true, {}]
}
