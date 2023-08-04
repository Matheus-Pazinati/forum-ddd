import { Answer } from "../entities/answer"

interface AnswerQuestionUseCaseRequest {
  questionId: string,
  instructorId: string,
  content: string
}

export class AnswerQuestionUseCase {
  execute({
    content,
    instructorId,
    questionId
  }: AnswerQuestionUseCaseRequest) {
    const answer = new Answer(content)

    return answer
  }
}