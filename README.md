# CalRule

## An (incomplete) TypeScript implementation of RFC 5545

- Stateless and functional
- Accepts and returns ISO strings (not JS Date objects)
- Does not use the JS Date object internally for better consistency with UTC and non-local timezones

# Supported Properties

| Property | Values                                                                             | Use                                                                      |
| -------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| freq     | YEARLY<br/>MONTHLY <br/>WEEKLY<br/>DAILY<br/>HOURLY<br/>MINUTELY<br/>SECONDLY<br/> | Repeat frequency (required)                                              |
| count    | number                                                                             | Number of instances to return                                            |
| interval | number                                                                             | Interval of recurrences (eg. "2" with freq=DAILY yields every other day) |
| dtstart  | ISO string                                                                         | First recurrence (required)                                              |
| until    | ISO string                                                                         | No recurrences will be generated beyond this date, inclusive             |
