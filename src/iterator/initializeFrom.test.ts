import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { initializeFrom } from './initializeFrom'

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

it('initializes smaller units from hour', () => {
  const initialized = initializeFrom(startDate, 'hour', options)
  expect(initialized).toEqual({
    year: 2017,
    month: 3,
    day: 2,
    hour: 23,
    minute: 0,
    second: 0
  })
})

it('initializes smaller units from year', () => {
  const initialized = initializeFrom(startDate, 'year', options)
  expect(initialized).toEqual({
    year: 2017,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  })
})
