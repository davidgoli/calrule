import { compare } from '../DateTime/compare'
import { parseISO } from '../DateTime/parseISO'
import { toISO } from '../DateTime/toISO'
import { syncByrule } from './syncByrule'

const d = parseISO('1980-01-01T00:00:00')!

it('returns the original if no unitRule', () => {
  const result = syncByrule(d, undefined)
  expect(compare(d, result)).toEqual(0)
})

describe('BYDAY', () => {
  it('moves the day forward if it is behind', () => {
    const result = syncByrule(d, {
      unit: 'byday',
      byrule: ['WE']
    })

    expect(toISO(result)).toEqual('1980-01-02T00:00:00')
  })

  it('moves the day into the next week if necessary', () => {
    const result = syncByrule(d, {
      unit: 'byday',
      byrule: ['MO']
    })

    expect(toISO(result)).toEqual('1980-01-07T00:00:00')
  })

  it('does not move the day forward if it already matches', () => {
    const nextResult = syncByrule(parseISO('1980-01-07T00:00:00')!, {
      unit: 'byday',
      byrule: ['MO']
    })

    expect(toISO(nextResult)).toEqual('1980-01-07T00:00:00')
  })

  it('does not move the day forward if it is the last of the month', () => {
    const nextResult = syncByrule(parseISO('1980-01-31T00:00:00')!, {
      unit: 'byday',
      byrule: ['TH']
    })

    expect(toISO(nextResult)).toEqual('1980-01-31T00:00:00')
  })

  it('moves the day back to the last match if it is over', () => {
    const nextResult = syncByrule(parseISO('1980-01-29T00:00:00')!, {
      unit: 'byday',
      byrule: ['MO']
    })

    expect(toISO(nextResult)).toEqual('1980-01-28T00:00:00')
  })
})

describe('BYHOUR', () => {
  it('moves the hour forward if it is behind', () => {
    const result = syncByrule(d, {
      unit: 'byhour',
      byrule: [20]
    })

    expect(toISO(result)).toEqual('1980-01-01T20:00:00')
  })

  it('clamps the hour to the last byhour if it is over', () => {
    const d = parseISO('1980-01-01T21:00:00')!
    const result = syncByrule(d, {
      unit: 'byhour',
      byrule: [2, 20]
    })

    expect(toISO(result)).toEqual('1980-01-01T20:00:00')
  })

  it('does not move the hour forward if it already matches', () => {
    const nextResult = syncByrule(parseISO('1980-01-01T20:00:00')!, {
      unit: 'byhour',
      byrule: [20]
    })

    expect(toISO(nextResult)).toEqual('1980-01-01T20:00:00')
  })
})

describe('BYYEARDAY', () => {
  it('moves the date forward if it is behind', () => {
    const result = syncByrule(parseISO('1980-01-01')!, {
      unit: 'byyearday',
      byrule: [20]
    })

    expect(toISO(result)).toEqual('1980-01-20T00:00:00')
  })

  it('moves the date forward into the next month if it is behind', () => {
    const result = syncByrule(parseISO('1980-01-01')!, {
      unit: 'byyearday',
      byrule: [40]
    })

    expect(toISO(result)).toEqual('1980-02-09T00:00:00')
  })

  it('does not move the day if it matches', () => {
    const result = syncByrule(parseISO('1980-02-09')!, {
      unit: 'byyearday',
      byrule: [40, 50]
    })

    expect(toISO(result)).toEqual('1980-02-09T00:00:00')
  })

  it('clamps the date back to the last if it is ahead', () => {
    const result = syncByrule(parseISO('1980-03-01')!, {
      unit: 'byyearday',
      byrule: [40]
    })

    expect(toISO(result)).toEqual('1980-02-09T00:00:00')
  })

  it('clamps the date back to the last if it is ahead', () => {
    const result = syncByrule(parseISO('2017-02-12')!, {
      unit: 'byyearday',
      byrule: [2, 11]
    })

    expect(toISO(result)).toEqual('2017-01-11T00:00:00')
  })
})

describe('BYMONTHDAY', () => {
  it('moves the date forward if it is behind', () => {
    const result = syncByrule(parseISO('1980-01-01')!, {
      unit: 'bymonthday',
      byrule: [20]
    })

    expect(toISO(result)).toEqual('1980-01-20T00:00:00')
  })

  it('moves the date forward into the next month if it is behind', () => {
    const result = syncByrule(parseISO('1980-01-01')!, {
      unit: 'bymonthday',
      byrule: [40]
    })

    expect(toISO(result)).toEqual('1980-02-09T00:00:00')
  })

  it('does not move the day if it matches', () => {
    const result = syncByrule(parseISO('1980-02-09')!, {
      unit: 'bymonthday',
      byrule: [9, 19]
    })

    expect(toISO(result)).toEqual('1980-02-09T00:00:00')
  })

  it('clamps the date back to the last if it is ahead', () => {
    const result = syncByrule(parseISO('1980-03-05')!, {
      unit: 'bymonthday',
      byrule: [4]
    })

    expect(toISO(result)).toEqual('1980-03-04T00:00:00')
  })
})
