import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-repository"
import { EditAnswerUseCase } from "./edit-answer"
import { makeAnswer } from "test/factories/make-answer"
import { UniqueEntityID } from "@/core/entities/unique-entity.id"

describe("Edit Answer Content", () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let editAnswer: EditAnswerUseCase

  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    editAnswer = new EditAnswerUseCase(inMemoryAnswersRepository)
  })

  test("it should be able to edit a answer", async() => {
    const answer = makeAnswer({
      authorId: new UniqueEntityID("author-01"),
      content: "Old content"
    }, new UniqueEntityID("answer-01"))

    inMemoryAnswersRepository.create(answer)

    await editAnswer.execute({
      answerId: "answer-01",
      authorId: "author-01",
      content: "New content"
    })

    expect(inMemoryAnswersRepository.answers[0].content).toEqual("New content")
  })
})