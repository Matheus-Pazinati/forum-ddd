import { PageParams } from '@/core/repositories/page-params'
import { Answer } from '../../enterprise/entities/answer'

export interface AnswersRepository {
  findById(answerId: string): Promise<Answer | null>
  findManyByQuestionId(
    questionId: string,
    params: PageParams,
  ): Promise<Answer[]>
  create(answer: Answer): Promise<void>
  save(answer: Answer): Promise<void>
  delete(answer: Answer): Promise<void>
}
