import { add } from './add'
import { DateTime } from './parseISO'

let dt: DateTime

beforeEach(() => {
  dt = {
    year: 2013,
    month: 12,
    day: 2,
    hour: 0,
    minute: 0,
    second: 0
  }
})

it('adds two datetimes', () => {
  expect(add(dt, { day: 2 })).toEqual({
    year: 2013,
    month: 12,
    day: 4,
    hour: 0,
    minute: 0,
    second: 0
  })
})

it('rolls over seconds to minutes', () => {
  dt.second = 45

  expect(add(dt, { second: 30 })).toEqual({
    year: 2013,
    month: 12,
    day: 2,
    hour: 0,
    minute: 1,
    second: 15
  })
})

it('rolls over minutes to hours', () => {
  dt.minute = 45

  expect(add(dt, { minute: 30 })).toEqual({
    year: 2013,
    month: 12,
    day: 2,
    hour: 1,
    minute: 15,
    second: 0
  })
})

it('rolls over hours to days', () => {
  expect(add(dt, { hour: 33 })).toEqual({
    year: 2013,
    month: 12,
    day: 3,
    hour: 9,
    minute: 0,
    second: 0
  })
})

it('rolls over days to months', () => {
  dt.month = 9

  expect(add(dt, { day: 1 })).toEqual({
    year: 2013,
    month: 9,
    day: 3,
    hour: 0,
    minute: 0,
    second: 0
  })

  expect(add(dt, { day: 28 })).toEqual({
    year: 2013,
    month: 9,
    day: 30,
    hour: 0,
    minute: 0,
    second: 0
  })

  expect(add(dt, { day: 33 })).toEqual({
    year: 2013,
    month: 10,
    day: 5,
    hour: 0,
    minute: 0,
    second: 0
  })
})

it('rolls over months correctly based on the number of days that month', () => {
  dt = {
    year: 2013,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  }

  expect(add(dt, { day: 31 })).toEqual({
    year: 2013,
    month: 2,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  })

  dt.month = 2
  expect(add(dt, { day: 28 })).toEqual({
    year: 2013,
    month: 3,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  })

  dt.month = 3
  expect(add(dt, { day: 31 })).toEqual({
    year: 2013,
    month: 4,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  })

  dt.month = 4
  expect(add(dt, { day: 30 })).toEqual({
    year: 2013,
    month: 5,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  })

  dt.month = 5
  expect(add(dt, { day: 31 })).toEqual({
    year: 2013,
    month: 6,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  })

  dt.month = 6
  expect(add(dt, { day: 30 })).toEqual({
    year: 2013,
    month: 7,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  })

  dt.month = 7
  expect(add(dt, { day: 31 })).toEqual({
    year: 2013,
    month: 8,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  })

  dt.month = 8
  expect(add(dt, { day: 31 })).toEqual({
    year: 2013,
    month: 9,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  })

  dt.month = 9
  expect(add(dt, { day: 30 })).toEqual({
    year: 2013,
    month: 10,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  })

  dt.month = 10
  expect(add(dt, { day: 31 })).toEqual({
    year: 2013,
    month: 11,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0
  })
})
