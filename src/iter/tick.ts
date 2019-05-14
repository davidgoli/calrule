import { byRuleForUnit, FREQUENCY_ORDER } from './units'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { rollOver } from './rollOver'
import { skipBy } from './skipAhead'

export const tick = (
  d: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  if (byRuleForUnit(unit, options)) {
    return tickByrule(d, unit, options)
  }

  return rollOver(d, FREQUENCY_ORDER.indexOf(unit), options)
}

export const tickByrule = (
  d: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  const byrule = byRuleForUnit(unit, options)

  if (byrule && byrule.length) {
    return skipBy(unit)(d, byrule)
  }

  return d
}
