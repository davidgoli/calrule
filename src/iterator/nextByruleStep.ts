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
import { UnitRule } from './types'
import { unitForByrule } from './units'

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

const nextByruleStep = (
  current: DateTime,
  unitRule: UnitRule,
  advance = true
) => {
  const { byrule } = unitRule
  if (!byrule) {
    return current
  }
  const steps = byrule as number[]
  const unit = unitForByrule(unitRule.unit)

  for (let i = 0; i < steps.length; i++) {
    if (advance ? current[unit] < steps[i] : current[unit] <= steps[i]) {
      return set(current, unit, steps[i])
    }
  }

  return set(current, unit, steps[steps.length - 1])
}

export const nextByrule = (
  d: DateTime,
  unitRule: UnitRule,
  advance: boolean
) => {
  const { unit, byrule } = unitRule
  switch (unit) {
    case 'byyearday':
      return nextYearday(d, byrule as number[], advance)

    case 'bymonthday':
      return nextMonthday(d, byrule as number[], advance)

    case 'byday':
      return nextWeekday(d, byrule as Weekday[], advance)

    default:
      return nextByruleStep(d, unitRule, advance)
  }
}
