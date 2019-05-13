import { validate } from './validate'

it('is not valid if there is no freq', () => {
  // @ts-ignore
  expect(validate({})).toEqual([
    false,
    {
      errors: [
        `Invalid value "undefined" for parameter FREQ`,
        `Invalid value "undefined" for parameter DTSTART`
      ]
    }
  ])
})

it('is not valid if dtstart does not parse', () => {
  expect(validate({ freq: 'DAILY', dtstart: '' })).toEqual([
    false,
    { errors: ['Invalid value "" for parameter DTSTART'] }
  ])
})

it('is valid with valid FREQ and DTSTART', () => {
  expect(validate({ freq: 'DAILY', dtstart: '2017-04-15' })).toEqual([true, {}])
})

it('is not valid if both COUNT and UNTIL are specified', () => {
  expect(
    validate({
      freq: 'DAILY',
      dtstart: '2017-04-15',
      count: 3,
      until: '2017-05-02'
    })
  ).toEqual([false, { errors: ['UNTIL and COUNT must not both be present'] }])
})

it('is not valid if UNTIL is not a date', () => {
  expect(
    validate({
      freq: 'DAILY',
      dtstart: '2017-04-15',
      until: 'abc'
    })
  ).toEqual([false, { errors: ['Invalid value "abc" for parameter UNTIL'] }])
})

it('is not valid if COUNT is not a number', () => {
  expect(
    validate({
      freq: 'DAILY',
      dtstart: '2017-04-15',
      // @ts-ignore
      count: 'abc'
    })
  ).toEqual([false, { errors: ['Invalid value "abc" for parameter COUNT'] }])
})

it('is valid with valid COUNT', () => {
  expect(validate({ freq: 'DAILY', dtstart: '2017-04-15', count: 3 })).toEqual([
    true,
    {}
  ])
})

it('is valid with valid UNTIL', () => {
  expect(
    validate({ freq: 'DAILY', dtstart: '2017-04-15', until: '2018-12-20' })
  ).toEqual([true, {}])
})

it('is not valid if INTERVAL is not a number', () => {
  expect(
    // @ts-ignore
    validate({ freq: 'DAILY', dtstart: '2017-04-15', interval: 'abc' })
  ).toEqual([false, { errors: ['Invalid value "abc" for parameter INTERVAL'] }])
})

it('is not valid if INTERVAL is negative', () => {
  expect(
    // @ts-ignore
    validate({ freq: 'DAILY', dtstart: '2017-04-15', interval: -1 })
  ).toEqual([false, { errors: ['Invalid value "-1" for parameter INTERVAL'] }])
})

it('is valid with valid INTERVAL', () => {
  expect(
    validate({ freq: 'DAILY', dtstart: '2017-04-15', interval: 2 })
  ).toEqual([true, {}])
})

it('is not valid if FREQ=WEEKLY and BYMONTHDAY is used', () => {
  expect(
    validate({ freq: 'WEEKLY', dtstart: '2017-04-05', bymonthday: [] })
  ).toEqual([false, { errors: ['BYMONTHDAY cannot be used when FREQ=WEEKLY'] }])
})

it('is not valid with bymonth greater than 12', () => {
  expect(
    validate({ freq: 'MONTHLY', dtstart: '2017-04-05', bymonth: [13] })
  ).toEqual([false, { errors: ['Invalid value "13" for parameter BYMONTH'] }])
})

it('is not valid with bymonth less than 1', () => {
  expect(
    validate({ freq: 'MONTHLY', dtstart: '2017-04-05', bymonth: [0] })
  ).toEqual([false, { errors: ['Invalid value "0" for parameter BYMONTH'] }])
})

it('is valid with valid bymonth', () => {
  expect(
    validate({ freq: 'MONTHLY', dtstart: '2017-04-05', bymonth: [2, 11] })
  ).toEqual([true, {}])
})

it('is not valid with bysecond greater than 59', () => {
  expect(
    validate({ freq: 'MONTHLY', dtstart: '2017-04-05', bysecond: [60] })
  ).toEqual([false, { errors: ['Invalid value "60" for parameter BYSECOND'] }])
})

it('is not valid with bysecond less than 0', () => {
  expect(
    validate({ freq: 'MONTHLY', dtstart: '2017-04-05', bysecond: [-1] })
  ).toEqual([false, { errors: ['Invalid value "-1" for parameter BYSECOND'] }])
})

it('is valid with valid bysecond', () => {
  expect(
    validate({ freq: 'MONTHLY', dtstart: '2017-04-05', bysecond: [2, 11] })
  ).toEqual([true, {}])
})

it('is not valid with byminute greater than 59', () => {
  expect(
    validate({ freq: 'MONTHLY', dtstart: '2017-04-05', byminute: [60] })
  ).toEqual([false, { errors: ['Invalid value "60" for parameter BYMINUTE'] }])
})

it('is not valid with byminute less than 0', () => {
  expect(
    validate({ freq: 'MONTHLY', dtstart: '2017-04-05', byminute: [-1] })
  ).toEqual([false, { errors: ['Invalid value "-1" for parameter BYMINUTE'] }])
})

it('is valid with valid byminute', () => {
  expect(
    validate({ freq: 'MONTHLY', dtstart: '2017-04-05', byminute: [2, 11] })
  ).toEqual([true, {}])
})

it('is not valid with byhour greater than 59', () => {
  expect(
    validate({ freq: 'MONTHLY', dtstart: '2017-04-05', byhour: [60] })
  ).toEqual([false, { errors: ['Invalid value "60" for parameter BYHOUR'] }])
})

it('is not valid with byhour less than 0', () => {
  expect(
    validate({ freq: 'MONTHLY', dtstart: '2017-04-05', byhour: [-1] })
  ).toEqual([false, { errors: ['Invalid value "-1" for parameter BYHOUR'] }])
})

it('is valid with valid byhour', () => {
  expect(
    validate({ freq: 'MONTHLY', dtstart: '2017-04-05', byhour: [2, 11] })
  ).toEqual([true, {}])
})
