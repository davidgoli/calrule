import { GroomedOptions } from './groomOptions'
import { DateTime } from './DateTime/index'
import { dayOfWeek } from './DateTime/dayOfWeek'

export const makeFilter = ({ byday }: GroomedOptions) => {
  return (current: DateTime) => {
    if (byday) {
      return byday.indexOf(dayOfWeek(current)) !== -1
    }

    return true
  }
}
