import { UniqueEntityID } from "@/core/entities/unique-entity.id";
import { AnswerAttachment } from "@/domain/forum/enterprise/entities/answer-attachment";

export function makeAnswerAttachments(override: Partial<AnswerAttachment>, id?: UniqueEntityID) {
  const answerAttachments = AnswerAttachment.create({
    answerId: new UniqueEntityID("01"),
    attachmentId: new UniqueEntityID("01"),
    ...override
  }, id)

  return answerAttachments
}