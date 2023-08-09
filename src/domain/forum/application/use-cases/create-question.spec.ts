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
    const { question } = await createQuestion.execute({
      authorId: '01',
      content: 'How to create tests ?',
      title: 'Create test',
    })

    expect(question.id).toBeTruthy()
    expect(question.slug.value).toEqual('create-test')
    expect(inMemoryQuestionsRepository.questions.length).toBe(1)
  })
})
