import { validate } from './validate'
import { rrule } from './index'

jest.mock('./validate')

it('returns undefined if options are not valid', () => {
  ;(validate as jest.Mock).mockReturnValue([false])
  // @ts-ignore
  expect(rrule({})).toBeUndefined()
  expect(validate).toHaveBeenCalled()
})
