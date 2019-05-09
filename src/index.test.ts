import { Frequency, rrule } from "./index"

describe("DAILY", () => {
  it("generates the correct number of occurences", () => {
    const result = rrule({
      dtstart: "2016-04-05",
      count: 10,
      freq: "DAILY" as Frequency
    })

    expect(result).toHaveLength(10)
  })

  it("generates the correct occurences", () => {
    const result = rrule({
      dtstart: "2016-04-05",
      count: 10,
      freq: "DAILY" as Frequency
    })

    expect(result).toEqual([
      "2016-04-05T00:00:00",
      "2016-04-06T00:00:00",
      "2016-04-07T00:00:00",
      "2016-04-08T00:00:00",
      "2016-04-09T00:00:00",
      "2016-04-10T00:00:00",
      "2016-04-11T00:00:00",
      "2016-04-12T00:00:00",
      "2016-04-13T00:00:00",
      "2016-04-14T00:00:00"
    ])
  })
})
