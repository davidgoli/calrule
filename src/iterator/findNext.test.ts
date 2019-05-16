import { DateTime } from '../DateTime/index'
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
  startDate.second = 59
  startDate.hour = 2
  options.byhour = [2]

  expect(findNext(startDate, options)).toEqual({
    year: 2017,
    month: 3 as 3,
    day: 3,
    hour: 2,
    minute: 0,
    second: 0
  })
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
  startDate = {
    year: 2017,
    month: 2,
    day: 10,
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
  options.freq = 'YEARLY'
  options.byyearday = [2, 41]

  expect(findNext(startDate, options)).toEqual({
    year: 2018,
    month: 1,
    day: 2,
    hour: 0,
    minute: 0,
    second: 0
  })
})
