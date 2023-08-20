import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity.id'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

describe('Edit Answer Content', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let editAnswer: EditAnswerUseCase

  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    editAnswer = new EditAnswerUseCase(inMemoryAnswersRepository)
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

    const result = await editAnswer.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'New content',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryAnswersRepository.answers[0]).toEqual(result.value.answer)
    }
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
