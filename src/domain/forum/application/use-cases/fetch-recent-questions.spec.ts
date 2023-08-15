import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchRecentQuestions } from './fetch-recent-questions'
import { makeQuestion } from 'test/factories/make-question'

describe('Fetch Recent Questions', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let fetchQuestions: FetchRecentQuestions

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    fetchQuestions = new FetchRecentQuestions(inMemoryQuestionsRepository)
  })

  test('it should be able to fetch recent questions', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 0, 10, 10), // 10/01/2023 - 10:00
      }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 0, 11, 10), // 11/01/2023 - 10:00
      }),
    )
    await inMemoryQuestionsRepository.create(
      makeQuestion({
        createdAt: new Date(2023, 0, 10, 15), // 10/01/2023 - 15:00
      }),
    )

    const { questions } = await fetchQuestions.execute({
      page: 1,
    })

    expect(questions).toHaveLength(3)
    expect(questions).toEqual([
      expect.objectContaining({
        createdAt: new Date(2023, 0, 11, 10), // 11/01/2023 - 10:00
      }),
      expect.objectContaining({
        createdAt: new Date(2023, 0, 10, 15), // 10/01/2023 - 15:00
      }),
      expect.objectContaining({
        createdAt: new Date(2023, 0, 10, 10), // 10/01/2023 - 10:00
      }),
    ])
  })

  test('it should be able to return paginated recent questions', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionsRepository.create(makeQuestion())
    }

    const { questions } = await fetchQuestions.execute({
      page: 2,
    })

    expect(questions).toHaveLength(2)
  })
})
