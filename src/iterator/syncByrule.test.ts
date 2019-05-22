import { parseISO } from '../DateTime/parseISO'
import { syncByrule } from './syncByrule'

const d = parseISO('1980-01-01T00:00:00')!

it('returns the original if no unitRule', () => {
  const result = syncByrule(d, undefined)
  expect(result).toEqual({})
})

describe('BYDAY', () => {
  it('moves the day forward if it is behind', () => {
    const result = syncByrule(d, {
      unit: 'byday',
      byrule: ['WE']
    })

    expect(result).toEqual({ day: 1 })
  })

  it('moves the day into the next week if necessary', () => {
    const result = syncByrule(d, {
      unit: 'byday',
      byrule: ['MO']
    })

    expect(result).toEqual({ day: 6 })
  })

  it('does not move the day forward if it already matches', () => {
    const result = syncByrule(parseISO('1980-01-07T00:00:00')!, {
      unit: 'byday',
      byrule: ['MO']
    })

    expect(result).toEqual({})
  })

  it('does not move the day forward if it is the last of the month', () => {
    const result = syncByrule(parseISO('1980-01-31T00:00:00')!, {
      unit: 'byday',
      byrule: ['TH']
    })

    expect(result).toEqual({})
  })

  it('moves the day back to the last match if it is over', () => {
    const result = syncByrule(parseISO('1980-01-29T00:00:00')!, {
      unit: 'byday',
      byrule: ['MO']
    })

    expect(result).toEqual({ day: -1 })
  })
})

describe('BYHOUR', () => {
  it('moves the hour forward if it is behind', () => {
    const result = syncByrule(d, {
      unit: 'byhour',
      byrule: [20]
    })

    expect(result).toEqual({ hour: 20 })
  })

  it('clamps the hour to the last byhour if it is over', () => {
    const d = parseISO('1980-01-01T21:00:00')!
    const result = syncByrule(d, {
      unit: 'byhour',
      byrule: [2, 20]
    })

    expect(result).toEqual({ hour: -1 })
  })

  it('does not move the hour forward if it already matches', () => {
    const result = syncByrule(parseISO('1980-01-01T20:00:00')!, {
      unit: 'byhour',
      byrule: [20]
    })

    expect(result).toEqual({})
  })
})

describe('BYYEARDAY', () => {
  it('moves the date forward if it is behind', () => {
    const result = syncByrule(parseISO('1980-01-01')!, {
      unit: 'byyearday',
      byrule: [20]
    })

    expect(result).toEqual({ month: 0, day: 19 })
  })

  it('moves the date forward into the next month if it is behind', () => {
    const result = syncByrule(parseISO('1980-01-01')!, {
      unit: 'byyearday',
      byrule: [40]
    })

    expect(result).toEqual({ month: 0, day: 39 })
  })

  it('does not move the day if it matches', () => {
    const result = syncByrule(parseISO('1980-02-09')!, {
      unit: 'byyearday',
      byrule: [40, 50]
    })

    expect(result).toEqual({ month: -1, day: 31 })
  })

  it('clamps the date back to the last if it is ahead', () => {
    const result = syncByrule(parseISO('1980-03-01')!, {
      unit: 'byyearday',
      byrule: [40]
    })

    expect(result).toEqual({ day: 39, month: -2 })
  })

  it('clamps the date back to the last if it is ahead', () => {
    const result = syncByrule(parseISO('2017-02-12')!, {
      unit: 'byyearday',
      byrule: [2, 11]
    })

    expect(result).toEqual({ day: -1, month: -1 })
  })
})

describe('BYMONTHDAY', () => {
  it('moves the date forward if it is behind', () => {
    const result = syncByrule(parseISO('1980-01-01')!, {
      unit: 'bymonthday',
      byrule: [20]
    })

    expect(result).toEqual({ day: 19 })
  })

  it('moves the date forward into the next month if it is behind', () => {
    const result = syncByrule(parseISO('1980-01-01')!, {
      unit: 'bymonthday',
      byrule: [40]
    })

    expect(result).toEqual({ day: 39 })
  })

  it('does not move the day if it matches', () => {
    const result = syncByrule(parseISO('1980-02-09')!, {
      unit: 'bymonthday',
      byrule: [9, 19]
    })

    expect(result).toEqual({})
  })

  it('clamps the date back to the last if it is ahead', () => {
    const result = syncByrule(parseISO('1980-03-05')!, {
      unit: 'bymonthday',
      byrule: [4]
    })

    expect(result).toEqual({ day: -1 })
  })
})
