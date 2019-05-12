import { dayOfWeek } from './dayOfWeek'

it('returns the weekday of the DateTime', () => {
  expect(
    dayOfWeek({ year: 2017, month: 1, day: 1, hour: 0, minute: 0, second: 0 })
  ).toEqual('SU')
})
