import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { CreateNotificationUseCase } from "./create-notification"

describe("Create Notification", () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let createNotification: CreateNotificationUseCase

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    createNotification = new CreateNotificationUseCase(inMemoryNotificationsRepository)
  })

  test("it should be able to create a notification", async() => {
    const result = await createNotification.execute({
      receiverId: "receiver-01",
      title: "new notification",
      content: "notification content"
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.notifications).toHaveLength(1)
    expect(inMemoryNotificationsRepository.notifications).toEqual([
      expect.objectContaining({ title: "new notification" })
    ])
  })
})