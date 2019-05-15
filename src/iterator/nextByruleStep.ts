import { DateTime } from '../DateTime/index'
import { set } from '../DateTime/set'
import { Weekday } from '../types'
import { days, dayOrdinalOfWeek } from '../DateTime/dayOfWeek'
import { add } from '../DateTime/add'

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

export const nextDayStep = (current: DateTime, steps: Weekday[]) => {
  const currentDayOfWeekIdx = dayOrdinalOfWeek(current)

  for (let i = 0; i < steps.length; i++) {
    const daydiff = days.indexOf(steps[i]) - currentDayOfWeekIdx
    if (daydiff > 0) {
      return add(current, { day: daydiff })
    }
  }

  return current
}
