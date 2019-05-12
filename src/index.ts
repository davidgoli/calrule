import { toISO } from './DateTime/toISO'
import { RuleOptions } from './types'
import { groomOptions } from './groomOptions'
import { makeIterator } from './iterator'
import { makeFilter } from './filter'

export const rrule = (options: RuleOptions): string[] | undefined => {
  const groomedOptions = groomOptions(options)
  if (!groomedOptions) {
    return undefined
  }

  const iterator = makeIterator(groomedOptions)
  const passesFilter = makeFilter(groomedOptions)

  const output = []
  while (iterator.hasNext(output.length)) {
    if (passesFilter(iterator.current)) {
      output.push(toISO(iterator.current))
    }
    iterator.next()
  }

  return output
}
