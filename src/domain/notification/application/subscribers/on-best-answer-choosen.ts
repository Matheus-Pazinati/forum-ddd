import { DomainEvents } from "@/core/events/domain-events";
import { EventHandler } from "@/core/events/event-handler";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { QuestionBestAnswerChoosenEvent } from "@/domain/forum/enterprise/events/question-best-answer-choosen-event";
import { CreateNotificationUseCase } from "../use-cases/create-notification";

export class OnBestAnswerChoosen implements EventHandler {
  
  constructor(
    private answersRepository: AnswersRepository,
    private createNotification: CreateNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions() {
    DomainEvents.register(
      this.sendNewBestAnswerChoosenNotification.bind(this),
      QuestionBestAnswerChoosenEvent.name
    )
  }

  private async sendNewBestAnswerChoosenNotification({ question, bestAnswerId }: QuestionBestAnswerChoosenEvent) {
    const answer = await this.answersRepository.findById(bestAnswerId.toString())

    if (answer) {
      await this.createNotification.execute({
        receiverId: answer.authorId.toString(),
        title: "Sua resposta foi escolhida!",
        content: `Sua resposta na pergunta "${question.title.substring(0, 20).concat('...')}" foi escolhida como a melhor!`
      })
    }
  }
  
}