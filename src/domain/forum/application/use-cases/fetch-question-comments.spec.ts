import { InMemoryQuestionCommentsRepository } from "test/repositories/in-memory-question-comments-repository"
import { FetchQuestionCommentsUseCase } from "./fetch-question-comments"
import { makeQuestionComment } from "test/factories/make-question-comment"
import { UniqueEntityID } from "@/core/entities/unique-entity.id"

describe("Fetch Question Comments", () => {
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
  let fetchQuestionComments: FetchQuestionCommentsUseCase

  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
    fetchQuestionComments = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
  })

  test("it should be able to fetch que question comments", async() => {
    await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
      questionId: new UniqueEntityID("question-01")
    }))
    await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
      questionId: new UniqueEntityID("question-01")
    }))
    await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
      questionId: new UniqueEntityID("question-02")
    }))

    const { questionComments } = await fetchQuestionComments.execute({
      page: 1,
      questionId: "question-01"
    })

    expect(questionComments).toHaveLength(2)
  })

  test("it should be able to fetch paginated question comments", async() => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(makeQuestionComment({
        questionId: new UniqueEntityID("question-01")
      }))
    }

    const { questionComments } = await fetchQuestionComments.execute({
      page: 2,
      questionId: "question-01"
    })

    expect(questionComments).toHaveLength(2)
  })
})