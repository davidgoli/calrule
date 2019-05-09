import { toISO } from './toISO'

it('stringifies DateTimes', () => {
  const result = toISO({
    year: 2013,
    month: 4,
    day: 13,
    hour: 3,
    minute: 24,
    second: 44
  })
  expect(result).toEqual('2013-04-13T03:24:44')
})
