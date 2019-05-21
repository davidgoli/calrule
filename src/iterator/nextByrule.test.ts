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

describe('BYYEARDAY', () => {
  it('moves the date forward if it is behind', () => {
    const result = nextByrule(
      parseISO('1980-01-01')!,
      {
        unit: 'byyearday',
        byrule: [20]
      },
      false
    )

    expect(toISO(result)).toEqual('1980-01-20T00:00:00')
  })

  it('moves the date forward into the next month if it is behind', () => {
    const result = nextByrule(
      parseISO('1980-01-01')!,
      {
        unit: 'byyearday',
        byrule: [40]
      },
      false
    )

    expect(toISO(result)).toEqual('1980-02-09T00:00:00')
  })

  it('does not move the day if it matches', () => {
    const result = nextByrule(
      parseISO('1980-02-09')!,
      {
        unit: 'byyearday',
        byrule: [40, 50]
      },
      false
    )

    expect(toISO(result)).toEqual('1980-02-09T00:00:00')
  })

  it('moves the day with "advance" if it matches', () => {
    const result = nextByrule(
      parseISO('1980-02-09')!,
      {
        unit: 'byyearday',
        byrule: [40, 50]
      },
      true
    )

    expect(toISO(result)).toEqual('1980-02-19T00:00:00')
  })

  it('clamps the date back to the last if it is ahead', () => {
    const result = nextByrule(
      parseISO('1980-03-01')!,
      {
        unit: 'byyearday',
        byrule: [40]
      },
      false
    )

    expect(toISO(result)).toEqual('1980-02-09T00:00:00')
  })
})

describe('BYMONTHDAY', () => {
  it('moves the date forward if it is behind', () => {
    const result = nextByrule(
      parseISO('1980-01-01')!,
      {
        unit: 'bymonthday',
        byrule: [20]
      },
      false
    )

    expect(toISO(result)).toEqual('1980-01-20T00:00:00')
  })

  it('moves the date forward into the next month if it is behind', () => {
    const result = nextByrule(
      parseISO('1980-01-01')!,
      {
        unit: 'bymonthday',
        byrule: [40]
      },
      false
    )

    expect(toISO(result)).toEqual('1980-02-09T00:00:00')
  })

  it('does not move the day if it matches', () => {
    const result = nextByrule(
      parseISO('1980-02-09')!,
      {
        unit: 'bymonthday',
        byrule: [9, 19]
      },
      false
    )

    expect(toISO(result)).toEqual('1980-02-09T00:00:00')
  })

  it('moves the day with "advance" if it matches', () => {
    const result = nextByrule(
      parseISO('1980-02-09')!,
      {
        unit: 'bymonthday',
        byrule: [9, 19]
      },
      true
    )

    expect(toISO(result)).toEqual('1980-02-19T00:00:00')
  })

  it('clamps the date back to the last if it is ahead', () => {
    const result = nextByrule(
      parseISO('1980-03-05')!,
      {
        unit: 'bymonthday',
        byrule: [4]
      },
      false
    )

    expect(toISO(result)).toEqual('1980-03-04T00:00:00')
  })
})
