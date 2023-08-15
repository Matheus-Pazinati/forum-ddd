import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeQuestion } from 'test/factories/make-question'

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

    const { answer } = await createAnswer.execute({
      instructorId: 'instructor-01',
      questionId: question.id.toString(),
      content: 'Test Answer',
    })

    expect(answer.content).toEqual('Test Answer')
    expect(inMemoryAnswersRepository.answers.length).toBe(1)
  })

  test("it should not be able to create a answer for a nonexistent question", async() => {
    expect(async() => {
      await createAnswer.execute({
        instructorId: 'instructor-01',
        questionId: 'question-01',
        content: 'Test Answer',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
