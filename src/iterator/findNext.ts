import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { FREQUENCY_ORDER, FREQUENCY_COUNTER } from './units'
import { tickByrule } from './tickByrule'
import { tickFreqStep } from './tickFreqStep'
import { compare } from '../DateTime/compare'

export const findNext = (
  current: DateTime,
  unit: keyof DateTime,
  options: GroomedOptions
) => {
  let unitIdx = FREQUENCY_ORDER.indexOf(unit)
  const freqIdx = FREQUENCY_ORDER.indexOf(FREQUENCY_COUNTER[options.freq])
  let next: DateTime

  do {
    const currentUnit = FREQUENCY_ORDER[unitIdx]

    if (unitIdx === freqIdx) {
      next = tickFreqStep(current, currentUnit, options)
    } else {
      next = tickByrule(current, currentUnit, options)
    }
  } while (compare(next, current) === 0 && unitIdx-- > 0)

  return next
}
