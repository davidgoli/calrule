import { rrule } from './index'

it('generates the correct number of occurences', () => {
  const result = rrule({
    dtstart: '2016-04-05T13:25:34',
    count: 10,
    freq: 'MINUTELY'
  })

  expect(result).toHaveLength(10)
})

it('generates the correct occurences', () => {
  const result = rrule({
    dtstart: '2016-04-05T13:55:34',
    count: 10,
    freq: 'MINUTELY'
  })

  expect(result).toEqual([
    '2016-04-05T13:55:34',
    '2016-04-05T13:56:34',
    '2016-04-05T13:57:34',
    '2016-04-05T13:58:34',
    '2016-04-05T13:59:34',
    '2016-04-05T14:00:34',
    '2016-04-05T14:01:34',
    '2016-04-05T14:02:34',
    '2016-04-05T14:03:34',
    '2016-04-05T14:04:34'
  ])
})
