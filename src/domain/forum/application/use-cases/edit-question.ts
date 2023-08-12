import { QuestionsRepository } from "../repositories/questions-repository";

interface EditQuestionUseCaseRequest {
  authorId: string,
  questionId: string,
  title: string,
  content: string
}

export class EditQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    title
  }: EditQuestionUseCaseRequest) {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error("Question not found.")
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error("Not allowed.")
    }

    question.title = title
    question.content = content

    await this.questionsRepository.save(question)
  }
}