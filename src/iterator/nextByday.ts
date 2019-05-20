import { copy } from '../copy'
import { add } from '../DateTime/add'
import {
  dayOfMonth,
  dayOfWeek,
  dayOfYear,
  dayOrdinalOfWeek,
  WEEKDAYS
} from '../DateTime/dayOfWeek'
import { DateTime } from '../DateTime/index'
import { Weekday } from '../types'
import { UnitRule } from './types'

const nextYearday = (current: DateTime, steps: number[], advance: boolean) => {
  const currentDayOfYear = dayOfYear(current)

  for (let i = 0; i < steps.length; i++) {
    if (advance ? currentDayOfYear < steps[i] : currentDayOfYear <= steps[i]) {
      const newCurrent = copy(current)
      newCurrent.month = 1
      newCurrent.day = 1
      return add(newCurrent, { day: steps[i] - 1 })
    }
  }

  return current
}

const nextMonthday = (current: DateTime, steps: number[], advance = true) => {
  const currentMonthday = dayOfMonth(current)
  for (let i = 0; i < steps.length; i++) {
    const daydiff = steps[i] - currentMonthday
    console.log({ daydiff })
    if (advance ? daydiff > 0 : daydiff >= 0) {
      return add(current, { day: daydiff })
    }
  }

  return current
}

const nextDayStep = (current: DateTime, steps: Weekday[], advance = true) => {
  const currentDayOfWeekIdx = dayOrdinalOfWeek(current)

  for (let i = 0; i < steps.length; i++) {
    const daydiff = WEEKDAYS.indexOf(steps[i]) - currentDayOfWeekIdx
    if (advance ? daydiff > 0 : daydiff >= 0) {
      return add(current, { day: daydiff })
    }
  }

  return current
}

const shouldTickFreqStepForByday = (current: DateTime, steps: Weekday[]) => {
  const currentDayOfWeekIdx = dayOrdinalOfWeek(current)
  return WEEKDAYS.indexOf(steps[steps.length - 1]) - currentDayOfWeekIdx < 0
}

const nextWeekday = (next: DateTime, byrule: Weekday[], advance: boolean) => {
  next = nextDayStep(next, byrule, advance)
  if (shouldTickFreqStepForByday(next, byrule)) {
    next = add(next, {
      day: 7 - WEEKDAYS.indexOf(dayOfWeek(next))
    })

    return nextDayStep(next, byrule, advance)
  }

  return next
}

export const nextByday = (
  next: DateTime,
  { unit, byrule }: UnitRule,
  advance = true
) => {
  if (unit === 'byyearday') {
    return nextYearday(next, byrule as number[], advance)
  }

  if (unit === 'bymonthday') {
    return nextMonthday(next, byrule as number[], advance)
  }

  return nextWeekday(next, byrule as Weekday[], advance)
}
