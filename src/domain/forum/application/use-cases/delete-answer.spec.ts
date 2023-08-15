import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from './delete-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity.id'

describe('Delete a Answer', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let deleteAnswer: DeleteAnswerUseCase

  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    deleteAnswer = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  test('it should be able to delete a answer', async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )

    inMemoryAnswersRepository.create(answer)

    await deleteAnswer.execute({
      answerId: 'answer-01',
      authorId: 'author-01',
    })

    expect(inMemoryAnswersRepository.answers).toHaveLength(0)
  })

  test('it should not be able to delete a answer from other user', async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )

    inMemoryAnswersRepository.create(answer)

    expect(async () => {
      await deleteAnswer.execute({
        answerId: 'answer-01',
        authorId: 'author-02',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  test('it should not be able to delete a nonexistent answer', async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-01'),
      },
      new UniqueEntityID('answer-01'),
    )

    inMemoryAnswersRepository.create(answer)

    expect(async () => {
      await deleteAnswer.execute({
        answerId: 'answer-02',
        authorId: 'author-01',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
