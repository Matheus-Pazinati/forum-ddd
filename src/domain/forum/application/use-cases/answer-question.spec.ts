import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeQuestion } from 'test/factories/make-question'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let createAnswer: AnswerQuestionUseCase

describe('Create Answer for a question', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    createAnswer = new AnswerQuestionUseCase(
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository
    )
  })

  test('it should be able to answer a question', async () => {
    const question = makeQuestion()
    await inMemoryQuestionsRepository.create(question)

    const result = await createAnswer.execute({
      instructorId: 'instructor-01',
      questionId: question.id.toString(),
      content: 'Test Answer',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryAnswersRepository.answers[0]).toEqual(result.value.answer)
    }
    
  })

  test("it should not be able to create a answer for a nonexistent question", async() => {
    const result = await createAnswer.execute({
      instructorId: 'instructor-01',
      questionId: 'question-01',
      content: 'Test Answer',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
