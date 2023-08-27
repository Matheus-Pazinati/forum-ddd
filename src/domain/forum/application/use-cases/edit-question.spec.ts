import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity.id'
import { ResourceNotFoundError } from '@/core/errors/use-case-errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/use-case-errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachments } from 'test/factories/make-question-attachments'

describe('Edit Question Title or Content', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let editQuestion: EditQuestionUseCase

  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    editQuestion = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionAttachmentsRepository)
  })

  test('it should be able to edit a question', async() => {
    const question = makeQuestion(
      {
        title: 'Old title',
        content: 'Old title',
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('question-01'),
    )

    inMemoryQuestionsRepository.create(question)

    inMemoryQuestionAttachmentsRepository.questionAttachments.push(
      makeQuestionAttachments({
        attachmentId: new UniqueEntityID('attachment-01'),
        questionId: new UniqueEntityID('question-01')
      }),
      makeQuestionAttachments({
        attachmentId: new UniqueEntityID('attachment-02'),
        questionId: new UniqueEntityID('question-01')
      })
    )

    const result = await editQuestion.execute({
      authorId: 'author-01',
      questionId: 'question-01',
      content: 'New content',
      title: 'New title',
      attachmentsIds: ['attachment-01', 'attachment-03']
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryQuestionsRepository.questions[0]).toEqual(result.value.question)
    }
    expect(inMemoryQuestionsRepository.questions[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryQuestionsRepository.questions[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("attachment-01") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("attachment-03") }),
    ])
  })

  test('it should not be able to edit a nonexistent question', async() => {
    const question = makeQuestion(
      {
        title: 'Old title',
        content: 'Old title',
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('question-01'),
    )

    inMemoryQuestionsRepository.create(question)

    const result = await editQuestion.execute({
      authorId: question.authorId.toString(),
      questionId: 'nonexistent-question',
      content: 'New content',
      title: 'New title',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  test('it should not be able to edit a question from other user', async() => {
    const question = makeQuestion(
      {
        title: 'Old title',
        content: 'Old title',
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('question-01'),
    )

    inMemoryQuestionsRepository.create(question)

    const result = await editQuestion.execute({
      authorId: 'nonexistent-author',
      questionId: question.id.toString(),
      content: 'New content',
      title: 'New title',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
