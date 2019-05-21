import { copy } from '../copy'
import { add } from '../DateTime/add'
import {
  dayOfMonth,
  dayOfWeek,
  dayOfYear,
  lengthOfMonth
} from '../DateTime/dayOfWeek'
import { DateTime } from '../DateTime/index'
import { set } from '../DateTime/set'
import { Weekday } from '../types'
import { UnitRule } from './types'
import { unitForByrule } from './units'

const setYearday = (initial: DateTime, value: number) => {
  const next = copy(initial)
  next.month = 1
  next.day = 1
  return add(next, { day: value - 1 })
}

const nextYearday = (initial: DateTime, steps: number[]) => {
  const currentDayOfYear = dayOfYear(initial)

  for (let i = 0; i < steps.length; i++) {
    if (currentDayOfYear <= steps[i]) {
      return setYearday(initial, steps[i])
    }
  }

  return setYearday(initial, steps[steps.length - 1])
}

const nextMonthday = (initial: DateTime, steps: number[]) => {
  const currentMonthday = dayOfMonth(initial)
  for (let i = 0; i < steps.length; i++) {
    const daydiff = steps[i] - currentMonthday
    if (daydiff >= 0) {
      return add(initial, { day: daydiff })
    }
  }

  return set(initial, 'day', steps[steps.length - 1])
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
      if (advance) {
        d = advanceUnit(d, unitRule)
      }

      return nextYearday(d, byrule as number[])

    case 'bymonthday':
      if (advance) {
        d = advanceUnit(d, unitRule)
      }

      return nextMonthday(d, byrule as number[])

    case 'byday':
      return nextWeekday(d, byrule as Weekday[])

    default:
      if (advance) {
        d = advanceUnit(d, unitRule)
      }

      return nextByruleStep(d, unitRule)
  }
}

const advanceUnit = (d: DateTime, unitRule: UnitRule) =>
  add(d, { [unitForByrule(unitRule.unit)]: 1 })
