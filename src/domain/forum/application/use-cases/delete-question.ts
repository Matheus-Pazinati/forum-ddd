import { QuestionsRepository } from "../repositories/questions-repository";

interface DeleteQuestionUseCaseRequest {
  questionId: string
  authorId: string
}

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    questionId,
    authorId
  }: DeleteQuestionUseCaseRequest) {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error("Question not found.")
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error("Not allowed.")
    }

    await this.questionsRepository.delete(question)
  }
}