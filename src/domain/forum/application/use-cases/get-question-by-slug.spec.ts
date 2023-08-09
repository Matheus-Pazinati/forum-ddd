import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { UniqueEntityID } from '@/core/entities/unique-entity.id'
import { Question } from '../../enterprise/entities/question'
import { Slug } from '../../enterprise/entities/value-objects/slug'

describe('Search a Question by his Slug', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let searchBySlug: GetQuestionBySlugUseCase

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    searchBySlug = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  test('it should be able to get a question by his slug', async () => {
    const newQuestion = Question.create({
      authorId: new UniqueEntityID('01'),
      content: 'Test question',
      title: 'Test question',
      slug: Slug.create('test-question'),
    })

    await inMemoryQuestionsRepository.create(newQuestion)

    const { question } = await searchBySlug.execute({
      slug: newQuestion.slug.value,
    })

    expect(question.id).toBeTruthy()
  })

  test('it should not be able to get a inexistent question by slug', async () => {
    expect(async () => {
      await searchBySlug.execute({
        slug: 'slug-test',
      })
    }).rejects.toBeInstanceOf(Error)
  })
})
