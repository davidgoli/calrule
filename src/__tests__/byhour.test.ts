import { rrule } from '../index'

// BYxxx rule parts modify the recurrence in some manner.BYxxx rule
// parts for a period of time that is the same or greater than the
// frequency generally reduce or limit the number of occurrences of
// the recurrence generated.For example, "FREQ=DAILY;BYMONTH=1"
// reduces the number of recurrence instances from all days(if
// BYMONTH rule part is not present) to all days in January.BYxxx
// rule parts for a period of time less than the frequency generally
// increase or expand the number of occurrences of the recurrence.
// For example, "FREQ=YEARLY;BYMONTH=1,2" increases the number of
// days within the yearly recurrence set from 1(if BYMONTH rule part
// is not present) to 2.
// If multiple BYxxx rule parts are specified, then after evaluating
// the specified FREQ and INTERVAL rule parts, the BYxxx rule parts
// are applied to the current set of evaluated occurrences in the
// following order: BYMONTH, BYWEEKNO, BYYEARDAY, BYMONTHDAY, BYDAY,
// BYHOUR, BYMINUTE, BYSECOND and BYSETPOS; then COUNT and UNTIL are
// evaluated.
describe('FREQ=HOURLY', () => {
  it('returns only the hours given', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'HOURLY',
      count: 5,
      byhour: [2, 13]
    })

    expect(result).toEqual([
      '2017-01-01T02:00:00',
      '2017-01-01T13:00:00',
      '2017-01-02T02:00:00',
      '2017-01-02T13:00:00',
      '2017-01-03T02:00:00'
    ])
  })

  it('removes byhour if empty', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'HOURLY',
      count: 5,
      byhour: []
    })

    expect(result).toEqual([
      '2017-01-01T00:00:00',
      '2017-01-01T01:00:00',
      '2017-01-01T02:00:00',
      '2017-01-01T03:00:00',
      '2017-01-01T04:00:00'
    ])
  })

  it('sorts the hours', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'HOURLY',
      count: 5,
      byhour: [13, 2]
    })

    expect(result).toEqual([
      '2017-01-01T02:00:00',
      '2017-01-01T13:00:00',
      '2017-01-02T02:00:00',
      '2017-01-02T13:00:00',
      '2017-01-03T02:00:00'
    ])
  })
})

describe('FREQ=DAILY', () => {
  it('returns only the hours given', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'DAILY',
      count: 5,
      byhour: [2, 13]
    })

    expect(result).toEqual([
      '2017-01-01T02:00:00',
      '2017-01-01T13:00:00',
      '2017-01-02T02:00:00',
      '2017-01-02T13:00:00',
      '2017-01-03T02:00:00'
    ])
  })
})

describe('FREQ=MINUTELY', () => {
  it('returns only the days given', () => {
    const result = rrule({
      dtstart: '2017-01-01T02:58:00',
      freq: 'MINUTELY',
      count: 5,
      byhour: [2, 13]
    })

    expect(result).toEqual([
      '2017-01-01T02:58:00',
      '2017-01-01T02:59:00',
      '2017-01-01T13:00:00',
      '2017-01-01T13:01:00',
      '2017-01-01T13:02:00'
    ])
  })
})
