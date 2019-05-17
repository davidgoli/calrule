import { rrule } from '../index'

it('generates the correct number of occurences', () => {
  const result = rrule({
    dtstart: '2016-04-05',
    count: 10,
    freq: 'WEEKLY'
  })

  expect(result).toHaveLength(10)
})

it('generates the correct occurences', () => {
  const result = rrule({
    dtstart: '2016-04-05',
    count: 10,
    freq: 'WEEKLY'
  })

  expect(result).toEqual([
    '2016-04-05T00:00:00',
    '2016-04-12T00:00:00',
    '2016-04-19T00:00:00',
    '2016-04-26T00:00:00',
    '2016-05-03T00:00:00',
    '2016-05-10T00:00:00',
    '2016-05-17T00:00:00',
    '2016-05-24T00:00:00',
    '2016-05-31T00:00:00',
    '2016-06-07T00:00:00'
  ])
})

it('supports interval', () => {
  const result = rrule({
    dtstart: '2016-12-25',
    count: 10,
    freq: 'WEEKLY',
    interval: 2
  })

  expect(result).toEqual([
    '2016-12-25T00:00:00',
    '2017-01-08T00:00:00',
    '2017-01-22T00:00:00',
    '2017-02-05T00:00:00',
    '2017-02-19T00:00:00',
    '2017-03-05T00:00:00',
    '2017-03-19T00:00:00',
    '2017-04-02T00:00:00',
    '2017-04-16T00:00:00',
    '2017-04-30T00:00:00'
  ])
})
