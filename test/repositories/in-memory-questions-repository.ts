import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  async findById(id: string) {
    const question = this.questions.find((question) => {
      return question.id.toString() === id
    })

    if (!question) {
      return null
    }

    return question
  }

  async create(question: Question) {
    this.questions.push(question)
  }

  async findBySlug(slug: string) {
    const question = this.questions.find((question) => {
      return question.slug.value === slug
    })

    if (!question) {
      return null
    }

    return question
  }

  async delete(question: Question) {
    const deletedQuestionIndex = this.questions.findIndex((item) => {
      item.id === question.id
    })

    this.questions.splice(deletedQuestionIndex, 1)
  }
}
