import { RuleOptions, Frequency } from './types'

const FREQValues: Frequency[] = [
  'YEARLY',
  'MONTHLY',
  'WEEKLY',
  'DAILY',
  'HOURLY',
  'MINUTELY',
  'SECONDLY'
]

export const validate = (options: RuleOptions) => {
  if (FREQValues.indexOf(options.freq) === -1) {
    return [
      false,
      { errors: [`Invalid value "${options.freq}" for paramater FREQ`] }
    ]
  }

  return [true, {}]
}
