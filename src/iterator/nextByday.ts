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

  console.log({ currentDayOfYear })
  for (let i = 0; i < steps.length; i++) {
    if (advance ? currentDayOfYear < steps[i] : currentDayOfYear <= steps[i]) {
      console.log({ step: steps[i] })
      const newCurrent = copy(current)
      newCurrent.month = 1
      newCurrent.day = 1
      return add(newCurrent, { day: steps[i] })
    }
  }

  return current
}

const shouldTickFreqStepForBymonthday = (
  current: DateTime,
  { byrule }: UnitRule
) => byrule && dayOfMonth(current) > byrule[byrule.length - 1]

const nextMonthday = (next: DateTime, unitRule: UnitRule, advance: boolean) => {
  next = nextByruleStep(next, unitRule, advance)

  if (shouldTickFreqStepForBymonthday(next, unitRule)) {
    next = add(next, {
      month: 1
    })

    next = set(next, 'day', 0)

    return nextByruleStep(next, unitRule, advance)
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
  console.log('nextByday', unit, byrule)
  if (unit === 'byyearday') {
    return nextYearday(next, byrule as number[], advance)
  }

  if (unit === 'bymonthday') {
    return nextMonthday(next, { unit, byrule }, advance)
  }

  return nextWeekday(next, byrule as Weekday[], advance)
}
