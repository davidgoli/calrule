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
})
