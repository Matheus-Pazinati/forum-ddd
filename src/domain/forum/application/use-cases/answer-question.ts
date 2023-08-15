import { UniqueEntityID } from '@/core/entities/unique-entity.id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

interface AnswerQuestionUseCaseRequest {
  questionId: string
  instructorId: string
  content: string
}

interface AnswerQuestionUseCaseResponse {
  answer: Answer
}

export class AnswerQuestionUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private questionsRepository: QuestionsRepository
    ) {}

  async execute({
    content,
    instructorId,
    questionId,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {

    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error("Question not found.")
    }
    
    const answer = Answer.create({
      authorId: new UniqueEntityID(instructorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    await this.answersRepository.create(answer)

    return {
      answer,
    }
  }
}
