import { DateTime } from '../DateTime/index'
import { initializeFrom } from './initializeFrom'

let startDate: DateTime

beforeEach(() => {
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
  const initialized = initializeFrom(startDate, 'hour')
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
  const initialized = initializeFrom(startDate, 'year')
  expect(initialized).toEqual({
    year: 2017,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  })
})
