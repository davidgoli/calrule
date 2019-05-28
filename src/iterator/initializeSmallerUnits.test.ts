import { DateTime } from '../DateTime'
import { initializeSmallerUnits } from './initializeSmallerUnits'

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
  const initialized = initializeSmallerUnits(startDate, 'hour')
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
  const initialized = initializeSmallerUnits(startDate, 'year')
  expect(initialized).toEqual({
    year: 2017,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  })
})
