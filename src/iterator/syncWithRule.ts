import {
  nextByruleStep,
  nextDayStep,
  shouldTickFreqStepForByday,
  shouldTickFreqStepForBymonthday
} from './nextByruleStep'
import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { dayOfYear, dayOfWeek, days } from '../DateTime/dayOfWeek'
import { copy } from '../copy'
import { add } from '../DateTime/add'
import { FREQUENCY_ORDER, byRuleForUnit, FREQUENCY_COUNTER } from './units'
import { Weekday } from '../types'
import { set } from '../DateTime/set'

export const syncWithRule = (current: DateTime, options: GroomedOptions) => {
  let next = copy(current)
  FREQUENCY_ORDER.forEach(unit => {
    const byrule = byRuleForUnit(unit, options)
    if (!byrule) {
      return
    }

    if (unit === 'day') {
      if (options.byyearday) {
        next = nextYearday(next, byrule as number[])
      } else if (options.bymonthday) {
        console.log('bymonthday')
        next = nextByruleStep(unit)(next, byrule as number[], false)
        if (shouldTickFreqStepForBymonthday(next, byrule as number[])) {
          next = add(next, {
            month: 1
          })

          next = set(next, 'day', 0)

          next = nextByruleStep(unit)(next, byrule as number[], false)
          console.log({ bumpingHigher: next })
        }

        console.log({ next })
      } else {
        next = nextDayStep(next, byrule as Weekday[])
        if (shouldTickFreqStepForByday(next, byrule as Weekday[])) {
          next = add(next, {
            day: 7 - days.indexOf(dayOfWeek(next))
          })

          next = nextDayStep(next, byrule as Weekday[])
          console.log({ bumpingHigher: next })
        }
        console.log({ next })
      }
    } else {
      next = nextByruleStep(unit)(next, byrule as number[], false)
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
