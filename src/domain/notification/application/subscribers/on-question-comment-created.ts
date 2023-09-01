import { EventHandler } from "@/core/events/event-handler";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { CreateNotificationUseCase } from "../use-cases/create-notification";
import { DomainEvents } from "@/core/events/domain-events";
import { QuestionCommentCreatedEvents } from "@/domain/forum/enterprise/events/question-comment-created-event";

export class OnQuestionCommentCreated implements EventHandler {

  constructor(
    private questionsRepository: QuestionsRepository,
    private createNotification: CreateNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionCommentNotification.bind(this),
      QuestionCommentCreatedEvents.name
    )
  }

  private async sendNewQuestionCommentNotification({ questionComment }: QuestionCommentCreatedEvents) {
    const question = await this.questionsRepository.findById(questionComment.questionId.toString())

    if (question) {
      await this.createNotification.execute({
        receiverId: question.authorId.toString(),
        title: `Há um novo comentário em "${question.title.substring(0, 40).concat('...')}"`,
        content: questionComment.excerption
      })
    }
  }
  
}