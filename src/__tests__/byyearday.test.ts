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
describe('FREQ=YEARLY', () => {
  it.only('returns only the days given', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'YEARLY',
      count: 5,
      byyearday: [2, 41]
    })

    expect(result).toEqual([
      // 2017-01-01 is a Sunday
      '2017-01-02T00:00:00',
      '2017-02-10T00:00:00',
      '2018-01-02T00:00:00',
      '2018-02-10T00:00:00',
      '2019-01-02T00:00:00'
    ])
  })
})

describe('FREQ=DAILY', () => {
  it('returns undefined (is invalid)', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'DAILY',
      count: 5,
      byyearday: [2, 11]
    })

    expect(result).toBeUndefined()
  })
})

describe('FREQ=WEEKLY', () => {
  it('returns undefined (is invalid)', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'WEEKLY',
      count: 5,
      byyearday: [2, 11]
    })

    expect(result).toBeUndefined()
  })
})

describe('FREQ=MONTHLY', () => {
  it('returns undefined (is invalid)', () => {
    const result = rrule({
      dtstart: '2017-01-01',
      freq: 'MONTHLY',
      count: 5,
      byyearday: [2, 11]
    })

    expect(result).toBeUndefined()
  })
})
