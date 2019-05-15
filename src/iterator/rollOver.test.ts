import { rollOver } from './rollOver'
import { GroomedOptions } from '../groomOptions'
import { DateTime } from '../DateTime/index'

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
  expect(rollOver(startDate, 'second', options)).toEqual({
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

  expect(rollOver(startDate, 'second', options)).toEqual({
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
  options.byhour = [2]

  expect(rollOver(startDate, 'hour', options)).toEqual({
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

  expect(rollOver(startDate, 'hour', options)).toEqual({
    year: 2017,
    month: 3 as 3,
    day: 3,
    hour: 0,
    minute: 0,
    second: 12
  })
})
