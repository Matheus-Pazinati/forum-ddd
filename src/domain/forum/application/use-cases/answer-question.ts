import { UniqueEntityID } from '@/core/entities/unique-entity.id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/use-case-errors/resource-not-found-error'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentsList } from '../../enterprise/entities/answer-attachments-list'

interface AnswerQuestionUseCaseRequest {
  questionId: string
  instructorId: string
  content: string
  attachmentsIds?: string[]
}

type AnswerQuestionUseCaseResponse = Either<ResourceNotFoundError, {
  answer: Answer
}>

export class AnswerQuestionUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private questionsRepository: QuestionsRepository
    ) {}

  async execute({
    content,
    instructorId,
    questionId,
    attachmentsIds
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {

    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }
    
    const answer = Answer.create({
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    if (attachmentsIds) {
      const answerAttachmentsList = attachmentsIds.map((attachmentId) => {
        return AnswerAttachment.create({
          answerId: answer.id,
          attachmentId: new UniqueEntityID(attachmentId)
        })
      })

      answer.attachments = new AnswerAttachmentsList(answerAttachmentsList)
    }

    await this.answersRepository.create(answer)

    return right({
      answer
    })
  }
}
