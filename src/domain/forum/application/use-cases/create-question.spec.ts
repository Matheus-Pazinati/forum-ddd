import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let createQuestion: CreateQuestionUseCase

describe('Create a question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    createQuestion = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  test('it should be able to create a question', async () => {
    const result = await createQuestion.execute({
      authorId: '01',
      content: 'How to create tests ?',
      title: 'Create test',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.questions[0]).toEqual(result.value?.question)
  })
})
