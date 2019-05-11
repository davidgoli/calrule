import { validate } from './validate'

it('is not valid if there is no freq', () => {
  // @ts-ignore
  expect(validate({})).toEqual([
    false,
    { errors: [`Invalid value "undefined" for paramater FREQ`] }
  ])
})
