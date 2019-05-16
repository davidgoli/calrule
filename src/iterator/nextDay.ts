import { copy } from '../copy'
import { add } from '../DateTime/add'
import { dayOfWeek, dayOfYear, days } from '../DateTime/dayOfWeek'
import { DateTime } from '../DateTime/index'
import { set } from '../DateTime/set'
import { GroomedOptions } from '../groomOptions'
import { Weekday } from '../types'
import {
  nextByruleStep,
  nextDayStep,
  shouldTickFreqStepForByday,
  shouldTickFreqStepForBymonthday
} from './nextByruleStep'

const nextYearday = (current: DateTime, steps: number[]) => {
  const currentDayOfYear = dayOfYear(current)

  for (let i = 0; i < steps.length; i++) {
    if (currentDayOfYear <= steps[i]) {
      const newCurrent = copy(current)
      newCurrent.month = 1
      newCurrent.day = 0
      return add(newCurrent, { day: steps[i] })
    }
  }

  return current
}

const nextMonthday = (next: DateTime, byrule: number[]) => {
  next = nextByruleStep('day')(next, byrule, false)

  if (shouldTickFreqStepForBymonthday(next, byrule)) {
    next = add(next, {
      month: 1
    })

    next = set(next, 'day', 0)

    return nextByruleStep('day')(next, byrule, false)
  }

  return next
}

const nextWeekday = (next: DateTime, byrule: Weekday[]) => {
  next = nextDayStep(next, byrule)
  if (shouldTickFreqStepForByday(next, byrule)) {
    next = add(next, {
      day: 7 - days.indexOf(dayOfWeek(next))
    })

    return nextDayStep(next, byrule)
  }

  return next
}

export const nextDay = (
  next: DateTime,
  byrule: number[] | Weekday[],
  options: GroomedOptions
) => {
  if (options.byyearday) {
    return nextYearday(next, byrule as number[])
  }

  if (options.bymonthday) {
    return nextMonthday(next, byrule as number[])
  }

  return nextWeekday(next, byrule as Weekday[])
}
