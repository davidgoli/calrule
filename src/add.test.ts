import { add } from "./add"
import { DateTime } from "./parseISO"

let dt1: DateTime
let dt2: DateTime
beforeEach(() => {
  dt1 = {
    year: 2013,
    month: 12,
    day: 2,
    hour: 0,
    minute: 0,
    second: 0
  }

  dt2 = {
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0
  }
})

it("adds two datetimes", () => {
  dt2.day = 2

  expect(add(dt1, dt2)).toEqual({
    year: 2013,
    month: 12,
    day: 4,
    hour: 0,
    minute: 0,
    second: 0
  })
})

it("rolls over seconds to minutes", () => {
  dt1.second = 45
  dt2.second = 30

  expect(add(dt1, dt2)).toEqual({
    year: 2013,
    month: 12,
    day: 2,
    hour: 0,
    minute: 1,
    second: 15
  })
})
