import { DateTime } from '../DateTime/index'
import { parseISO } from '../DateTime/parseISO'
import { toISO } from '../DateTime/toISO'
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

it('does not move forwards unnecessarily', () => {
  const options: GroomedOptions = {
    dtstart: {
      year: 2016,
      month: 2 as 2,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0
    },
    freq: 'HOURLY',
    interval: 12,
    byday: ['MO', 'WE']
  }

  const date: DateTime = {
    year: 2017,
    month: 1,
    day: 2,
    hour: 0,
    minute: 0,
    second: 0
  }

  expect(syncWithRule(date, options)).toEqual({
    year: 2017,
    month: 1 as 1,
    day: 2,
    hour: 0,
    minute: 0,
    second: 0
  })
})

it('rolls back byyearday', () => {
  const startDate = parseISO('2017-02-12T00:00:00')!
  const options: GroomedOptions = {
    dtstart: parseISO('2017-01-01')!,
    freq: 'YEARLY',
    interval: 1,
    byyearday: [2, 11]
  }

  const result = syncWithRule(startDate, options)
  expect(toISO(result)).toEqual('2017-01-11T00:00:00')
})
