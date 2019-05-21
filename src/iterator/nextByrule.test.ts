import { compare } from '../DateTime/compare'
import { parseISO } from '../DateTime/parseISO'
import { toISO } from '../DateTime/toISO'
import { nextByrule } from './nextByrule'

const d = parseISO('1980-01-01T00:00:00')!

it('returns the original if no unitRule', () => {
  const result = nextByrule(d, undefined, false)
  expect(compare(d, result)).toEqual(0)
})

describe('BYDAY', () => {
  it('moves the day forward if it is behind', () => {
    const result = nextByrule(
      d,
      {
        unit: 'byday',
        byrule: ['WE']
      },
      false
    )

    expect(toISO(result)).toEqual('1980-01-02T00:00:00')
  })

  it('moves the day into the next week if necessary', () => {
    const result = nextByrule(
      d,
      {
        unit: 'byday',
        byrule: ['MO']
      },
      false
    )

    expect(toISO(result)).toEqual('1980-01-07T00:00:00')
  })

  it('does not move the day forward if it already matches', () => {
    const nextResult = nextByrule(
      parseISO('1980-01-07T00:00:00')!,
      {
        unit: 'byday',
        byrule: ['MO']
      },
      false
    )

    expect(toISO(nextResult)).toEqual('1980-01-07T00:00:00')
  })

  it('does not move the day forward if it is the last of the month', () => {
    const nextResult = nextByrule(
      parseISO('1980-01-31T00:00:00')!,
      {
        unit: 'byday',
        byrule: ['TH']
      },
      false
    )

    expect(toISO(nextResult)).toEqual('1980-01-31T00:00:00')
  })

  it('moves the day back to the last match if it is over', () => {
    const nextResult = nextByrule(
      parseISO('1980-01-29T00:00:00')!,
      {
        unit: 'byday',
        byrule: ['MO']
      },
      false
    )

    expect(toISO(nextResult)).toEqual('1980-01-28T00:00:00')
  })
})

describe('BYHOUR', () => {
  it('moves the hour forward if it is behind', () => {
    const result = nextByrule(
      d,
      {
        unit: 'byhour',
        byrule: [20]
      },
      false
    )

    expect(toISO(result)).toEqual('1980-01-01T20:00:00')
  })

  it('clamps the hour to the last byhour if it is over', () => {
    const d = parseISO('1980-01-01T21:00:00')!
    const result = nextByrule(
      d,
      {
        unit: 'byhour',
        byrule: [2, 20]
      },
      false
    )

    expect(toISO(result)).toEqual('1980-01-01T20:00:00')
  })

  it('does not move the hour forward if it already matches', () => {
    const nextResult = nextByrule(
      parseISO('1980-01-01T20:00:00')!,
      {
        unit: 'byhour',
        byrule: [20]
      },
      false
    )

    expect(toISO(nextResult)).toEqual('1980-01-01T20:00:00')
  })
})
