import { UniqueEntityID } from "../../core/entities/unique-entity.id"
import { Answer } from "../entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"

interface AnswerQuestionUseCaseRequest {
  questionId: UniqueEntityID,
  instructorId: UniqueEntityID,
  content: string
}

export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    content,
    instructorId,
    questionId
  }: AnswerQuestionUseCaseRequest) {
    const answer = new Answer({
      authorId: instructorId,
      content,
      questionId,
      createdAt: new Date()
    })

    await this.answersRepository.create(answer)

    return answer
  }
}