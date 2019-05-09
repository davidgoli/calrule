import { add } from "./add"
import { DateTime } from "./parseISO"

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

it("adds two datetimes", () => {
  expect(add(dt, { day: 2 })).toEqual({
    year: 2013,
    month: 12,
    day: 4,
    hour: 0,
    minute: 0,
    second: 0
  })
})

it("rolls over seconds to minutes", () => {
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

it("rolls over minutes to hours", () => {
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

it("rolls over hours to days", () => {
  expect(add(dt, { hour: 33 })).toEqual({
    year: 2013,
    month: 12,
    day: 3,
    hour: 9,
    minute: 0,
    second: 0
  })
})

it("rolls over days to months", () => {
  dt.month = 9

  expect(add(dt, { day: 33 })).toEqual({
    year: 2013,
    month: 10,
    day: 5,
    hour: 0,
    minute: 0,
    second: 0
  })
})
