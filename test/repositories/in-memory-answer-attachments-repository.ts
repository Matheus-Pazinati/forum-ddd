import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  public answerAttachments: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string) {
    const attachments = this.answerAttachments.filter((attachment) => {
      return attachment.answerId.toString() === answerId
    })

    return attachments
  }

  async deleteManyByAnswerId(answerId: string) {
    const attachments = this.answerAttachments.filter((attachment) => {
      return attachment.answerId.toString() !== answerId
    })

    this.answerAttachments = attachments
  }
  
}