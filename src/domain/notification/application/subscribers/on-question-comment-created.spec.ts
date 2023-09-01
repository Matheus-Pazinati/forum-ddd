import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { SpyInstance } from "vitest"
import { CreateNotificationUseCase } from "../use-cases/create-notification"
import { OnQuestionCommentCreated } from "./on-question-comment-created"
import { makeQuestion } from "test/factories/make-question"
import { makeQuestionComment } from "test/factories/make-question-comment"
import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository"
import { waitFor } from "test/utils/wait-for"

describe("Create notification after create a question comment", () => {
    let sendNotificationExecuteSpy: SpyInstance
    let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
    let inMemoryQuestionsRepository: InMemoryQuestionsRepository
    let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
    let inMemoryNotificationsRepository: InMemoryNotificationsRepository
    let createNotification: CreateNotificationUseCase
  
    beforeEach(() => {
      inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
      inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
      inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
      createNotification = new CreateNotificationUseCase(inMemoryNotificationsRepository)
  
      sendNotificationExecuteSpy = vi.spyOn(createNotification, 'execute')
      new OnQuestionCommentCreated(inMemoryQuestionsRepository, createNotification)
  })

  test("it should be able to create a notification after create a question comment", async() => {
    const question = makeQuestion()
    const questionComment = makeQuestionComment({
      questionId: question.id
    })

    expect(questionComment.domainEvents).toHaveLength(1)

    inMemoryQuestionsRepository.create(question)
    inMemoryQuestionCommentsRepository.create(questionComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})