import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";


export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  public questionAttachments: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.questionAttachments.filter((attachments) => {
      return attachments.questionId.toString() === questionId
    })

    return questionAttachments
  }
  
}