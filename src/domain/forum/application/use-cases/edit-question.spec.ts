import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity.id'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

describe('Edit Question Title or Content', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let editQuestion: EditQuestionUseCase

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    editQuestion = new EditQuestionUseCase(inMemoryQuestionsRepository)
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

    const result = await editQuestion.execute({
      authorId: 'author-01',
      questionId: 'question-01',
      content: 'New content',
      title: 'New title',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryQuestionsRepository.questions[0]).toEqual(result.value.question)
    }
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
      authorId: 'nonexistent-author',
      questionId: question.id.toString(),
      content: 'New content',
      title: 'New title',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
