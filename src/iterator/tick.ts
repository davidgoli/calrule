import { byRuleForUnit } from './units'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { skipBy, nextDay } from './skipAhead'
import { Weekday } from '../types'

export const tickByrule = (
  d: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  const byrule = byRuleForUnit(unit, options)

  if (byrule && byrule.length) {
    if (unit === 'day') {
      return nextDay(d, byrule as Weekday[])
    }

    return skipBy(unit)(d, byrule as number[])
  }

  return d
}
