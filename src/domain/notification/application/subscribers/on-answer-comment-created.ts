import { EventHandler } from "@/core/events/event-handler";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { CreateNotificationUseCase } from "../use-cases/create-notification";
import { DomainEvents } from "@/core/events/domain-events";
import { AnswerCommentCreatedEvent } from "@/domain/forum/enterprise/events/answer-comment-created-event";

export class OnAnswerCommentCreated implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private createNotification: CreateNotificationUseCase
  ) {
    this.setupSubscriptions()
  }
  setupSubscriptions(): void {
    DomainEvents.register(
      this.createNewAnswerCommentNotification.bind(this),
      AnswerCommentCreatedEvent.name
    )
  }

  private async createNewAnswerCommentNotification({ answerComment }: AnswerCommentCreatedEvent) {
    const answer = await this.answersRepository.findById(answerComment.answerId.toString())

    if (answer) {
      await this.createNotification.execute({
        receiverId: answer.authorId.toString(),
        title: `Novo comentário na resposta`,
        content: answerComment.excerption
      })
    }
  }
}