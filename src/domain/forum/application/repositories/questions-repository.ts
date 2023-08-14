import { PageParams } from '@/core/repositories/page-params'
import { Question } from '../../enterprise/entities/question'

export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>
  create(question: Question): Promise<void>
  findBySlug(slug: string): Promise<Question | null>
  findManyRecent(params: PageParams): Promise<Question[]>
  save(question: Question): Promise<void>
  delete(question: Question): Promise<void>
}
