import { isRealDate } from './isValidDate'
import { DateTime } from './index'

it('is not valid if the day does not exist', () => {
  expect(
    isRealDate({
      year: 2017,
      month: 2,
      day: 31,
      hour: 0,
      minute: 0,
      second: 0
    } as DateTime)
  ).toBeFalsy()
})

it('is not valid if the hour does not exist', () => {
  expect(
    isRealDate({
      year: 2017,
      month: 2,
      day: 28,
      hour: 24,
      minute: 0,
      second: 0
    } as DateTime)
  ).toBeFalsy()
})

it('is valid if everything is in range', () => {
  expect(
    isRealDate({
      year: 2017,
      month: 2,
      day: 28,
      hour: 0,
      minute: 0,
      second: 0
    } as DateTime)
  ).toBeTruthy()
})
