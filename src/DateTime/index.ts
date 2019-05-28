export type MONTHS = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export interface DateTimeDiff {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
}
export interface DateTime {
  year: number;
  month: MONTHS;
  day: number;
  hour: number;
  minute: number;
  second: number;
}
