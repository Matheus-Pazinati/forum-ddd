import { Either, left, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository'
import { AnswerAttachmentsList } from '../../enterprise/entities/answer-attachments-list'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { UniqueEntityID } from '@/core/entities/unique-entity.id'

interface EditAnswerUseCaseRequest {
  answerId: string
  authorId: string
  content: string
  attachmentsIds?: string[]
}

type EditAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
  answer: Answer
}>

export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository
    ) {}

  async execute({
    answerId,
    authorId,
    content,
    attachmentsIds
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    const currentAnswerAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

    const answerAttachmentsList = new AnswerAttachmentsList(currentAnswerAttachments)

    if (attachmentsIds) {
      const answerAttachments = attachmentsIds.map((attachmentId) => {
        return AnswerAttachment.create({
          answerId: new UniqueEntityID(answerId),
          attachmentId: new UniqueEntityID(attachmentId)
        })
      })

      answerAttachmentsList.update(answerAttachments)
      answer.attachments = answerAttachmentsList
    }

    answer.content = content

    await this.answersRepository.save(answer)

    return right({
      answer
    })
  }
}
