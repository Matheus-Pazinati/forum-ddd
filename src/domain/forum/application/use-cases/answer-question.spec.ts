import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let createAnswer: AnswerQuestionUseCase

describe('Create Answer for a question', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    createAnswer = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  test('it should be able to answer a question', async () => {
    const { answer } = await createAnswer.execute({
      instructorId: '01',
      questionId: '01',
      content: 'Test Answer',
    })

    expect(answer.content).toEqual('Test Answer')
    expect(inMemoryAnswersRepository.answers.length).toBe(1)
  })
})
