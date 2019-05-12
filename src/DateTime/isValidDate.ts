export const isValidDate = (iso8601: string | undefined): iso8601 is string =>
  typeof iso8601 !== 'undefined' && !isNaN(new Date(iso8601).getTime())
