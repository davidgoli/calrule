import { toISO } from './DateTime/toISO'
import { groomOptions } from './groomOptions'
import { makeIterator } from './iterator'
import { RuleOptions } from './types'

export const rrule = (options: RuleOptions): string[] | undefined => {
  const groomedOptions = groomOptions(options)
  if (!groomedOptions) {
    return undefined
  }

  const iterator = makeIterator(groomedOptions)

  const output = []
  while (iterator.hasNext(output.length)) {
    output.push(toISO(iterator.current))
    iterator.next()
  }

  return output
}
