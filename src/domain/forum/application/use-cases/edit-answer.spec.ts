import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/use-case-errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachments } from 'test/factories/make-answer-attachments'

describe('Edit Answer Content', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let editAnswer: EditAnswerUseCase

  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    editAnswer = new EditAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswerAttachmentsRepository)
  })

  test('it should be able to edit a answer', async() => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
        content: 'Old content',
      },
      new UniqueEntityID('answer-01'),
    )

    inMemoryAnswersRepository.create(answer)

    inMemoryAnswerAttachmentsRepository.answerAttachments.push(
      makeAnswerAttachments({
        answerId: answer.id,
        attachmentId: new UniqueEntityID("attachment-01")
      }),
      makeAnswerAttachments({
        answerId: answer.id,
        attachmentId: new UniqueEntityID("attachment-02")
      })
    )

    const result = await editAnswer.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'New content',
      attachmentsIds: ["attachment-02", "attachment-03"]
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryAnswersRepository.answers[0]).toEqual(result.value.answer)
    }
    expect(inMemoryAnswersRepository.answers[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryAnswersRepository.answers[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("attachment-02") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("attachment-03") })
    ])
  })

  test('it should not be able to edit a nonexistent answer', async() => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
        content: 'Old content',
      },
      new UniqueEntityID('answer-01'),
    )

    inMemoryAnswersRepository.create(answer)

    const result = await editAnswer.execute({
      answerId: 'nonexistent-answer',
      authorId: answer.authorId.toString(),
      content: 'New content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)

  })

  test('it should not be able to edit a answer from other user', async() => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
        content: 'Old content',
      },
      new UniqueEntityID('answer-01'),
    )

    inMemoryAnswersRepository.create(answer)

    const result = await editAnswer.execute({
      answerId: answer.id.toString(),
      authorId: 'nonexistent-author',
      content: 'New content',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)

  })
})
