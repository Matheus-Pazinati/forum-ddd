import { InMemoryAnswerAttachmentsRepository } from "test/repositories/in-memory-answer-attachments-repository"
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { InMemoryQuestionAttachmentsRepository } from "test/repositories/in-memory-question-attachments-repository"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { SpyInstance } from "vitest"
import { CreateNotificationUseCase } from "../use-cases/create-notification"
import { OnBestAnswerChoosen } from "./on-best-answer-choosen"
import { makeQuestion } from "test/factories/make-question"
import { makeAnswer } from "test/factories/make-answer"
import { waitFor } from "test/utils/wait-for"

describe("Send notification to the author of a question best answer", () => {
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
    new OnBestAnswerChoosen(inMemoryAnswersRepository, createNotification)
  })

  test("it should be able to send a notification to the author of best answer id", async() => {
    const question = makeQuestion()
    const answer = makeAnswer({
      questionId: question.id
    })

    inMemoryQuestionsRepository.create(question)
    inMemoryAnswersRepository.create(answer)

    question.bestAnswerId = answer.id

    expect(question.domainEvents).toHaveLength(1)

    inMemoryQuestionsRepository.save(question)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})