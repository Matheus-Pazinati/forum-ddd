import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { makeQuestion } from 'test/factories/make-question'
import { ResourceNotFoundError } from '@/core/errors/use-case-errors/resource-not-found-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

describe('Search a Question by his Slug', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let searchBySlug: GetQuestionBySlugUseCase
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

  beforeEach(() => {
    let inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    searchBySlug = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  test('it should be able to get a question by his slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('test-slug'),
    })

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await searchBySlug.execute({
      slug: 'test-slug',
    })

    expect(result.isRight()).toBe(true)
  })

  test('it should not be able to get a inexistent question by slug', async () => {
    const result = await searchBySlug.execute({
      slug: 'slug-test',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
