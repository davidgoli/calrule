import { dayOfWeek, dayOfYear } from './dayOfWeek'

it('returns the weekday of the DateTime', () => {
  expect(
    dayOfWeek({ year: 2017, month: 1, day: 1, hour: 0, minute: 0, second: 0 })
  ).toEqual('SU')
})

it('returns the current day of the year', () => {
  expect(
    dayOfYear({
      year: 2017,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0
    })
  ).toEqual(1)

  expect(
    dayOfYear({
      year: 2017,
      month: 2,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0
    })
  ).toEqual(32)
})
