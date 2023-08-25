export interface AnswerAttachmentsRepository {
  deleteManyByAnswerId(answerId: string): Promise<void>
}