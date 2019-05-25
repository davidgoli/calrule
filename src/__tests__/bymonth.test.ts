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
describe('FREQ=MONTHLY', () => {
  it('returns only the months given', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'MONTHLY',
      count: 5,
      bymonth: [2, 11]
    })

    expect(result).toEqual([
      '2017-02-01T00:00:00',
      '2017-11-01T00:00:00',
      '2018-02-01T00:00:00',
      '2018-11-01T00:00:00',
      '2019-02-01T00:00:00'
    ])
  })

  it('removes bymonth if empty', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'MONTHLY',
      count: 5,
      bymonth: []
    })

    expect(result).toEqual([
      '2017-01-01T00:00:00',
      '2017-02-01T00:00:00',
      '2017-03-01T00:00:00',
      '2017-04-01T00:00:00',
      '2017-05-01T00:00:00'
    ])
  })

  it('sorts the months', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'MONTHLY',
      count: 5,
      bymonth: [11, 2]
    })

    expect(result).toEqual([
      '2017-02-01T00:00:00',
      '2017-11-01T00:00:00',
      '2018-02-01T00:00:00',
      '2018-11-01T00:00:00',
      '2019-02-01T00:00:00'
    ])
  })
})

describe('FREQ=DAILY', () => {
  it('returns only the months given', () => {
    const result = rrule({
      dtstart: '2017-02-26',
      freq: 'DAILY',
      count: 5,
      bymonth: [2, 11]
    })

    expect(result).toEqual([
      '2017-02-26T00:00:00',
      '2017-02-27T00:00:00',
      '2017-02-28T00:00:00',
      '2017-11-01T00:00:00',
      '2017-11-02T00:00:00'
    ])
  })
})

describe('FREQ=YEARLY', () => {
  it('returns only the months given', () => {
    const result = rrule({
      dtstart: '2017-01-01T00:00:00',
      freq: 'YEARLY',
      count: 5,
      bymonth: [2, 11]
    })

    expect(result).toEqual([
      '2017-02-01T00:00:00',
      '2017-11-01T00:00:00',
      '2018-02-01T00:00:00',
      '2018-11-01T00:00:00',
      '2019-02-01T00:00:00'
    ])
  })
})
