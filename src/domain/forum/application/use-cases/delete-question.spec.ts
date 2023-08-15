import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity.id'

describe('Delete a Question', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let deleteQuestion: DeleteQuestionUseCase
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
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

    await deleteQuestion.execute({
      authorId: 'author-1',
      questionId: 'question-1',
    })

    expect(inMemoryQuestionsRepository.questions).toHaveLength(0)
  })

  test('it should not be able to delete a question from other user', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    inMemoryQuestionsRepository.create(newQuestion)

    expect(async () => {
      await deleteQuestion.execute({
        authorId: 'author-2',
        questionId: 'question-1',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  test('it should not be able to delete a nonexistent question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    inMemoryQuestionsRepository.create(newQuestion)

    expect(async () => {
      await deleteQuestion.execute({
        authorId: 'author-1',
        questionId: 'question-2',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
