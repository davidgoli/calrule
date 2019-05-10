import { DateTime } from './index'
import { toMillis } from './toMillis'

export const compare = (a: DateTime, b: DateTime) => toMillis(a) - toMillis(b)
