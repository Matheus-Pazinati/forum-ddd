import { PaginationParams } from "@/core/repositories/page-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { InMemoryQuestionAttachmentsRepository } from "./in-memory-question-attachments-repository";

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  constructor(private inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository) {}

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

  async findManyRecent({ page }: PaginationParams) {
    const MAX_QUESTIONS_BY_PAGE = 20
    const questions = this.questions.sort((a, b) => {
      return a.createdAt.getTime() - b.createdAt.getTime()
    })
    .reverse()
    .slice((page - 1) * MAX_QUESTIONS_BY_PAGE, page * MAX_QUESTIONS_BY_PAGE)

    return questions
  }

  async save(question: Question) {
    const selectedQuestionIndex = this.questions.findIndex((item) => {
      return item.id === question.id
    })

    this.questions[selectedQuestionIndex] = question
  }

  async delete(question: Question) {
    const deletedQuestionIndex = this.questions.findIndex((item) => {
      item.id === question.id
    })

    this.questions.splice(deletedQuestionIndex, 1)
    await this.inMemoryQuestionAttachmentsRepository.deleteManyByQuestionId(question.id.toString())
  }
}
