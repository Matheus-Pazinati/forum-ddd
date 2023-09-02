import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { SpyInstance } from "vitest"
import { CreateNotificationUseCase } from "../use-cases/create-notification"
import { waitFor } from "test/utils/wait-for"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository"
import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository"
import { OnAnswerCommentCreated } from "./on-answer-comment-created"
import { makeAnswer } from "test/factories/make-answer"
import { makeAnswerComment } from "test/factories/make-answer-comment"

describe("Create notification after create a answer comment", () => {
    let sendNotificationExecuteSpy: SpyInstance
    let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
    let inMemoryAnswersRepository: InMemoryAnswersRepository
    let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
    let inMemoryNotificationsRepository: InMemoryNotificationsRepository
    let createNotification: CreateNotificationUseCase
  
    beforeEach(() => {
      inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
      inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
      inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
      inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
      createNotification = new CreateNotificationUseCase(inMemoryNotificationsRepository)
  
      sendNotificationExecuteSpy = vi.spyOn(createNotification, 'execute')
      new OnAnswerCommentCreated(inMemoryAnswersRepository, createNotification)
  })

  test("it should be able to create a notification after create a answer comment", async() => {
    const answer = makeAnswer()
    const answerComment = makeAnswerComment({
      answerId: answer.id
    })

    expect(answerComment.domainEvents).toHaveLength(1)

    inMemoryAnswersRepository.create(answer)
    inMemoryAnswerCommentsRepository.create(answerComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})