import { add } from '../DateTime/add'
import { DateTime } from '../DateTime/index'
import { parseISO } from '../DateTime/parseISO'
import { toISO } from '../DateTime/toISO'
import { GroomedOptions } from '../groomOptions'
import { syncWithRule } from './syncWithRule'

it('moves each unit forward to its equivalent matching the rule', () => {
  const current: DateTime = parseISO('2017-01-01T00:00:00')!

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
  expect(toISO(synced)).toEqual('2017-02-07T02:34:19')
})

it("doesn't go too far", () => {
  const current: DateTime = parseISO('2017-01-01T00:34:00')!

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
  expect(toISO(synced)).toEqual('2017-02-07T02:34:19')
})

it('does not move forwards unnecessarily', () => {
  const startDate = parseISO('2017-01-02T00:00:00')!

  const options: GroomedOptions = {
    dtstart: startDate,
    freq: 'HOURLY',
    interval: 12,
    byday: ['MO', 'WE']
  }

  expect(toISO(syncWithRule(startDate, options))).toEqual('2017-01-02T00:00:00')
})

it('rolls over when necessary', () => {
  const startDate = parseISO('2017-02-12T23:32:00')!
  const options: GroomedOptions = {
    dtstart: startDate,
    freq: 'DAILY',
    interval: 1,
    byhour: [2, 23],
    byminute: [0]
  }

  const result = syncWithRule(startDate, options)
  expect(toISO(result)).toEqual('2017-02-13T02:00:00')
})

it('rolls forward byyearday', () => {
  const startDate = parseISO('2017-02-12T00:00:00')!
  const options: GroomedOptions = {
    dtstart: startDate,
    freq: 'YEARLY',
    interval: 1,
    byyearday: [2, 11]
  }

  const result = syncWithRule(startDate, options)
  expect(toISO(result)).toEqual('2018-01-02T00:00:00')
})

it('rolls over the date time to the next smaller byrule if present', () => {
  const startDate = parseISO('2017-03-02T23:59:59')!

  const options: GroomedOptions = {
    dtstart: parseISO('2017-03-02T00:00:00')!,
    freq: 'SECONDLY',
    interval: 1,
    bysecond: [12]
  }

  expect(toISO(syncWithRule(startDate, options))).toEqual('2017-03-03T00:00:12')
})

it('rolls over the date time to the next byrule if present', () => {
  const startDate = parseISO('2017-03-02T03:00:00')!

  const options: GroomedOptions = {
    dtstart: startDate,
    freq: 'SECONDLY',
    interval: 1,
    byhour: [2]
  }

  expect(toISO(syncWithRule(startDate, options))).toEqual('2017-03-03T02:00:00')
})

it('rolls over with SECONDLY', () => {
  const startDate = parseISO('2017-03-02T02:59:59')!

  const options: GroomedOptions = {
    dtstart: startDate,
    freq: 'SECONDLY',
    interval: 1
  }

  expect(toISO(syncWithRule(add(startDate, { second: 1 }), options))).toEqual(
    '2017-03-02T03:00:00'
  )
})

it('rolls over with MINUTELY', () => {
  const startDate = parseISO('2017-03-02T02:59:59')!

  const options: GroomedOptions = {
    dtstart: startDate,
    freq: 'MINUTELY',
    interval: 1
  }

  expect(toISO(syncWithRule(add(startDate, { second: 1 }), options))).toEqual(
    '2017-03-02T03:00:59'
  )
})

it('rolls over with HOURLY', () => {
  const startDate = parseISO('2017-03-02T02:59:59')!

  const options: GroomedOptions = {
    dtstart: startDate,
    freq: 'HOURLY',
    interval: 1
  }

  expect(toISO(syncWithRule(add(startDate, { second: 1 }), options))).toEqual(
    '2017-03-02T03:59:59'
  )
})

it('rolls over with DAILY', () => {
  const startDate = parseISO('2017-03-02T02:59:59')!

  const options: GroomedOptions = {
    dtstart: startDate,
    freq: 'DAILY',
    interval: 1
  }

  expect(toISO(syncWithRule(add(startDate, { second: 1 }), options))).toEqual(
    '2017-03-03T02:59:59'
  )
})

it('rolls over with WEEKLY', () => {
  const startDate = parseISO('2017-03-02T02:59:59')!

  const options: GroomedOptions = {
    dtstart: startDate,
    freq: 'WEEKLY',
    interval: 1
  }

  expect(toISO(syncWithRule(add(startDate, { second: 1 }), options))).toEqual(
    '2017-03-09T02:59:59'
  )
})

it('rolls over with MONTHLY', () => {
  const startDate = parseISO('2017-03-02T02:59:59')!

  const options: GroomedOptions = {
    dtstart: startDate,
    freq: 'MONTHLY',
    interval: 1
  }

  expect(toISO(syncWithRule(add(startDate, { second: 1 }), options))).toEqual(
    '2017-04-02T02:59:59'
  )
})

it('works with bymonth', () => {
  const startDate = parseISO('2017-01-01')!

  const options: GroomedOptions = {
    dtstart: startDate,
    freq: 'MONTHLY',
    interval: 1,
    bymonth: [2, 11]
  }

  let result = syncWithRule(startDate, options)

  expect(toISO(result)).toEqual('2017-02-01T00:00:00')

  result = syncWithRule(add(result, { second: 1 }), options)
  expect(toISO(result)).toEqual('2017-11-01T00:00:00')

  // result = syncWithRule(add(result, { second: 1 }), options)
  // expect(toISO(result)).toEqual('2018-02-01T00:00:00')
  // expect(result).toEqual([
  //   '2017-02-01T00:00:00',
  //   '2017-11-01T00:00:00',
  //   '2018-02-01T00:00:00',
  //   '2018-11-01T00:00:00',
  //   '2019-02-01T00:00:00'
  // ])
})

it('rolls over with YEARLY', () => {
  const startDate = parseISO('2017-03-02T02:59:59')!

  const options: GroomedOptions = {
    dtstart: startDate,
    freq: 'YEARLY',
    interval: 1
  }

  expect(toISO(syncWithRule(add(startDate, { second: 1 }), options))).toEqual(
    '2018-03-02T02:59:59'
  )
})

it('rolls forward when there are no byrules', () => {
  const startDate = parseISO('2017-02-02T00:00:00')!
  const options: GroomedOptions = {
    dtstart: parseISO('2017-02-02T00:00:00')!,
    freq: 'DAILY',
    interval: 1,
    byhour: [0],
    byminute: [0],
    bysecond: [0]
  }

  let r = syncWithRule(add(startDate, { second: 1 }), options)
  expect(toISO(r)).toEqual('2017-02-03T00:00:00')

  r = syncWithRule(add(r, { second: 1 }), options)
  expect(toISO(r)).toEqual('2017-02-04T00:00:00')
})

it('rolls forward every byrule', () => {
  const startDate = parseISO('2017-02-02T00:00:00')!
  const options: GroomedOptions = {
    dtstart: startDate,
    freq: 'YEARLY',
    interval: 1,
    bysecond: [10, 50],
    byminute: [20, 30],
    byhour: [2, 21],
    byday: ['WE'],
    bymonth: [3, 5]
  }

  let r = syncWithRule(startDate, options)
  expect(toISO(r)).toEqual('2017-03-08T02:20:10')

  r = syncWithRule(add(r, { second: 1 }), options)
  expect(toISO(r)).toEqual('2017-03-08T02:20:50')

  r = syncWithRule(add(r, { second: 1 }), options)
  expect(toISO(r)).toEqual('2017-03-08T02:30:10')

  r = syncWithRule(add(r, { second: 1 }), options)
  expect(toISO(r)).toEqual('2017-03-08T02:30:50')

  r = syncWithRule(add(r, { second: 1 }), options)
  expect(toISO(r)).toEqual('2017-03-08T21:20:10')

  r = syncWithRule(add(r, { second: 1 }), options)
  expect(toISO(r)).toEqual('2017-03-08T21:20:50')

  r = syncWithRule(add(r, { second: 1 }), options)
  expect(toISO(r)).toEqual('2017-03-08T21:30:10')

  r = syncWithRule(add(r, { second: 1 }), options)
  expect(toISO(r)).toEqual('2017-03-08T21:30:50')

  r = syncWithRule(add(r, { second: 1 }), options)
  expect(toISO(r)).toEqual('2017-03-15T02:20:10')
})

it('supports interval with no time given', () => {
  const options: GroomedOptions = {
    dtstart: parseISO('2016-04-05T00:00:00')!,
    count: 10,
    freq: 'HOURLY',
    interval: 2
  }

  const result = syncWithRule(options.dtstart, options)

  expect(toISO(result)).toEqual('2016-04-05T00:00:00')
})

it('increments byminute', () => {
  const options: GroomedOptions = {
    dtstart: parseISO('2017-01-01T00:02:00')!,
    freq: 'MINUTELY',
    interval: 1,
    count: 5,
    byminute: [2, 13]
  }

  let result = syncWithRule(options.dtstart, options)
  expect(toISO(result)).toEqual('2017-01-01T00:02:00')

  result = syncWithRule(add(result, { second: 1 }), options)
  expect(toISO(result)).toEqual('2017-01-01T00:13:00')
})

it('returns only the days given', () => {
  const options: GroomedOptions = {
    dtstart: parseISO('2017-01-01T02:59:00')!,
    freq: 'MINUTELY',
    interval: 1,
    count: 5,
    byhour: [2, 13]
  }

  let result = syncWithRule(add(options.dtstart, { second: 1 }), options)
  expect(toISO(result)).toEqual('2017-01-01T13:00:00')
})
