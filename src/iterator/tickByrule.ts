import { byRuleForUnit } from './units'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { nextByruleStep, nextDayStep } from './nextByruleStep'
import { Weekday } from '../types'

export const tickByrule = (
  d: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  const byrule = byRuleForUnit(unit, options)

  if (byrule && byrule.length) {
    if (unit === 'day') {
      return nextDayStep(d, byrule as Weekday[])
    }

    return nextByruleStep(unit)(d, byrule as number[])
  }

  return d
}
