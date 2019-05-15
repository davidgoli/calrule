import { nextByruleStep, nextDayStep } from './nextByruleStep'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { compare } from '../DateTime/compare'
import { dayOfYear } from '../DateTime/dayOfWeek'
import { copy } from '../copy'
import { add } from '../DateTime/add'
import { FREQUENCY_ORDER, byRuleForUnit } from './units'
import { Weekday } from '../types'

const nextSecond = nextByruleStep('second')
const nextMinute = nextByruleStep('minute')
const nextHour = nextByruleStep('hour')
const nextMonthday = nextByruleStep('day')
const nextMonth = nextByruleStep('month')

export const syncWithRule = (current: DateTime, options: GroomedOptions) => {
  let next = copy(current)
  FREQUENCY_ORDER.forEach(unit => {
    const byrule = byRuleForUnit(unit, options)
    if (byrule) {
      if (unit === 'day') {
        next = nextDayStep(current, byrule as Weekday[])
      } else {
        next = nextByruleStep(unit)(next, byrule as number[], false)
      }
    }
  })

  if (options.bymonthday) {
    const next = nextMonthday(current, options.bymonthday)
    if (compare(next, current) !== 0) {
      return next
    }
  }

  if (options.bymonth) {
    const next = nextMonth(current, options.bymonth)
    if (compare(next, current) !== 0) {
      return next
    }
  }

  if (options.byyearday) {
    const next = nextYearday(current, options.byyearday)
    if (compare(next, current) !== 0) {
      return next
    }
  }

  return next
}

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
