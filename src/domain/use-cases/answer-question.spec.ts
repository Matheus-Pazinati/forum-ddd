import { expect, it } from 'vitest'
import { AnswerQuestionUseCase } from './answer-question'

it("should be able to answer a question", () => {
  const questionAnswer = new AnswerQuestionUseCase()

  const answer = questionAnswer.execute({
    instructorId: "1",
    questionId: "1",
    content: "Test Answer"
  })

  expect(answer.content).toEqual('Test Answer')
})