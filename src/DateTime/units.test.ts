/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { parseISO } from './parseISO'
import {
  dayOfWeek,
  dayOfYear,
  diffInDays,
  firstWeekdayOfMonth,
  weeksInYear
} from './units'

it('returns the weekday of the DateTime', () => {
  expect(dayOfWeek({ year: 2017, month: 1, day: 1 })).toEqual('SU')
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

describe('firstWeekdayOfMonth', () => {
  it('returns the correct first day of the month', () => {
    expect(firstWeekdayOfMonth(2017, 1, 'WE')).toEqual(4)

    expect(firstWeekdayOfMonth(2017, 1, 'SU')).toEqual(1)
  })
})

describe('weeksInYear', () => {
  it('returns the correct number of weeks', () => {
    expect(weeksInYear(2009)).toEqual(53)
    expect(weeksInYear(2010)).toEqual(52)
    expect(weeksInYear(2011)).toEqual(52)
    expect(weeksInYear(2012)).toEqual(52)
    expect(weeksInYear(2013)).toEqual(52)
    expect(weeksInYear(2014)).toEqual(52)
    expect(weeksInYear(2015)).toEqual(53)
    expect(weeksInYear(2016)).toEqual(52)
    expect(weeksInYear(2017)).toEqual(52)
    expect(weeksInYear(2018)).toEqual(52)
    expect(weeksInYear(2019)).toEqual(52)
    expect(weeksInYear(2020)).toEqual(53)
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
