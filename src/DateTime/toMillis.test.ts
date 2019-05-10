import { DateTime } from './index'
import { toMillis } from './toMillis'

it('converts a DateTime to millis', () => {
  const a: DateTime = {
    year: 2012,
    month: 3,
    day: 1,
    hour: 13,
    minute: 2,
    second: 34
  }

  expect(toMillis(a)).toEqual(
    new Date(
      a.year,
      a.month - 1,
      a.day,
      a.hour,
      a.minute,
      a.second,
      0
    ).getTime()
  )
})
