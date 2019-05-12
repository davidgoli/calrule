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