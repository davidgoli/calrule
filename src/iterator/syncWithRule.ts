import { nextByruleStep, nextDayStep } from './nextByruleStep'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { dayOfYear } from '../DateTime/dayOfWeek'
import { copy } from '../copy'
import { add } from '../DateTime/add'
import { FREQUENCY_ORDER, byRuleForUnit } from './units'
import { Weekday } from '../types'

export const syncWithRule = (current: DateTime, options: GroomedOptions) => {
  let next = copy(current)
  FREQUENCY_ORDER.forEach(unit => {
    const byrule = byRuleForUnit(unit, options)
    if (byrule) {
      if (unit === 'day') {
        if (options.byyearday) {
          next = nextYearday(next, byrule as number[])
        } else if (options.bymonthday) {
          next = nextByruleStep(unit)(next, byrule as number[], false)
        } else {
          next = nextDayStep(next, byrule as Weekday[])
        }
      } else {
        next = nextByruleStep(unit)(next, byrule as number[], false)
      }
    }
  })

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
