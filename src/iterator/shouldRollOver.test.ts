/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DateTime } from '../DateTime'
import { parseISO } from '../DateTime/parseISO'
import { GroomedOptions } from '../groomOptions'
import { shouldRollOver } from './shouldRollOver'

it('rolls over when the unit has not reached its limit', () => {
  const initial = parseISO('2017-01-01T01:02:03')!
  const options: GroomedOptions = {
    dtstart: initial,
    freq: 'MINUTELY',
    interval: 1,
    bysecond: [3, 15],
    byminute: [4, 7],
    byhour: [6, 9],
    byday: ['TH'],
    bymonth: [6]
  }

  let next = parseISO('2017-01-01T01:02:02')!
  expect(shouldRollOver(next, initial, options)).toEqual('second')

  next = parseISO('2017-01-01T01:02:03')!
  expect(shouldRollOver(next, initial, options)).toEqual('minute')

  next = parseISO('2017-01-01T01:02:15')!
  expect(shouldRollOver(next, initial, options)).toEqual('minute')

  next = parseISO('2017-01-01T01:07:15')!
  expect(shouldRollOver(next, initial, options)).toEqual('hour')

  next = parseISO('2017-01-01T09:07:15')!
  expect(shouldRollOver(next, initial, options)).toEqual('day')

  next = parseISO('2017-01-05T09:07:15')!
  expect(shouldRollOver(next, initial, options)).toEqual('month')

  next = parseISO('2017-06-29T09:07:15')!
  expect(shouldRollOver(next, initial, options)).toBeUndefined()

  next = parseISO('2017-06-01T09:07:15')!
  expect(shouldRollOver(next, initial, options)).toBeUndefined()
})

it('returns undefined when the date matches', () => {
  const initial: DateTime = {
    year: 2017,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  }
  const next: DateTime = {
    year: 2017,
    month: 2,
    day: 7,
    hour: 2,
    minute: 34,
    second: 19
  }
  const options: GroomedOptions = {
    dtstart: initial,
    freq: 'DAILY',
    interval: 1,
    bymonth: [2, 4],
    byday: ['TU'],
    byhour: [2, 5],
    byminute: [34, 49],
    bysecond: [19, 23]
  }

  expect(shouldRollOver(next, initial, options)).toBeUndefined()
})
