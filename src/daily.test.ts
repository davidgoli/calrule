import { rrule } from './index'

it('generates the correct number of occurences', () => {
  const result = rrule({
    dtstart: '2016-04-05',
    count: 10,
    freq: 'DAILY'
  })

  expect(result).toHaveLength(10)
})

it('generates the correct occurences', () => {
  const result = rrule({
    dtstart: '2016-04-05',
    count: 10,
    freq: 'DAILY'
  })

  expect(result).toEqual([
    '2016-04-05T00:00:00',
    '2016-04-06T00:00:00',
    '2016-04-07T00:00:00',
    '2016-04-08T00:00:00',
    '2016-04-09T00:00:00',
    '2016-04-10T00:00:00',
    '2016-04-11T00:00:00',
    '2016-04-12T00:00:00',
    '2016-04-13T00:00:00',
    '2016-04-14T00:00:00'
  ])
})

it('rolls months over correctly', () => {
  const result = rrule({
    dtstart: '2016-04-25',
    count: 10,
    freq: 'DAILY'
  })

  expect(result).toEqual([
    '2016-04-25T00:00:00',
    '2016-04-26T00:00:00',
    '2016-04-27T00:00:00',
    '2016-04-28T00:00:00',
    '2016-04-29T00:00:00',
    '2016-04-30T00:00:00',
    '2016-05-01T00:00:00',
    '2016-05-02T00:00:00',
    '2016-05-03T00:00:00',
    '2016-05-04T00:00:00'
  ])
})

it('rolls years over correctly', () => {
  const result = rrule({
    dtstart: '2016-12-25',
    count: 10,
    freq: 'DAILY'
  })

  expect(result).toEqual([
    '2016-12-25T00:00:00',
    '2016-12-26T00:00:00',
    '2016-12-27T00:00:00',
    '2016-12-28T00:00:00',
    '2016-12-29T00:00:00',
    '2016-12-30T00:00:00',
    '2016-12-31T00:00:00',
    '2017-01-01T00:00:00',
    '2017-01-02T00:00:00',
    '2017-01-03T00:00:00'
  ])
})
