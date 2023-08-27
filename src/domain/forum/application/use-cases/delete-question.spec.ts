import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity.id'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/use-case-errors/resource-not-found-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachments } from 'test/factories/make-question-attachments'

describe('Delete a Question', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let deleteQuestion: DeleteQuestionUseCase
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    deleteQuestion = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  })

  test('it should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.questionAttachments.push(
      makeQuestionAttachments({
        attachmentId: new UniqueEntityID("attachment-01"),
        questionId: newQuestion.id
      }),
      makeQuestionAttachments({
        attachmentId: new UniqueEntityID("attachment-02"),
        questionId: newQuestion.id
      })
    )

    const result = await deleteQuestion.execute({
      authorId: 'author-1',
      questionId: 'question-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.questions).toHaveLength(0)
    expect(inMemoryQuestionAttachmentsRepository.questionAttachments).toHaveLength(0)
  })

  test('it should not be able to delete a question from other user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    inMemoryQuestionsRepository.create(newQuestion)

    const result = await deleteQuestion.execute({
      authorId: 'author-2',
      questionId: 'question-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  test('it should not be able to delete a nonexistent question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    inMemoryQuestionsRepository.create(newQuestion)

    const result = await deleteQuestion.execute({
      authorId: 'author-1',
      questionId: 'question-2',
    }) 

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
