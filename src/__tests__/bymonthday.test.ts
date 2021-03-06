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
  it('returns only the days given', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'MONTHLY',
      count: 5,
      bymonthday: [2, 11]
    })

    expect(result).toEqual([
      // 2017-01-01 is a Sunday
      '2017-01-02T00:00:00',
      '2017-01-11T00:00:00',
      '2017-02-02T00:00:00',
      '2017-02-11T00:00:00',
      '2017-03-02T00:00:00'
    ])
  })

  it('does not return invalid month days', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'MONTHLY',
      count: 5,
      bymonthday: [31]
    })

    expect(result).toEqual([
      '2017-01-31T00:00:00',
      '2017-03-31T00:00:00',
      '2017-05-31T00:00:00',
      '2017-07-31T00:00:00',
      '2017-08-31T00:00:00'
    ])
  })

  it('returns negative month days', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'MONTHLY',
      count: 5,
      bymonthday: [-5]
    })

    expect(result).toEqual([
      '2017-01-27T00:00:00',
      '2017-02-24T00:00:00',
      '2017-03-27T00:00:00',
      '2017-04-26T00:00:00',
      '2017-05-27T00:00:00'
    ])
  })
})

describe('FREQ=WEEKLY', () => {
  it('returns undefined (is invalid)', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'WEEKLY',
      count: 5,
      bymonthday: [2, 11]
    })

    expect(result).toBeUndefined()
  })
})

describe('FREQ=YEARLY', () => {
  it('returns only the days given', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'YEARLY',
      count: 5,
      bymonthday: [2, 11]
    })

    expect(result).toEqual([
      // 2017-01-01 is a Sunday
      '2017-01-02T00:00:00',
      '2017-01-11T00:00:00',
      '2017-02-02T00:00:00',
      '2017-02-11T00:00:00',
      '2017-03-02T00:00:00'
    ])
  })
})
