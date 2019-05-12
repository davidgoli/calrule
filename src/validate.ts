import { RuleOptions, Frequency } from './types'
import { isValidDate } from './DateTime/isValidDate'

export const FREQValues: Frequency[] = [
  'YEARLY',
  'MONTHLY',
  'WEEKLY',
  'DAILY',
  'HOURLY',
  'MINUTELY',
  'SECONDLY'
]

const error = (param: string, value: unknown) =>
  `Invalid value "${value}" for parameter ${param}`

export const validate = (options: RuleOptions) => {
  const errors = []
  if (FREQValues.indexOf(options.freq) === -1) {
    errors.push(error('FREQ', options.freq))
  }

  if (!isValidDate(options.dtstart)) {
    errors.push(error('DTSTART', options.dtstart))
  }

  if (
    typeof options.count !== 'undefined' &&
    typeof options.until !== 'undefined'
  ) {
    errors.push('UNTIL and COUNT must not both be present')
  }

  if (typeof options.until !== 'undefined' && !isValidDate(options.until)) {
    errors.push(error('UNTIL', options.until))
  }

  if (
    typeof options.interval !== 'undefined' &&
    !isPositiveNumber(options.interval)
  ) {
    errors.push(error('INTERVAL', options.interval))
  }

  if (
    typeof options.count !== 'undefined' &&
    !isPositiveNumber(options.count)
  ) {
    errors.push(error('COUNT', options.count))
  }

  if (errors.length) {
    return [false, { errors }]
  }

  return [true, {}]
}

const isPositiveNumber = (value: Object) => parseInt(value.toString(), 10) > 0
