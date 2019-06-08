import { ByProperty } from '../groomOptions'
import { Frequency } from '../types'
import { Unit } from './types'

export const FREQUENCY_UNIT: { [k in Frequency]: Unit } = {
  YEARLY: 'year',
  MONTHLY: 'month',
  WEEKLY: 'day',
  DAILY: 'day',
  HOURLY: 'hour',
  MINUTELY: 'minute',
  SECONDLY: 'second'
}

export const UNIT_ORDER: (Unit)[] = [
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second'
]

export const BYRULE_ORDER: ByProperty[] = [
  'bymonth',
  'byweekno',
  'byyearday',
  'bymonthday',
  'byday',
  'byhour',
  'byminute',
  'bysecond'
  // 'bysetpos'
]

export const unitForByrule: { [K in ByProperty]: Unit } = {
  bysecond: 'second',
  byminute: 'minute',
  byhour: 'hour',
  byday: 'day',
  bymonth: 'month',
  bymonthday: 'day',
  byweekno: 'day',
  byyearday: 'day'
}

export const nextLargerUnit = (unit: Unit) =>
  UNIT_ORDER[UNIT_ORDER.indexOf(unit) - 1]
