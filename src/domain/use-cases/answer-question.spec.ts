import { expect, it } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'
import { AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../entities/answer'

class FakeAnswerRepository implements AnswersRepository {
  async create(answer: Answer) {
    return
  }
}

it("should be able to answer a question", async () => {
  const questionAnswer = new AnswerQuestionUseCase(new FakeAnswerRepository())

  const answer = await questionAnswer.execute({
    instructorId: "1",
    questionId: "1",
    content: "Test Answer"
  })

  expect(answer.content).toEqual('Test Answer')
})
