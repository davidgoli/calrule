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
import { set } from '../DateTime/set'
import { Weekday } from '../types'
import { nextByruleStep } from './nextByruleStep'
import { UnitRule } from './types'

const nextYearday = (current: DateTime, steps: number[], advance: boolean) => {
  const currentDayOfYear = dayOfYear(current)

  for (let i = 0; i < steps.length; i++) {
    if (advance ? currentDayOfYear <= steps[i] : currentDayOfYear < steps[i]) {
      const newCurrent = copy(current)
      newCurrent.month = 1
      newCurrent.day = 1
      return add(newCurrent, { day: steps[i] })
    }
  }

  return current
}

const shouldTickFreqStepForBymonthday = (current: DateTime, steps: number[]) =>
  dayOfMonth(current) > steps[steps.length - 1]

const nextMonthday = (next: DateTime, byrule: number[], advance: boolean) => {
  next = nextByruleStep('day')(next, byrule, advance)

  if (shouldTickFreqStepForBymonthday(next, byrule)) {
    next = add(next, {
      month: 1
    })

    next = set(next, 'day', 0)

    return nextByruleStep('day')(next, byrule, advance)
  }

  return next
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
  if (unit === 'year') {
    return nextYearday(next, byrule as number[], advance)
  }

  if (unit === 'month') {
    return nextMonthday(next, byrule as number[], advance)
  }

  return nextWeekday(next, byrule as Weekday[], advance)
}
