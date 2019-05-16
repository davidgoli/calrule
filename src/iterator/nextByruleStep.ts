import { DateTime } from '../DateTime/index'
import { set } from '../DateTime/set'
import { UnitRule } from './types'

export const nextByruleStep = (
  current: DateTime,
  { unit, byrule }: UnitRule,
  advance = true
) => {
  if (!byrule) {
    return current
  }
  const steps = byrule as number[]

  for (let i = 0; i < steps.length; i++) {
    if (advance ? current[unit] < steps[i] : current[unit] <= steps[i]) {
      return set(current, unit, steps[i])
    }
  }

  return set(current, unit, steps[steps.length - 1])
}
