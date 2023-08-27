import { Either, left, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/use-case-errors/not-allowed-error"
import { ResourceNotFoundError } from "@/core/errors/use-case-errors/resource-not-found-error"
import { NotificationsRepository } from "../repositories/notifications-repository"

interface ReadNotificationUseCaseRequest {
  receiverId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<NotAllowedError | ResourceNotFoundError, {}>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    notificationId,
    receiverId
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(new ResourceNotFoundError())
    }

    if (notification.receiverId.toString() !== receiverId) {
      return left(new NotAllowedError())
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return right({})
  }
}