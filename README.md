[![Build Status](https://travis-ci.org/davidgoli/calrule.svg?branch=master)](https://travis-ci.org/davidgoli/calrule)
[![codecov](https://codecov.io/gh/davidgoli/calrule/branch/master/graph/badge.svg)](https://codecov.io/gh/davidgoli/calrule) [![Greenkeeper badge](https://badges.greenkeeper.io/davidgoli/calrule.svg)](https://greenkeeper.io/)

# CalRule

## An (incomplete) TypeScript implementation of [RFC 5545](https://tools.ietf.org/html/rfc5545)

- Stateless and functional
- Accepts and returns ISO strings (not JS Date objects)
- Does not use the JS Date object internally for better consistency with UTC and non-local timezones

# Usage

```ts
// Any valid ISO 8601 string will work
> rrule({
  freq: 'DAILY',
  dtstart: '2016-04-05T00:00:00',
  count: 10
})

[
  '2016-04-05T00:00:00',
  '2016-04-06T00:00:00',
  '2016-04-07T00:00:00',
  '2016-04-08T00:00:00',
  '2016-04-09T00:00:00',
  '2016-04-10T00:00:00',
  '2016-04-11T00:00:00',
  '2016-04-12T00:00:00',
  '2016-04-13T00:00:00',
  '2016-04-14T00:00:00'
]
```

If you get a return value of `undefined`, it's likely your RRULE parameters are invalid. To check this, use the `validate` method:

```ts
> rrule({})

undefined

> validate({})

[
  false,
  { errors: [`Invalid value "undefined" for paramater FREQ`] }
]
```

# Supported Properties

| Property   | Values                                                                             | Use                                                                      |
| ---------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| freq       | YEARLY<br/>MONTHLY <br/>WEEKLY<br/>DAILY<br/>HOURLY<br/>MINUTELY<br/>SECONDLY<br/> | Repeat frequency (required)                                              |
| count      | number                                                                             | Number of instances to return                                            |
| interval   | number                                                                             | Interval of recurrences (eg. "2" with freq=DAILY yields every other day) |
| dtstart    | ISO string                                                                         | First recurrence (required)                                              |
| until      | ISO string                                                                         | No recurrences will be generated beyond this date, inclusive             |
| bymonth    | number[] in range (1-12)                                                           | Recurrences only appear on the provided months                           |
| byweekno   | number[] in range (1-53)                                                           | Recurrences only appear on the provided week number of the year          |
| byyearday  | number[] in range (1-366) or (-1 - -366)                                           | Recurrences only appear on the provided days of the year                 |
| bymonthday | number[] in range (1-31) or (-1 - -31)                                             | Recurrences only appear on the provided days of the month                |
| byday      | Array of [ 'SU' \| 'MO' \| 'TU' \| 'WE' \| 'TH' \| 'FR' \| 'SA' ]                  | Recurrences only appear on the provided weekdays                         |
| byhour     | number[] in range (0-23)                                                           | Recurrences only appear on the provided hours                            |
| byminute   | number[] in range (0-59)                                                           | Recurrences only appear on the provided minutes                          |
| bysecond   | number[] in range (0-60)                                                           | Recurrences only appear on the provided seconds                          |
