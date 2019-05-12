import { GroomedOptions } from './groomOptions'
import { DateTime } from './DateTime/index'
import { dayOfWeek } from './DateTime/dayOfWeek'

export const makeFilter = ({
  byday,
  byhour,
  byminute,
  bysecond
}: GroomedOptions) => {
  return (current: DateTime) => {
    if (byday) {
      return byday.indexOf(dayOfWeek(current)) !== -1
    }

    if (byhour) {
      return byhour.indexOf(current.hour) !== -1
    }

    if (byminute) {
      return byminute.indexOf(current.minute) !== -1
    }

    if (bysecond) {
      return bysecond.indexOf(current.second) !== -1
    }

    return true
  }
}
