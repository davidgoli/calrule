import { rrule } from './index'

it('generates the correct number of occurences', () => {
  const result = rrule({
    dtstart: '2016-04-05T13:25:34',
    count: 10,
    freq: 'SECONDLY'
  })

  expect(result).toHaveLength(10)
})

it('generates the correct occurences', () => {
  const result = rrule({
    dtstart: '2016-04-05T13:25:54',
    count: 10,
    freq: 'SECONDLY'
  })

  expect(result).toEqual([
    '2016-04-05T13:25:54',
    '2016-04-05T13:25:55',
    '2016-04-05T13:25:56',
    '2016-04-05T13:25:57',
    '2016-04-05T13:25:58',
    '2016-04-05T13:25:59',
    '2016-04-05T13:26:00',
    '2016-04-05T13:26:01',
    '2016-04-05T13:26:02',
    '2016-04-05T13:26:03'
  ])
})

it('supports interval', () => {
  const result = rrule({
    dtstart: '2016-04-05T13:25:54',
    count: 10,
    freq: 'SECONDLY',
    interval: 2
  })

  expect(result).toEqual([
    '2016-04-05T13:25:54',
    '2016-04-05T13:25:56',
    '2016-04-05T13:25:58',
    '2016-04-05T13:26:00',
    '2016-04-05T13:26:02',
    '2016-04-05T13:26:04',
    '2016-04-05T13:26:06',
    '2016-04-05T13:26:08',
    '2016-04-05T13:26:10',
    '2016-04-05T13:26:12'
  ])
})
