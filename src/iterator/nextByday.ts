import { copy } from '../copy'
import { add } from '../DateTime/add'
import { dayOfWeek, dayOfYear, WEEKDAYS } from '../DateTime/dayOfWeek'
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

const nextYearday = (current: DateTime, steps: number[], advance: boolean) => {
  const currentDayOfYear = dayOfYear(current)

  for (let i = 0; i < steps.length; i++) {
    if (advance ? currentDayOfYear <= steps[i] : currentDayOfYear < steps[i]) {
      const newCurrent = copy(current)
      newCurrent.month = 1
      newCurrent.day = 0
      return add(newCurrent, { day: steps[i] })
    }
  }

  return current
}

const nextMonthday = (next: DateTime, byrule: number[], advance: boolean) => {
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
  byrule: number[] | Weekday[],
  options: GroomedOptions,
  advance = true
) => {
  if (options.byyearday) {
    return nextYearday(next, byrule as number[], advance)
  }

  if (options.bymonthday) {
    return nextMonthday(next, byrule as number[], advance)
  }

  return nextWeekday(next, byrule as Weekday[], advance)
}
