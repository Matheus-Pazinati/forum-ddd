import { InMemoryNotificationsRepository } from "test/repositories/in-memory-notifications-repository"
import { ReadNotificationUseCase } from "./read-notification"
import { makeNotification } from "test/factories/make-notification"
import { NotAllowedError } from "@/core/errors/use-case-errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/use-case-errors/resource-not-found-error"

describe("Read Notification", () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let readNotification: ReadNotificationUseCase

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    readNotification = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })

  test("it should be able to read a notification", async() => {
    const notification = makeNotification()

    inMemoryNotificationsRepository.create(notification)

    const result = await readNotification.execute({
      notificationId: notification.id.toString(),
      receiverId: notification.receiverId.toString()
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationsRepository.notifications[0].readAt).toEqual(expect.any(Date))
  })

  test("it should not be able to read a nonexistent notification", async() => {
    const notification = makeNotification()

    inMemoryNotificationsRepository.create(notification)

    const result = await readNotification.execute({
      notificationId: "nonexistent-notification",
      receiverId: notification.receiverId.toString()
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  test("it should not be able to read a notification from anotther user", async() => {
    const notification = makeNotification()

    inMemoryNotificationsRepository.create(notification)

    const result = await readNotification.execute({
      notificationId: notification.id.toString(),
      receiverId: "nonexistent-receiver"
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})