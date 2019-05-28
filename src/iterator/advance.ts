import { add } from '../DateTime/add'
import { DateTime } from '../DateTime/index'
import { dayOfWeek, dayOrdinalOfWeek } from '../DateTime/units'
import { GroomedOptions } from '../groomOptions'
import { FREQUENCY_COUNTER } from './units'

const strideToRollover = (
  next: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  const lastByday = options.byday && options.byday[options.byday.length - 1]
  const wday = dayOfWeek(next)

  const weeklyStride =
    unit === 'day' &&
    options.freq === 'WEEKLY' &&
    (!options.byday || (wday === lastByday && options.interval > 1))

  const base = weeklyStride ? 7 : 1
  const interval =
    unit === FREQUENCY_COUNTER[options.freq] ? options.interval : 1

  return base * interval - (weeklyStride ? dayOrdinalOfWeek(next) : 0)
}

export const advanceUnit = (
  next: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) =>
  add(next, {
    [unit]: strideToRollover(next, unit, options)
  })
