import { PageParams } from "@/core/repositories/page-params";
import { QuestionComment } from "../../enterprise/entities/question-comment";

export interface QuestionCommentsRepository {
  create(questionComment: QuestionComment): Promise<void>
  findById(questionCommentId: string): Promise<QuestionComment | null>
  findManyByQuestionId(questionId: string, params: PageParams): Promise<QuestionComment[]>
  delete(questionCommentId: string): Promise<void>
}