import { DateTime } from '../DateTime/index'
import { set } from '../DateTime/set'

export const nextByruleStep = (unit: keyof DateTime) => (
  current: DateTime,
  steps: number[],
  advance = true
) => {
  for (let i = 0; i < steps.length; i++) {
    if (advance ? current[unit] < steps[i] : current[unit] <= steps[i]) {
      return set(current, unit, steps[i])
    }
  }

  return set(current, unit, steps[steps.length - 1])
}
