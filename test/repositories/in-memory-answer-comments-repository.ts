import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public comments: AnswerComment[] = []

  async findById(answerCommentId: string) {
    const answerComment = this.comments.find((comment) => {
      return comment.id.toString() === answerCommentId
    })

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async create(answerComment: AnswerComment){
    this.comments.push(answerComment)
  }

  async delete(answerCommentId: string) {
    const selectedAnswerCommentIndex = this.comments.findIndex((comment) => {
      return comment.id.toString() === answerCommentId
    })

    this.comments.splice(selectedAnswerCommentIndex, 1)
  }
  
}