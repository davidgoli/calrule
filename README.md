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

| Property | Values                                                                             | Use                                                                      |
| -------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| freq     | YEARLY<br/>MONTHLY <br/>WEEKLY<br/>DAILY<br/>HOURLY<br/>MINUTELY<br/>SECONDLY<br/> | Repeat frequency (required)                                              |
| count    | number                                                                             | Number of instances to return                                            |
| interval | number                                                                             | Interval of recurrences (eg. "2" with freq=DAILY yields every other day) |
| dtstart  | ISO string                                                                         | First recurrence (required)                                              |
| until    | ISO string                                                                         | No recurrences will be generated beyond this date, inclusive             |
| byday    | Array of [ 'SU' \| 'MO' \| 'TU' \| 'WE' \| 'TH' \| 'FR' \| 'SA' ]                  | Recurrences only appear on the provided weekdays                         |
| byhour   | number[]                                                                           | Recurrences only appear on the provided hours                            |
| byminute | number[]                                                                           | Recurrences only appear on the provided minutes                          |
| bysecond | number[]                                                                           | Recurrences only appear on the provided seconds                          |
