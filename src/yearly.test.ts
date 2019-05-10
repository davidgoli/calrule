import { rrule } from './index'

it('generates the correct number of occurences', () => {
  const result = rrule({
    dtstart: '2016-04-05T13:25:34',
    count: 10,
    freq: 'YEARLY'
  })

  expect(result).toHaveLength(10)
})

it('generates the correct occurences', () => {
  const result = rrule({
    dtstart: '2016-04-05T13:25:54',
    count: 10,
    freq: 'YEARLY'
  })

  expect(result).toEqual([
    '2016-04-05T13:25:54',
    '2017-04-05T13:25:54',
    '2018-04-05T13:25:54',
    '2019-04-05T13:25:54',
    '2020-04-05T13:25:54',
    '2021-04-05T13:25:54',
    '2022-04-05T13:25:54',
    '2023-04-05T13:25:54',
    '2024-04-05T13:25:54',
    '2025-04-05T13:25:54'
  ])
})

it('supports interval', () => {
  const result = rrule({
    dtstart: '2016-04-05T13:25:54',
    count: 10,
    freq: 'YEARLY',
    interval: 2
  })

  expect(result).toEqual([
    '2016-04-05T13:25:54',
    '2018-04-05T13:25:54',
    '2020-04-05T13:25:54',
    '2022-04-05T13:25:54',
    '2024-04-05T13:25:54',
    '2026-04-05T13:25:54',
    '2028-04-05T13:25:54',
    '2030-04-05T13:25:54',
    '2032-04-05T13:25:54',
    '2034-04-05T13:25:54'
  ])
})
