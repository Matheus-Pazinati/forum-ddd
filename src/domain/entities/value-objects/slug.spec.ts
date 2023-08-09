import { Slug } from './slug'

test('it should be able to create a normalized slug from a text', () => {
  const questionTitle = 'New Question Title! '

  const questionSlug = Slug.createSlugFromText(questionTitle)
  expect(questionSlug.value).toEqual('new-question-title')
})
