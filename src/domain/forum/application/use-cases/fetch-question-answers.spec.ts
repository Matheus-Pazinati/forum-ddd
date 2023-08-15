import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { FetchQuestionAnswers } from './fetch-question-answers'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity.id'
import { makeQuestion } from 'test/factories/make-question'

describe('Fetch Question Answers', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let fetchAnswers: FetchQuestionAnswers

  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    fetchAnswers = new FetchQuestionAnswers(
      inMemoryAnswersRepository,
      inMemoryQuestionsRepository,
    )
  })

  test('it should be able to fetch question answers', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({}, new UniqueEntityID('question-01')),
    )

    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-01'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-01'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityID('question-02'),
      }),
    )

    const { answers } = await fetchAnswers.execute({
      page: 1,
      questionId: 'question-01',
    })

    expect(answers).toHaveLength(2)
  })

  test('it should not be able to fetch answers from a nonexistent question', async () => {
    expect(async () => {
      await fetchAnswers.execute({
        page: 1,
        questionId: 'question-01',
      })
    }).rejects.toBeInstanceOf(Error)
  })

  test('it should be able to return a paginated answers from a question', async () => {
    await inMemoryQuestionsRepository.create(
      makeQuestion({}, new UniqueEntityID('question-01')),
    )
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityID('question-01'),
        }),
      )
    }

    const { answers } = await fetchAnswers.execute({
      page: 2,
      questionId: 'question-01',
    })

    expect(answers).toHaveLength(2)
  })
})
