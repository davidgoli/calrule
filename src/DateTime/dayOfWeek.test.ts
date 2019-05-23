import {
  dayOfWeek,
  dayOfYear,
  diffInDays,
  firstWeekdayOfMonth,
  lengthOfMonth
} from './dayOfWeek'
import { parseISO } from './parseISO'

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

describe('lengthOfMonth', () => {
  it('gets January right', () => {
    expect(lengthOfMonth(parseISO('1980-01-01')!)).toEqual(31)
  })

  it('gets February right in a leap year', () => {
    expect(lengthOfMonth(parseISO('1980-02-01')!)).toEqual(29)
  })

  it('gets February right in a non-leap year', () => {
    expect(lengthOfMonth(parseISO('1981-02-01')!)).toEqual(28)
  })

  it('gets December right', () => {
    expect(lengthOfMonth(parseISO('1980-12-01')!)).toEqual(31)
  })
})

describe('diffInDays', () => {
  it('returns 0 for no difference', () => {
    expect(
      diffInDays(parseISO('2017-01-01')!, parseISO('2017-01-01')!)
    ).toEqual(0)
  })

  it('returns a simple day subtraction', () => {
    expect(
      diffInDays(parseISO('2017-01-31')!, parseISO('2017-01-01')!)
    ).toEqual(30)
  })

  it('returns a day subtraction involving months', () => {
    expect(
      diffInDays(parseISO('2017-02-28')!, parseISO('2017-01-01')!)
    ).toEqual(58)
  })
})
