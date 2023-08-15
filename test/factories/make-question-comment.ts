import { UniqueEntityID } from "@/core/entities/unique-entity.id";
import { QuestionComment, QuestionCommentProps } from "@/domain/forum/enterprise/entities/question-comment";
import { faker } from "@faker-js/faker";

export function makeQuestionComment(override: Partial<QuestionCommentProps> = {}, id?: UniqueEntityID) {
  const questionComment = QuestionComment.create({
    authorId: new UniqueEntityID("01"),
    questionId: new UniqueEntityID("01"),
    content: faker.lorem.text(),
    ...override
  }, id)

  return questionComment
}