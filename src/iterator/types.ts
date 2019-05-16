import { DateTime } from '../DateTime/index'
import { Weekday } from '../types'

export interface UnitRule {
  unit: keyof DateTime
  byrule: number[] | Weekday[] | undefined
}
