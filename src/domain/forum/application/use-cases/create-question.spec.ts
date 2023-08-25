import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CreateQuestionUseCase } from './create-question'
import { UniqueEntityID } from '@/core/entities/unique-entity.id'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let createQuestion: CreateQuestionUseCase
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

describe('Create a question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    createQuestion = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  test('it should be able to create a question', async () => {
    const result = await createQuestion.execute({
      authorId: '01',
      content: 'How to create tests ?',
      title: 'Create test',
      attachmentsIds: ["attachment-1", "attachment-2"]
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.questions[0]).toEqual(result.value?.question)
    expect(inMemoryQuestionsRepository.questions[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryQuestionsRepository.questions[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID("attachment-1") }),
      expect.objectContaining({ attachmentId: new UniqueEntityID("attachment-2") }),
    ])
  })
})
