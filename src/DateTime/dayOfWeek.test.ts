import { dayOfWeek, dayOfYear, firstWeekdayOfMonth } from './dayOfWeek'

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

it('returns the correct first day of the month', () => {
  expect(
    firstWeekdayOfMonth(
      {
        year: 2017,
        month: 1 as 1,
        day: 1,
        hour: 23,
        minute: 59,
        second: 58
      },
      'WE'
    )
  ).toEqual(4)

  expect(
    firstWeekdayOfMonth(
      {
        year: 2017,
        month: 1 as 1,
        day: 1,
        hour: 23,
        minute: 59,
        second: 58
      },
      'SU'
    )
  ).toEqual(1)
})
