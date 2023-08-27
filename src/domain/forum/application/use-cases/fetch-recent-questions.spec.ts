import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchRecentQuestions } from './fetch-recent-questions'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

describe('Fetch Recent Questions', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let fetchQuestions: FetchRecentQuestions
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

  beforeEach(() => {
    let inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
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

    const result = await fetchQuestions.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questions).toHaveLength(3)
    expect(result.value?.questions).toEqual([
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

    const result = await fetchQuestions.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questions).toHaveLength(2)
  })
})
