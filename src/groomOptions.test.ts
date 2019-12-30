import { groomOptions } from './groomOptions'

it('never returns an empty array for a byrule', () => {
  const groomed = groomOptions({
    freq: 'DAILY',
    dtstart: '2017-01-01',
    byday: []
  })
  expect(groomed).not.toHaveProperty('byday')
})
