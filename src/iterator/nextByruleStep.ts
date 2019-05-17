import { DateTime } from '../DateTime/index'
import { set } from '../DateTime/set'
import { UnitRule } from './types'
import { unitForByrule } from './units'

export const nextByruleStep = (
  current: DateTime,
  unitRule: UnitRule,
  advance = true
) => {
  const { byrule } = unitRule
  if (!byrule) {
    return current
  }
  const steps = byrule as number[]
  const unit = unitForByrule(unitRule.unit)

  for (let i = 0; i < steps.length; i++) {
    if (advance ? current[unit] < steps[i] : current[unit] <= steps[i]) {
      return set(current, unit, steps[i])
    }
  }

  return set(current, unit, steps[steps.length - 1])
}
