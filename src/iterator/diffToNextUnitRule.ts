import { DateTime, DateTimeDiff } from '../DateTime'
import { set } from '../DateTime/set'
import {
  dayOfMonth,
  dayOfWeek,
  dayOfYear,
  daysInMonth
} from '../DateTime/units'
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

const nextByruleStep = (current: DateTime, unitRule: UnitRule) => {
  const { byrule } = unitRule
  const steps = byrule as number[]
  const unit = unitForByrule[unitRule.unit]

  for (let i = 0; i < steps.length; i++) {
    const interval = steps[i] - current[unit]
    if (interval > 0) {
      if (unit === 'day') console.log({ current, unit, interval, steps })
      return { [unit]: interval }
    }

    if (interval === 0) {
      return {}
    }
  }

  const interval = steps[steps.length - 1] - current[unit]
  if (interval === 0) {
    return {}
  }

  if (unit === 'day') console.log({ current, unit, interval })
  return { [unit]: interval }
}

const nextWeekno = (initial: DateTime, steps: number[]) => {
  const currentDayOfYear = dayOfYear(initial)

  for (let i = 0; i < steps.length; i++) {
    const weekInDays = steps[i] * 7
    if (currentDayOfYear <= weekInDays) {
      return setYearday(initial, weekInDays)
    }
  }

  return setYearday(initial, steps[steps.length - 1] * 7)
}

const nextWeekday = (next: DateTime, byrule: Weekday[]) => {
  const weekdaysInMonth = weekdaysInMonthByRule(next, byrule)
  return nextByruleStep(next, { unit: 'byday', byrule: weekdaysInMonth })
}

export const diffToNextUnitRule = (
  d: DateTime,
  unitRule: UnitRule
): DateTimeDiff => {
  const { unit, byrule } = unitRule

  switch (unit) {
    case 'byyearday':
      return nextYearday(d, byrule as number[])

    case 'bymonthday':
      return nextMonthday(d, byrule as number[])

    case 'byweekno':
      return nextWeekno(d, byrule as number[])

    case 'byday':
      return nextWeekday(d, byrule as Weekday[])

    default:
      return nextByruleStep(d, unitRule)
  }
}
