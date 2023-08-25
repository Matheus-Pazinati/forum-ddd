import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { AnswerQuestionUseCase } from './answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeQuestion } from 'test/factories/make-question'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity.id'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let createAnswer: AnswerQuestionUseCase

describe('Create Answer for a question', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository )
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
      attachmentsIds: ["attachment-01", "attachment-02"]
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryAnswersRepository.answers[0]).toEqual(result.value.answer)
    }
    expect(inMemoryAnswersRepository.answers[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryAnswersRepository.answers[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("attachment-01") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("attachment-02") })
    ])
    
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
