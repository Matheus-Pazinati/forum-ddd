import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";
import { QuestionsRepository } from "../repositories/questions-repository";

interface FetchQuestionAnswersRequest {
  page: number,
  questionId: string
}

interface FetchQuestionAnswersResponse {
  answers: Answer[]
}

export class FetchQuestionAnswers {
  constructor(
    private answersRepository: AnswersRepository,
    private questionsRepository: QuestionsRepository
    ) {}

  async execute({
    page,
    questionId
  }: FetchQuestionAnswersRequest): Promise<FetchQuestionAnswersResponse> {

    const question = await this.questionsRepository.findById(questionId)

    if (!question) {
      throw new Error("Question not found.")
    }
    const answers = await this.answersRepository.findManyByQuestionId(questionId, { page })

    return {
      answers
    }
  }
}