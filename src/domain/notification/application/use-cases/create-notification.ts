import { Either, right } from "@/core/either"
import { Notification } from "../../enterprise/entities/notification"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { NotificationsRepository } from "../repositories/notifications-repository"

interface CreateNotificationUseCaseRequest {
  receiverId: string
  title: string
  content: string
}

type CreateNotificationUseCaseResponse = Either<null, {}>

export class CreateNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    receiverId,
    title,
    content
  }: CreateNotificationUseCaseRequest): Promise<CreateNotificationUseCaseResponse> {
    const notification = Notification.create({
      receiverId: new UniqueEntityID(receiverId),
      title,
      content
    })

    await this.notificationsRepository.create(notification)

    return right({})
  }
}