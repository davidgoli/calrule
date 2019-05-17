import { ByProperty } from '../groomOptions'
import { Weekday } from '../types'

export interface UnitRule {
  unit: ByProperty
  byrule: number[] | Weekday[] | undefined
}
