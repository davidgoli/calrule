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
describe('FREQ=SECONDLY', () => {
  it('returns only the minutes given', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'SECONDLY',
      count: 5,
      bysecond: [2, 13]
    })

    expect(result).toEqual([
      '2017-01-01T00:00:02',
      '2017-01-01T00:00:13',
      '2017-01-01T00:01:02',
      '2017-01-01T00:01:13',
      '2017-01-01T00:02:02'
    ])
  })

  it('removes bysecond if empty', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'SECONDLY',
      count: 5,
      bysecond: []
    })

    expect(result).toEqual([
      '2017-01-01T00:00:00',
      '2017-01-01T00:00:01',
      '2017-01-01T00:00:02',
      '2017-01-01T00:00:03',
      '2017-01-01T00:00:04'
    ])
  })

  it('sorts the seconds', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'SECONDLY',
      count: 5,
      bysecond: [13, 2]
    })

    expect(result).toEqual([
      '2017-01-01T00:00:02',
      '2017-01-01T00:00:13',
      '2017-01-01T00:01:02',
      '2017-01-01T00:01:13',
      '2017-01-01T00:02:02'
    ])
  })
})

describe('FREQ=MINUTELY', () => {
  it('returns only the minutes given', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'MINUTELY',
      count: 5,
      bysecond: [2, 13]
    })

    expect(result).toEqual([
      '2017-01-01T00:00:02',
      '2017-01-01T00:00:13',
      '2017-01-01T00:01:02',
      '2017-01-01T00:01:13',
      '2017-01-01T00:02:02'
    ])
  })
})
