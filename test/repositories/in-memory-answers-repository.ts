import { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository";
import { Answer } from "@/domain/forum/enterprise/entities/answer";

export class InMemoryAnswersRepository implements AnswersRepository {
  public answers: Answer[] = []

  async findById(answerId: string) {
    const answer = this.answers.find((answer) => {
      return answer.id.toString() === answerId
    })

    if (!answer) {
      return null
    }

    return answer
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


  }
}