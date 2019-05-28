/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { DateTime } from '../DateTime'
import { parseISO } from '../DateTime/parseISO'
import { toISO } from '../DateTime/toISO'
import { GroomedOptions } from '../groomOptions'
import { findNext } from './findNext'

let options: GroomedOptions
let startDate: DateTime

beforeEach(() => {
  options = {
    dtstart: {
      year: 2016,
      month: 2 as 2,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0
    },
    freq: 'SECONDLY',
    interval: 1
  }

  startDate = {
    year: 2017,
    month: 3 as 3,
    day: 2,
    hour: 23,
    minute: 59,
    second: 58
  }
})

it('increments a datetime by a second', () => {
  expect(findNext(startDate, options)).toEqual({
    year: 2017,
    month: 3 as 3,
    day: 2,
    hour: 23,
    minute: 59,
    second: 59
  })
})

it('rolls over the date time to the next threshold', () => {
  startDate.second = 59

  expect(findNext(startDate, options)).toEqual({
    year: 2017,
    month: 3 as 3,
    day: 3,
    hour: 0,
    minute: 0,
    second: 0
  })
})

it('rolls over the date time to the next byrule if present', () => {
  startDate = parseISO('2017-03-02T02:59:59')!

  options.byhour = [2]

  expect(toISO(findNext(startDate, options))).toEqual('2017-03-03T02:00:00')
})

it('rolls over the date time to the next smaller byrule if present', () => {
  startDate.second = 59
  options.bysecond = [12]

  expect(findNext(startDate, options)).toEqual({
    year: 2017,
    month: 3 as 3,
    day: 3,
    hour: 0,
    minute: 0,
    second: 12
  })
})

it('moves a non-synchronized date to the first synchronized position', () => {
  startDate = {
    year: 2017,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  }

  options.dtstart = {
    year: 2017,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  }
  options.freq = 'HOURLY'
  options.interval = 12
  options.byday = ['MO', 'WE']

  expect(findNext(startDate, options)).toEqual({
    year: 2017,
    month: 1,
    day: 2,
    hour: 0,
    minute: 0,
    second: 0
  })
})

it('rolls over hourly with a byday', () => {
  startDate = {
    year: 2017,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  }

  options.dtstart = {
    year: 2017,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  }
  options.freq = 'HOURLY'
  options.interval = 12
  options.byday = ['MO', 'WE']

  expect(findNext(startDate, options)).toEqual({
    year: 2017,
    month: 1,
    day: 2,
    hour: 0,
    minute: 0,
    second: 0
  })
})

it('rolls over hourly with a synced byday', () => {
  startDate = {
    year: 2017,
    month: 1,
    day: 2,
    hour: 0,
    minute: 0,
    second: 0
  }

  options.dtstart = {
    year: 2017,
    month: 1,
    day: 2,
    hour: 0,
    minute: 0,
    second: 0
  }
  options.freq = 'HOURLY'
  options.interval = 12
  options.byday = ['MO', 'WE']

  expect(findNext(startDate, options)).toEqual({
    year: 2017,
    month: 1,
    day: 2,
    hour: 12,
    minute: 0,
    second: 0
  })
})

it('rolls over yearly with a byyearday rule', () => {
  startDate = parseISO('2017-03-12T00:00:00')!

  options.dtstart = startDate
  options.freq = 'YEARLY'
  options.byyearday = [2, 41]

  expect(toISO(findNext(startDate, options))).toEqual('2018-01-02T00:00:00')
})

it('does not roll over yearly on byyearday when it should not', () => {
  startDate = {
    year: 2017,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  }

  options.freq = 'YEARLY'
  options.byyearday = [2, 41]

  const result = findNext(startDate, options)

  expect(toISO(result)).toEqual('2017-01-02T00:00:00')

  const nextResult = findNext(result, options)
  expect(toISO(nextResult)).toEqual('2017-02-10T00:00:00')
})

it('does not roll over yearly on bymonthday when it should not', () => {
  startDate = {
    year: 2017,
    month: 1,
    day: 2,
    hour: 0,
    minute: 0,
    second: 0
  }

  options.freq = 'YEARLY'
  options.bymonthday = [2, 11]

  const result = findNext(startDate, options)

  expect(toISO(result)).toEqual('2017-01-11T00:00:00')

  const nextResult = findNext(result, options)
  expect(toISO(nextResult)).toEqual('2017-02-02T00:00:00')
})

it('does not roll over monthly on byday when it should not', () => {
  startDate = {
    year: 2017,
    month: 1,
    day: 2,
    hour: 0,
    minute: 0,
    second: 0
  }

  options.freq = 'MONTHLY'
  options.byday = ['WE']
  options.interval = 2

  let result = findNext(startDate, options)
  expect(toISO(result)).toEqual('2017-01-04T00:00:00')

  result = findNext(result, options)
  expect(toISO(result)).toEqual('2017-01-11T00:00:00')

  result = findNext(result, options)
  expect(toISO(result)).toEqual('2017-01-18T00:00:00')

  result = findNext(result, options)
  expect(toISO(result)).toEqual('2017-01-25T00:00:00')
})

it('rolls over intervals correctly', () => {
  startDate = parseISO('2017-01-25T00:00:00')!

  options.freq = 'MONTHLY'
  options.byday = ['WE']
  options.interval = 2

  const result = findNext(startDate, options)
  expect(toISO(result)).toEqual('2017-03-01T00:00:00')
})
