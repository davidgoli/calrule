import { dayOfMonth, dayOfWeek, dayOfYear } from '../DateTime/dayOfWeek'
import { DateTime, DateTimeDiff, daysInMonth } from '../DateTime/index'
import { set } from '../DateTime/set'
import { Weekday } from '../types'
import { UnitRule } from './types'
import { unitForByrule } from './units'

const setYearday = (initial: DateTime, value: number) => {
  const interval = 1 - dayOfYear(initial) + (value - 1)
  return interval === 0
    ? {}
    : {
        day: interval
      }
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
    const interval = steps[i] - currentMonthday
    if (interval >= 0) {
      return interval === 0 ? {} : { day: interval }
    }
  }

  const interval = steps[steps.length - 1] - initial.day

  return interval === 0 ? {} : { day: interval }
}

const weekdaysInMonthByRule = (d: DateTime, byday: Weekday[]) => {
  const len = daysInMonth(d.month, d.year)
  const days: number[] = []

  for (let i = 1; i <= len; i++) {
    const date = set(d, 'day', i)
    if (byday.indexOf(dayOfWeek(date)) !== -1) {
      days.push(i)
    }
  }

  return days
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
      const interval = steps[i] - initial[unit]
      if (interval === 0) {
        return {}
      }
      return { [unit]: steps[i] - initial[unit] }
    }
  }

  const interval = steps[steps.length - 1] - initial[unit]
  if (interval === 0) {
    return {}
  }

  return { [unit]: interval }
}

const nextWeekday = (next: DateTime, byrule: Weekday[]) => {
  const weekdaysInMonth = weekdaysInMonthByRule(next, byrule)
  return nextByruleStep(next, { unit: 'byday', byrule: weekdaysInMonth })
}

export const syncByrule = (
  d: DateTime,
  unitRule: UnitRule | undefined
): DateTimeDiff => {
  if (!unitRule) {
    return {}
  }

  const { unit, byrule } = unitRule

  switch (unit) {
    case 'byyearday':
      return nextYearday(d, byrule as number[])

    case 'bymonthday':
      return nextMonthday(d, byrule as number[])

    case 'byday':
      return nextWeekday(d, byrule as Weekday[])

    default:
      return nextByruleStep(d, unitRule)
  }
}
