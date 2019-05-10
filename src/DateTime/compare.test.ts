import { compare } from './compare'
import { DateTime } from './parseISO'

// works like Array.prototype.sort's `compareFunction`
// function compare(a, b) {
//   if (a is less than b by some ordering criterion) {
//     return -1;
//   }
//   if (a is greater than b by the ordering criterion) {
//     return 1;
//   }
//   // a must be equal to b
//   return 0;
// }
it('is 0 if both are equal', () => {
  const a: DateTime = {
    year: 2012,
    month: 3,
    day: 1,
    hour: 13,
    minute: 2,
    second: 34
  }
  const b: DateTime = {
    year: 2012,
    month: 3,
    day: 1,
    hour: 13,
    minute: 2,
    second: 34
  }

  expect(compare(a, b)).toEqual(0)
})
