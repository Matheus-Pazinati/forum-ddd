import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { CreateNotificationUseCase } from "../use-cases/create-notification"
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository"
import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { OnAnswerCreated } from "./on-answer-created"
import { SpyInstance } from "vitest"
import { makeQuestion } from "test/factories/make-question"
import { makeAnswer } from "test/factories/make-answer"
import { waitFor } from "test/utils/wait-for"

describe("Create a notification after answer", () => {
  let sendNotificationExecuteSpy: SpyInstance
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let createNotification: CreateNotificationUseCase

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
    inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    createNotification = new CreateNotificationUseCase(inMemoryNotificationsRepository)

    sendNotificationExecuteSpy = vi.spyOn(createNotification, 'execute')
    new OnAnswerCreated(inMemoryQuestionsRepository, createNotification)
  })

  test("it should be able to create a notification after answer was created", async() => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id
    })

    expect(answer.domainEvents).toHaveLength(1)

    inMemoryQuestionsRepository.create(question)
    inMemoryAnswersRepository.create(answer)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})