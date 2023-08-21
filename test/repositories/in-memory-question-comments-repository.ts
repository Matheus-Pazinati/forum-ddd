import { PaginationParams } from "@/core/repositories/page-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  public comments: QuestionComment[] = []

  async findById(questionCommentId: string) {
    const questionComment = this.comments.find((comment) => {
      return comment.id.toString() === questionCommentId
    })

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const MAX_COMMENTS_BY_PAGE = 20
    const questionComments = this.comments.filter((comment) => {
      return comment.questionId.toString() === questionId
    })
    .slice((page - 1) * MAX_COMMENTS_BY_PAGE, page * MAX_COMMENTS_BY_PAGE)

    return questionComments
  }
  
  async create(questionComment: QuestionComment) {
    this.comments.push(questionComment)
  }

  async delete(questionCommentId: string) {
    const selectedQuestionCommentIndex = this.comments.findIndex((comment) => {
      return comment.id.toString() === questionCommentId
    })

    this.comments.splice(selectedQuestionCommentIndex, 1)
  }
}