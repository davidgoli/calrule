import { days } from './DateTime/dayOfWeek'
import { inRange } from './DateTime/inRange'
import { isValidDate } from './DateTime/isValidDate'
import { Frequency, RuleOptions } from './types'

export const FREQValues: Frequency[] = [
  'YEARLY',
  'MONTHLY',
  'WEEKLY',
  'DAILY',
  'HOURLY',
  'MINUTELY',
  'SECONDLY'
]

const isPositiveNumber = (value: unknown) =>
  // tslint-ignore-next-line
  parseInt((value as Record<string, unknown>).toString(), 10) >= 0

const arrayInRange = (value: unknown, min: number, max: number) =>
  Array.isArray(value) &&
  typeof value.find(i => !inRange(i, min, max)) === 'undefined'

const arrayContainsValues = <T>(value: unknown, values: T[]) =>
  Array.isArray(value) &&
  typeof value.find(i => values.indexOf(i) === -1) === 'undefined'

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

  if (
    typeof options.bysecond !== 'undefined' &&
    !arrayInRange(options.bysecond, 0, 60)
  ) {
    errors.push(error('BYSECOND', options.bysecond))
  }

  if (
    typeof options.byminute !== 'undefined' &&
    !arrayInRange(options.byminute, 0, 59)
  ) {
    errors.push(error('BYMINUTE', options.byminute))
  }

  if (
    typeof options.byhour !== 'undefined' &&
    !arrayInRange(options.byhour, 0, 23)
  ) {
    errors.push(error('BYHOUR', options.byhour))
  }

  if (
    typeof options.bymonthday !== 'undefined' &&
    !(
      arrayInRange(options.bymonthday, -31, 31) &&
      options.bymonthday.indexOf(0) === -1
    )
  ) {
    errors.push(error('BYMONTHDAY', options.bymonthday))
  }

  if (
    typeof options.byyearday !== 'undefined' &&
    !(
      arrayInRange(options.byyearday, -366, 366) &&
      options.byyearday.indexOf(0) === -1
    )
  ) {
    errors.push(error('BYYEARDAY', options.byyearday))
  }

  if (
    typeof options.bymonth !== 'undefined' &&
    !arrayInRange(options.bymonth, 1, 12)
  ) {
    errors.push(error('BYMONTH', options.bymonth))
  }

  if (
    typeof options.byday !== 'undefined' &&
    !arrayContainsValues(options.byday, days)
  ) {
    errors.push(error('BYDAY', options.byday))
  }

  if (
    ['DAILY', 'WEEKLY', 'MONTHLY'].indexOf(options.freq) !== -1 &&
    typeof options.byyearday !== 'undefined'
  ) {
    errors.push(`BYYEARDAY cannot be used when FREQ=${options.freq}`)
  }

  if (options.freq === 'WEEKLY' && typeof options.bymonthday !== 'undefined') {
    errors.push('BYMONTHDAY cannot be used when FREQ=WEEKLY')
  }

  if (errors.length) {
    return [false, { errors }]
  }

  return [true, {}]
}
