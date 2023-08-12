import { AnswersRepository } from "../repositories/answers-repository";

interface EditAnswerUseCaseRequest {
  answerId: string
  authorId: string
  content: string
}

export class EditAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
    content
  }: EditAnswerUseCaseRequest) {
    const answer = await this.answersRepository.findById(answerId)

    if (!answer) {
      throw new Error("Answer not found.")
    }

    if (answer.authorId.toString() !== authorId) {
      throw new Error("Not allowed.")
    }

    answer.content = content
  }
}