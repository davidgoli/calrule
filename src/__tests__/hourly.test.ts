import { rrule } from '../index'

it('generates the correct number of occurences', () => {
  const result = rrule({
    dtstart: '2016-04-05T13:25:34',
    count: 10,
    freq: 'HOURLY'
  })

  expect(result).toHaveLength(10)
})

it('generates the correct occurences', () => {
  const result = rrule({
    dtstart: '2016-04-05T13:25:34',
    count: 10,
    freq: 'HOURLY'
  })

  expect(result).toEqual([
    '2016-04-05T13:25:34',
    '2016-04-05T14:25:34',
    '2016-04-05T15:25:34',
    '2016-04-05T16:25:34',
    '2016-04-05T17:25:34',
    '2016-04-05T18:25:34',
    '2016-04-05T19:25:34',
    '2016-04-05T20:25:34',
    '2016-04-05T21:25:34',
    '2016-04-05T22:25:34'
  ])
})

it('supports interval', () => {
  const result = rrule({
    dtstart: '2016-04-05T13:25:34',
    count: 10,
    freq: 'HOURLY',
    interval: 2
  })

  expect(result).toEqual([
    '2016-04-05T13:25:34',
    '2016-04-05T15:25:34',
    '2016-04-05T17:25:34',
    '2016-04-05T19:25:34',
    '2016-04-05T21:25:34',
    '2016-04-05T23:25:34',
    '2016-04-06T01:25:34',
    '2016-04-06T03:25:34',
    '2016-04-06T05:25:34',
    '2016-04-06T07:25:34'
  ])
})

it('supports interval with no time given', () => {
  const result = rrule({
    dtstart: '2016-04-05',
    count: 10,
    freq: 'HOURLY',
    interval: 12
  })

  expect(result).toEqual([
    '2016-04-05T00:00:00',
    '2016-04-05T12:00:00',
    '2016-04-06T00:00:00',
    '2016-04-06T12:00:00',
    '2016-04-07T00:00:00',
    '2016-04-07T12:00:00',
    '2016-04-08T00:00:00',
    '2016-04-08T12:00:00',
    '2016-04-09T00:00:00',
    '2016-04-09T12:00:00'
  ])
})

it('supports until', () => {
  const result = rrule({
    dtstart: '2016-04-05T13:25:34',
    until: '2016-04-05T16:26:34',
    freq: 'HOURLY'
  })

  expect(result).toEqual([
    '2016-04-05T13:25:34',
    '2016-04-05T14:25:34',
    '2016-04-05T15:25:34',
    '2016-04-05T16:25:34'
  ])
})

it('includes the last occurrence with until if it matches dtstart', () => {
  const result = rrule({
    dtstart: '2016-04-05T13:25:34',
    until: '2016-04-05T16:25:34',
    freq: 'HOURLY'
  })

  expect(result).toEqual([
    '2016-04-05T13:25:34',
    '2016-04-05T14:25:34',
    '2016-04-05T15:25:34',
    '2016-04-05T16:25:34'
  ])
})
