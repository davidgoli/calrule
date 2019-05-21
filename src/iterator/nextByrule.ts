import { copy } from '../copy'
import { add } from '../DateTime/add'
import {
  dayOfMonth,
  dayOfWeek,
  dayOfYear,
  dayOrdinalOfWeek,
  lengthOfMonth,
  WEEKDAYS
} from '../DateTime/dayOfWeek'
import { DateTime } from '../DateTime/index'
import { set } from '../DateTime/set'
import { Weekday } from '../types'
import { UnitRule } from './types'
import { unitForByrule } from './units'

const nextYearday = (initial: DateTime, steps: number[], advance: boolean) => {
  const currentDayOfYear = dayOfYear(initial)

  for (let i = 0; i < steps.length; i++) {
    if (advance ? currentDayOfYear < steps[i] : currentDayOfYear <= steps[i]) {
      const newCurrent = copy(initial)
      newCurrent.month = 1
      newCurrent.day = 1
      return add(newCurrent, { day: steps[i] - 1 })
    }
  }

  return initial
}

const nextMonthday = (initial: DateTime, steps: number[], advance = true) => {
  const currentMonthday = dayOfMonth(initial)
  for (let i = 0; i < steps.length; i++) {
    const daydiff = steps[i] - currentMonthday
    if (advance ? daydiff > 0 : daydiff >= 0) {
      return add(initial, { day: daydiff })
    }
  }

  return initial
}

const nextDayStep = (initial: DateTime, steps: Weekday[]) => {
  const currentDayOfWeekIdx = dayOrdinalOfWeek(initial)

  for (let i = 0; i < steps.length; i++) {
    const daydiff = WEEKDAYS.indexOf(steps[i]) - currentDayOfWeekIdx
    if (daydiff >= 0) {
      return add(initial, { day: daydiff })
    }
  }

  return initial
}

const weekdaysInMonthByRule = (d: DateTime, byday: Weekday[]) => {
  const len = lengthOfMonth(d)
  const days: number[] = []

  for (let i = 1; i <= len; i++) {
    const date = set(d, 'day', i)
    if (byday.indexOf(dayOfWeek(date)) !== -1) {
      days.push(i)
    }
  }

  return days
}

const nextWeekday = (next: DateTime, byrule: Weekday[]) => {
  next = nextDayStep(next, byrule)
  const weekdaysInMonth = weekdaysInMonthByRule(next, byrule)
  return nextByruleStep(next, { unit: 'byday', byrule: weekdaysInMonth })
}

const nextByruleStep = (initial: DateTime, unitRule: UnitRule) => {
  const { byrule } = unitRule
  if (!byrule) {
    return initial
  }
  const steps = byrule as number[]
  const unit = unitForByrule(unitRule.unit)

  for (let i = 0; i < steps.length; i++) {
    if (initial[unit] <= steps[i]) {
      return set(initial, unit, steps[i])
    }
  }

  return set(initial, unit, steps[steps.length - 1])
}

export const nextByrule = (
  d: DateTime,
  unitRule: UnitRule | undefined,
  advance: boolean
) => {
  if (!unitRule) {
    return d
  }

  const { unit, byrule } = unitRule

  switch (unit) {
    case 'byyearday':
      return nextYearday(d, byrule as number[], advance)

    case 'bymonthday':
      return nextMonthday(d, byrule as number[], advance)

    case 'byday':
      return nextWeekday(d, byrule as Weekday[])

    default:
      if (advance) {
        d = add(d, { [unitForByrule(unitRule.unit)]: 1 })
      }
      return nextByruleStep(d, unitRule)
  }
}
