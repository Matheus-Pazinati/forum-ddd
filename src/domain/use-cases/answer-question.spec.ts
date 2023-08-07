import { expect, test } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'
import { AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../entities/answer'
import { UniqueEntityID } from '../../core/entities/unique-entity.id'

class FakeAnswerRepository implements AnswersRepository {
  async create(answer: Answer) {
    return
  }
}

test("it should be able to answer a question", async () => {
  const questionAnswer = new AnswerQuestionUseCase(new FakeAnswerRepository())

  const answer = await questionAnswer.execute({
    instructorId: new UniqueEntityID("1"),
    questionId: new UniqueEntityID("1"),
    content: "Test Answer"
  })

  expect(answer.content).toEqual('Test Answer')
})
