import { parseISO } from './parseISO'
/* eslint-disable @typescript-eslint/no-non-null-assertion */

it('parses an iso8601 string to components', () => {
  const result = parseISO('2012-10-06T04:13:00+00:00')

  expect(result).not.toBeUndefined()
  expect(result!.year).toEqual(2012)
  expect(result!.month).toEqual(10)
  expect(result!.day).toEqual(6)
  expect(result!.hour).toEqual(4)
  expect(result!.minute).toEqual(13)
  expect(result!.second).toEqual(0)
})

it('parses an iso8601 string without offset', () => {
  const result = parseISO('2012-10-06T04:13:00')

  expect(result).not.toBeUndefined()
  expect(result!.year).toEqual(2012)
  expect(result!.month).toEqual(10)
  expect(result!.day).toEqual(6)
  expect(result!.hour).toEqual(4)
  expect(result!.minute).toEqual(13)
  expect(result!.second).toEqual(0)
})

it('parses dates without time', () => {
  const result = parseISO('2012-10-06')

  expect(result).not.toBeUndefined()
  expect(result!.year).toEqual(2012)
  expect(result!.month).toEqual(10)
  expect(result!.day).toEqual(6)
  expect(result!.hour).toEqual(0)
  expect(result!.minute).toEqual(0)
  expect(result!.second).toEqual(0)
})

it('does not parse if hours are out of range', () => {
  const result = parseISO('2012-10-06T25:00:00')
  expect(result).toBeUndefined()
})

it('does not parse if minutes are out of range', () => {
  const result = parseISO('2012-10-06T23:60:00')
  expect(result).toBeUndefined()
})
