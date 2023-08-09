import { AnswerQuestionUseCase } from './answer-question'
import { AnswersRepository } from '../repositories/answers-repository'
import { Answer } from '../entities/answer'

class FakeAnswerRepository implements AnswersRepository {
  async create(answer: Answer) {
    // TODO: create a InMemoryDatabaseTest
    console.log(answer)
  }
}

test('it should be able to answer a question', async () => {
  const questionAnswer = new AnswerQuestionUseCase(new FakeAnswerRepository())

  const answer = await questionAnswer.execute({
    instructorId: '1',
    questionId: '1',
    content: 'Test Answer',
  })

  expect(answer.content).toEqual('Test Answer')
})
