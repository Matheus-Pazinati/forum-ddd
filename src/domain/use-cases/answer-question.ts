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
    const answer = new Answer({
      authorId: instructorId,
      content,
      questionId
    })

    return answer
  }
}