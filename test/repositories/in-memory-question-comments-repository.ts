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