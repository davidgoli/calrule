import { rrule } from './index'

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
describe('FREQ=MINUTELY', () => {
  it('returns only the minutes given', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'MINUTELY',
      count: 5,
      byminute: [2, 13]
    })

    expect(result).toEqual([
      '2017-01-01T00:02:00',
      '2017-01-01T00:13:00',
      '2017-01-01T01:02:00',
      '2017-01-01T01:13:00',
      '2017-01-01T02:02:00'
    ])
  })
})

describe('FREQ=HOURLY', () => {
  it('returns only the minutes given', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'HOURLY',
      count: 5,
      byminute: [2, 13]
    })

    expect(result).toEqual([
      '2017-01-01T00:02:00',
      '2017-01-01T00:13:00',
      '2017-01-01T01:02:00',
      '2017-01-01T01:13:00',
      '2017-01-01T02:02:00'
    ])
  })
})

describe('FREQ=SECONDLY', () => {
  it('returns only the days given', () => {
    const result = rrule({
      dtstart: '2017-01-01T00:02:58',
      freq: 'SECONDLY',
      count: 5,
      byminute: [2, 13]
    })

    expect(result).toEqual([
      '2017-01-01T00:02:58',
      '2017-01-01T00:02:59',
      '2017-01-01T00:13:00',
      '2017-01-01T00:13:01',
      '2017-01-01T00:13:02'
    ])
  })
})
