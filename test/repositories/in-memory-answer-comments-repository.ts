import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public comments: AnswerComment[] = []
  async create(answerComment: AnswerComment){
    this.comments.push(answerComment)
  }
  
}