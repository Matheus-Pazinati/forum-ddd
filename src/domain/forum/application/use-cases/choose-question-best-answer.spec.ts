import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository"
import { ChooseQuestionBestAnswerUseCase } from "./choose-question-best-answer"
import { makeQuestion } from "test/factories/make-question"
import { UniqueEntityID } from "@/core/entities/unique-entity.id"
import { makeAnswer } from "test/factories/make-answer"

describe("Choose the best answer for a question", () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let chooseBestAnswer: ChooseQuestionBestAnswerUseCase

  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    chooseBestAnswer = new ChooseQuestionBestAnswerUseCase(inMemoryQuestionsRepository, inMemoryAnswersRepository)
  })

  test("it should be able to choose a question best answer", async() => {
    const question = makeQuestion({
      authorId: new UniqueEntityID("author-01")
    }, new UniqueEntityID("question-01"))

    inMemoryQuestionsRepository.create(question)

    const answer = makeAnswer({
      questionId: new UniqueEntityID("question-01")
    }, new UniqueEntityID("answer-01"))

    inMemoryAnswersRepository.create(answer)

    await chooseBestAnswer.execute({
      answerId: "answer-01",
      authorId: "author-01"
    })

    expect(inMemoryQuestionsRepository.questions[0].bestAnswerId).toEqual(answer.id)
  })

  test("it should not be able to other user choose the question best answer", async() => {
    const question = makeQuestion({
      authorId: new UniqueEntityID("author-01")
    }, new UniqueEntityID("question-01"))

    inMemoryQuestionsRepository.create(question)

    const answer = makeAnswer({
      questionId: new UniqueEntityID("question-01")
    }, new UniqueEntityID("answer-01"))

    inMemoryAnswersRepository.create(answer)

    expect(async() => {
      await chooseBestAnswer.execute({
        answerId: "answer-01",
        authorId: "author-02"
      })
    }).rejects.toBeInstanceOf(Error)
  })

  test("it should not be able to choose a nonexistent answer to be the question best answer", async() => {
    const question = makeQuestion({
      authorId: new UniqueEntityID("author-01")
    }, new UniqueEntityID("question-01"))

    inMemoryQuestionsRepository.create(question)

    const answer = makeAnswer({
      questionId: new UniqueEntityID("question-01")
    }, new UniqueEntityID("answer-01"))

    inMemoryAnswersRepository.create(answer)

    expect(async() => {
      await chooseBestAnswer.execute({
        answerId: "answer-02",
        authorId: "author-01"
      })
    }).rejects.toBeInstanceOf(Error)
  })

})