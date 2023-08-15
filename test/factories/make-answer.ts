import { UniqueEntityID } from "@/core/entities/unique-entity.id";
import { Answer, AnswerProps } from "@/domain/forum/enterprise/entities/answer";
import { faker } from "@faker-js/faker";

export function makeAnswer(override: Partial<AnswerProps> = {}, id?: UniqueEntityID) {
  const answer = Answer.create({
    authorId: new UniqueEntityID("01"),
    questionId: new UniqueEntityID("01"),
    content: faker.lorem.text(),
    ...override
  }, id)

  return answer
}