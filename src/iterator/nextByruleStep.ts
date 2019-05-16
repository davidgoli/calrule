import { add } from '../DateTime/add'
import { dayOfMonth, dayOrdinalOfWeek, WEEKDAYS } from '../DateTime/dayOfWeek'
import { DateTime } from '../DateTime/index'
import { set } from '../DateTime/set'
import { Weekday } from '../types'

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

export const shouldTickFreqStepForBymonthday = (
  current: DateTime,
  steps: number[]
) => dayOfMonth(current) > steps[steps.length - 1]

export const shouldTickFreqStepForByday = (
  current: DateTime,
  steps: Weekday[]
) => {
  const currentDayOfWeekIdx = dayOrdinalOfWeek(current)
  return WEEKDAYS.indexOf(steps[steps.length - 1]) - currentDayOfWeekIdx < 0
}

export const nextDayStep = (current: DateTime, steps: Weekday[]) => {
  const currentDayOfWeekIdx = dayOrdinalOfWeek(current)

  for (let i = 0; i < steps.length; i++) {
    const daydiff = WEEKDAYS.indexOf(steps[i]) - currentDayOfWeekIdx
    console.log({ daydiff })
    if (daydiff > 0) {
      console.log('returning', current.day + daydiff)
      return add(current, { day: daydiff })
    }
  }

  return current
}
