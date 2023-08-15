import { InMemoryAnswerCommentsRepository } from "test/repositories/in-memory-answer-comments-repository"
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments"
import { makeAnswerComment } from "test/factories/make-answer-comment"
import { UniqueEntityID } from "@/core/entities/unique-entity.id"

describe("Fetch Answer Comments", () => {
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let fetchAnswerComments: FetchAnswerCommentsUseCase

  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
    fetchAnswerComments = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  })

  test("it should be able to fetch the answers comments", async() => {
    await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
      answerId: new UniqueEntityID("answer-01")
    }))
    await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
      answerId: new UniqueEntityID("answer-01")
    }))
    await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
      answerId: new UniqueEntityID("answer-02")
    }))

    const { answerComments } = await fetchAnswerComments.execute({
      page: 1,
      answerId: "answer-01"
    })

    expect(answerComments).toHaveLength(2)
  })

  test("it should be able to fetch paginated answer comments", async() => {
    for(let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(makeAnswerComment({
        answerId: new UniqueEntityID("answer-01")
      }))
    }

    const { answerComments } = await fetchAnswerComments.execute({
      page: 2,
      answerId: "answer-01"
    })

    expect(answerComments).toHaveLength(2)
  })
})