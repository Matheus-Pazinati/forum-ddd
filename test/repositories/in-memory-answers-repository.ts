import { PaginationParams } from "@/core/repositories/page-params";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {
  public answers: Answer[] = []

  constructor(private answerAttachmentsRepository: AnswerAttachmentsRepository) {}

  async findById(answerId: string) {
    const answer = this.answers.find((answer) => {
      return answer.id.toString() === answerId
    })

    if (!answer) {
      return null
    }

    return answer
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const MAX_ANSWERS_BY_PAGE = 20
    const answers = this.answers.filter((answer) => {
      return answer.questionId.toString() === questionId
    })
    .slice((page - 1) * MAX_ANSWERS_BY_PAGE, page * MAX_ANSWERS_BY_PAGE)

    return answers
  }

  async create(answer: Answer) {
    this.answers.push(answer)
  }

  async save(answer: Answer): Promise<void> {
    const selectedAnswerIndex = this.answers.findIndex((item) => {
      return item.id === answer.id
    })

    this.answers[selectedAnswerIndex] = answer
  }

  async delete(answer: Answer): Promise<void> {
    const deletedAnswerIndex = this.answers.findIndex((item) => {
      return item.id === answer.id
    })

    this.answers.splice(deletedAnswerIndex, 1)
    await this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())

  }
}