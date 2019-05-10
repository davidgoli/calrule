import { rrule } from './index'

it('generates the correct number of occurences', () => {
  const result = rrule({
    dtstart: '2016-04-05',
    count: 10,
    freq: 'MONTHLY'
  })

  expect(result).toHaveLength(10)
})

it('generates the correct occurences', () => {
  const result = rrule({
    dtstart: '2016-04-05',
    count: 10,
    freq: 'MONTHLY'
  })

  expect(result).toEqual([
    '2016-04-05T00:00:00',
    '2016-05-05T00:00:00',
    '2016-06-05T00:00:00',
    '2016-07-05T00:00:00',
    '2016-08-05T00:00:00',
    '2016-09-05T00:00:00',
    '2016-10-05T00:00:00',
    '2016-11-05T00:00:00',
    '2016-12-05T00:00:00',
    '2017-01-05T00:00:00'
  ])
})

it('supports interval', () => {
  const result = rrule({
    dtstart: '2016-12-25',
    count: 10,
    freq: 'MONTHLY',
    interval: 2
  })

  expect(result).toEqual([
    '2016-12-25T00:00:00',
    '2017-02-25T00:00:00',
    '2017-04-25T00:00:00',
    '2017-06-25T00:00:00',
    '2017-08-25T00:00:00',
    '2017-10-25T00:00:00',
    '2017-12-25T00:00:00',
    '2018-02-25T00:00:00',
    '2018-04-25T00:00:00',
    '2018-06-25T00:00:00'
  ])
})
