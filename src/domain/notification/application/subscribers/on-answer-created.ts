import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { AnswerCreatedEvent } from "@/domain/forum/enterprise/events/answer-created-event";
import { CreateNotificationUseCase } from "../use-cases/create-notification";

export class OnAnswerCreated implements EventHandler {
  constructor(
    private questionsRepository: QuestionsRepository,
    private createNotification: CreateNotificationUseCase
  ) {
    this.setupSubscriptions()
  }
  
  setupSubscriptions() {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name
    )
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(answer.questionId.toString())

    if (question) {
      await this.createNotification.execute({
        receiverId: question.authorId.toString(),
        title: `Nova resposta para "${question.title.substring(0, 40).concat('...')}"`,
        content: question.excerption
      })
    }
  }
  
}