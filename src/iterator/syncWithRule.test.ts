import { DateTime } from '../DateTime/index'
import { GroomedOptions } from '../groomOptions'
import { syncWithRule } from './syncWithRule'

it('moves each unit forward to its equivalent matching the rule', () => {
  const current: DateTime = {
    year: 2017,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  }

  const options: GroomedOptions = {
    dtstart: current,
    freq: 'WEEKLY',
    interval: 1,
    bymonth: [2],
    byday: ['TU'],
    byhour: [2],
    byminute: [34],
    bysecond: [19]
  }

  const synced = syncWithRule(current, options)
  expect(synced).toEqual({
    year: 2017,
    month: 2,
    day: 7,
    hour: 2,
    minute: 34,
    second: 19
  })
})

it("doesn't go too far", () => {
  const current: DateTime = {
    year: 2017,
    month: 1,
    day: 1,
    hour: 0,
    minute: 34,
    second: 0
  }

  const options: GroomedOptions = {
    dtstart: current,
    freq: 'WEEKLY',
    interval: 1,
    bymonth: [2, 4],
    byday: ['TU'],
    byhour: [2, 5],
    byminute: [34, 49],
    bysecond: [19, 23]
  }

  const synced = syncWithRule(current, options)
  expect(synced).toEqual({
    year: 2017,
    month: 2,
    day: 7,
    hour: 2,
    minute: 34,
    second: 19
  })
})

it('does not go backwards', () => {
  const options: GroomedOptions = {
    dtstart: {
      year: 2016,
      month: 2 as 2,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0
    },
    freq: 'SECONDLY',
    interval: 1,
    byhour: [2]
  }

  const date: DateTime = {
    year: 2017,
    month: 3,
    day: 2,
    hour: 3,
    minute: 0,
    second: 0
  }

  expect(syncWithRule(date, options)).toEqual({
    year: 2017,
    month: 3 as 3,
    day: 3,
    hour: 2,
    minute: 0,
    second: 0
  })
})
