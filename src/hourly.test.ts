import { rrule } from './index'

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